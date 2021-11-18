import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ContactService } from '../contacts/contact.service';


@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();
  maxMessageId: number;

  constructor(private http: HttpClient, private contactsService: ContactService) {
    this.messages = MOCKMESSAGES;
  }

  storeMessages(){
    this.http.put(
      'https://wkcms-58799-default-rtdb.firebaseio.com/messages.json',
      JSON.stringify(this.messages),
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      }
    ).subscribe(() => {
      let messagesListClone = this.messages.slice();
      this.messageChangedEvent.next(messagesListClone);
    })
  }

  getMessages(): any{
    this.http
      .get<Message[]>(
        'https://wkcms-58799-default-rtdb.firebaseio.com/messages.json'
      )
      .subscribe((messages: Message[]) => {
        this.messages = messages;
        console.log(this.messages)
        this.maxMessageId = this.getMaxId();
        this.messages.sort(function (a, b) {
          var nameA = a.subject.toUpperCase();
          var nameB = b.subject.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        let messagesListClone = this.messages.slice();
        this.messageChangedEvent.next(messagesListClone);
      }),
      (error: any) => {
        console.log(error);
      };
  }

  getMessage(id: string) {
    this.messages.forEach((message) => {
      if (message.id === id) {
        return message;
      }
    });
  }

  addMessage(message: Message) {
    this.messages.push(message);
    // this.messageChangedEvent.emit(this.messages.slice());
    this.storeMessages();
  }

  getMaxId(): number {
    let maxId = 0;
    this.messages.forEach((message) => {
      let currentId = +message.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }
}
