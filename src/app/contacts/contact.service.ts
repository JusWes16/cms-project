import {EventEmitter, Injectable} from '@angular/core';
import { Subject } from 'rxjs';
import {Contact} from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] =[];

  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();

  maxContactId: number;

  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getContacts(): Contact[]{
    return this.contacts.slice();
  }

  // Not sure why using a forecah loop didnt work unless I did it like this. The traditional for loop seems to work fine though. 
  // getContact(id: string): Contact {
  //   let final_contact;
  //   this.contacts.forEach(contact => {
  //     if(contact.id === id){
  //       final_contact = contact;
  //     }
  //   });
  //   return final_contact ?? null;
  // }

  getContact(id: string): Contact {
    for (let i = 0; i < this.contacts.length; i++) {
      if (id === this.contacts[i].id) {
        return this.contacts[i];
      }
    }
    return null;
  }

  // deleteContact(contact: Contact) {
  //   if (!contact) {
  //      return;
  //   }
  //   const pos = this.contacts.indexOf(contact);
  //   if (pos < 0) {
  //      return;
  //   }
  //   this.contacts.splice(pos, 1);
  //   this.contactChangedEvent.emit(this.contacts.slice());
  // }

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

  addContact(newContact: Contact) {
    if (newContact === undefined || null) {
      return;
    }
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    let contactsListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactsListClone);
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (originalContact || newContact === undefined || null) {
      return;
    }
    let pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    let contactsListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactsListClone);
  }

  deleteContact(contact: Contact) {
    if (contact === undefined || null) {
      return;
    }
    let pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    let contactsListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactsListClone);
  }
}
