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

  constructor(
    private http: HttpClient,
    private contactsService: ContactService
  ) {
    this.messages = MOCKMESSAGES;
  }

  storeMessages(){
    // this.http.put(
    //   'https://wkcms-58799-default-rtdb.firebaseio.com/messages.json',
    //   JSON.stringify(this.messages),
    //   {
    //     headers: new HttpHeaders({'Content-Type': 'application/json'})
    //   }
    // ).subscribe(() => {
      let messagesListClone = this.messages.slice();
      this.messageChangedEvent.next(messagesListClone);
    // })
  }

  getMessages(): any {
    this.http
      .get<Message[]>('http://localhost:3000/messages')
      .subscribe((messages: Message[]) => {
        this.messages = messages;
        this.messages  = JSON.parse(JSON.stringify(this.messages)).messages;
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
    if (!message) {
      return;
    }

    // make sure id of the new Document is empty
    message.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string; messageAdded: Message }>(
        'http://localhost:3000/messages',
        message,
        { headers: headers }
      )
      .subscribe((responseData) => {
        // add new document to documents
        this.messages.push(responseData.messageAdded);
        this.storeMessages();
      });
  }

  // addMessage(message: Message) {
  //   this.messages.push(message);
  //   this.messageChangedEvent.emit(this.messages.slice());
  //   this.storeMessages();
  // }

  updateMessage(originalMessage: Message, newMessage: Message) {
    if (!originalMessage || !newMessage) {
      return;
    }

    const pos = this.messages.findIndex((d) => d.id === originalMessage.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newMessage.id = originalMessage.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update database
    this.http
      .put(
        'http://localhost:3000/messages/' + originalMessage.id,
        newMessage,
        { headers: headers }
      )
      .subscribe((response: Response) => {
        this.messages[pos] = newMessage;
        this.storeMessages();
      });
  }

  deleteMessage(message: Message) {
    if (!message) {
      return;
    }

    const pos = this.messages.findIndex((d) => d.id === message.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http
      .delete('http://localhost:3000/messages/' + message.id)
      .subscribe((response: Response) => {
        this.messages.splice(pos, 1);
        this.storeMessages();
      });
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
