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
    new Document(1, 'Test document 1', 'Document description 1', 'test@test.com', []),
    new Document(1, 'Test document 2', 'Document description 2', 'test@test.com', []),
    new Document(1, 'Test document 3', 'Document description 3', 'test@test.com', []),
    new Document(1, 'Test document 4', 'Document description 4', 'test@test.com', []),
    new Document(1, 'Test document 5', 'Document description 5', 'test@test.com', [])
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document){
    this.selectedDocumentEvent.emit(document);
  }

}
