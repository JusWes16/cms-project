import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message(1, 'Question', 'When is assignment 3 due?', 'Steve Johnson'),
    new Message(2, 'Grades', 'The grades for this assignment have been posted.', 'Bro. Jackson'),
    new Message(3, 'Meeting', 'Can I meet with you next Tuesday at 3?', 'Mark Smith')
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onAddMessage(message: Message){
    this.messages.push(message);
  }

}
