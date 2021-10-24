import {EventEmitter, Injectable} from '@angular/core';
import {Contact} from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] =[];

  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();

  constructor() {
    this.contacts = MOCKCONTACTS;
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

  deleteContact(contact: Contact) {
    if (!contact) {
       return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
       return;
    }
    this.contacts.splice(pos, 1);
    this.contactChangedEvent.emit(this.contacts.slice());
  }
}
