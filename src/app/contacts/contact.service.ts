import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contacts: Contact[] = [];

  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();

  maxContactId: number;

  constructor(private http: HttpClient) {
    this.maxContactId = this.getMaxId();
  }

  updateContactsView() {
    let contactsListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactsListClone);
  }

  getContacts(): any {
    this.http
      .get<Contact[]>('http://localhost:3000/contacts')
      .subscribe((contacts: Contact[]) => {
        this.contacts = contacts;
        this.contacts = JSON.parse(JSON.stringify(this.contacts)).contacts;
        this.maxContactId = this.getMaxId();
        this.contacts.sort(function (a, b) {
          var nameA = a.name.toUpperCase();
          var nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        let contactsListClone = this.contacts.slice();
        this.contactListChangedEvent.next(contactsListClone);
      }),
      (error: any) => {
        console.log(error);
      };
  }

  getContact(id: string): Contact {
    for (let i = 0; i < this.contacts.length; i++) {
      if (id === this.contacts[i].id) {
        return this.contacts[i];
      }
    }
    return null;
  }

  getMaxId(): number {
    let maxId = 0;
    this.contacts.forEach((contact) => {
      let currentId = +contact.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  addContact(contact: Contact) {
    if (!contact) {
      return;
    }
    contact.id = '';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: string; contact: Contact }>(
        'http://localhost:3000/contacts',
        contact,
        { headers: headers }
      )
      .subscribe((responseData) => {
        this.contacts.push(responseData.contact);
        this.updateContactsView();
      });
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.findIndex((d) => d.id === originalContact.id);

    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put('http://localhost:3000/contacts/' + originalContact.id, newContact, {
        headers: headers,
      })
      .subscribe((response: Response) => {
        this.contacts[pos] = newContact;
        this.updateContactsView();
      });
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex((d) => d.id === contact.id);

    if (pos < 0) {
      return;
    }

    this.http
      .delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe((response: Response) => {
        this.contacts.splice(pos, 1);
        this.updateContactsView();
      });
  }
}
