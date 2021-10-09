import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document(1, 'CSE 212 - Programming with Data Structures', 'CSE 212 description', 'https://test@test.com', []),
    new Document(2, 'CSE 310 - Applied Programming', 'CSE 310 description', 'https://test@test.com', []),
    new Document(3, 'WDD 331 - Advanced CSS', 'WDD 331 description', 'https://test@test.com', []),
    new Document(4, 'WDD 430 - Web Full-Stack Development', 'WDD 430 description', 'https://test@test.com', []),
    new Document(5, 'GS 107 - Technology Basics', 'GS 107 description', 'https://test@test.com', [])
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document){
    this.selectedDocumentEvent.emit(document);
  }

}
