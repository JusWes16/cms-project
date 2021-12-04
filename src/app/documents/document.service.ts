import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();

  maxDocumentId: number;

  documents: Document[] = [];

  constructor(private http: HttpClient) {
    this.maxDocumentId = this.getMaxId();
  }

  // storeDocuments() {
  //   this.http
  //     .put(
  //       'http://localhost:3000/documents',
  //       JSON.stringify(this.documents),
  //       {
  //         headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  //       }
  //     )
  //     .subscribe(() => {
  //       let documentsListClone = this.documents.slice();
  //       this.documentListChangedEvent.next(documentsListClone);
  //     });
  // }

  getDocuments(): any {
    this.http
      .get<Document[]>('http://localhost:3000/documents')
      .subscribe((documents: Document[]) => {
        this.documents = documents;
        this.documents  = JSON.parse(JSON.stringify(this.documents)).documents;
        this.maxDocumentId = this.getMaxId();
        this.documents.sort(function (a, b) {
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
        let documentsListClone = this.documents.slice();
        this.documentListChangedEvent.next(documentsListClone);
      }),
      (error: any) => {
        console.log(error);
      };
    // return this.documents.slice();
  }

  getDocument(id: string): Document {
    for (let i = 0; i < this.documents.length; i++) {
      if (id === this.documents[i].id) {
        return this.documents[i];
      }
    }
    return null;
  }

  getMaxId(): number {
    let maxId = 0;
    this.documents.forEach((document) => {
      let currentId = +document.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string; document: Document }>(
        'http://localhost:3000/documents',
        document,
        { headers: headers }
      )
      .subscribe((responseData) => {
        // add new document to documents
        this.documents.push(responseData.document);
        let documentsListClone = this.documents.slice();
        this.documentListChangedEvent.next(documentsListClone);
        // this.storeDocuments();
      });
  }

  // addDocument(newDocument: Document) {
  //   if (newDocument === undefined || newDocument === null) {
  //     return;
  //   }
  //   this.maxDocumentId++;
  //   newDocument.id = this.maxDocumentId.toString();
  //   this.documents.push(newDocument);
  //   // let documentsListClone = this.documents.slice();
  //   // this.documentListChangedEvent.next(documentsListClone);
  //   this.storeDocuments();
  // }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex((d) => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update database
    this.http
      .put(
        'http://localhost:3000/documents/' + originalDocument.id,
        newDocument,
        { headers: headers }
      )
      .subscribe((response: Response) => {
        this.documents[pos] = newDocument;
        let documentsListClone = this.documents.slice();
        this.documentListChangedEvent.next(documentsListClone);
        // this.storeDocuments();
      });
  }

  // updateDocument(originalDocument: Document, newDocument: Document) {
  //   if (
  //     originalDocument === undefined ||
  //     originalDocument === null ||
  //     newDocument === undefined ||
  //     newDocument === null
  //   ) {
  //     return;
  //   }
  //   let pos = this.documents.indexOf(originalDocument);
  //   if (pos < 0) {
  //     return;
  //   }
  //   newDocument.id = originalDocument.id;
  //   this.documents[pos] = newDocument;
  //   // let documentsListClone = this.documents.slice();
  //   // this.documentListChangedEvent.next(documentsListClone);
  //   this.storeDocuments();
  // }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.findIndex((d) => d.id === document.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http
      .delete('http://localhost:3000/documents/' + document.id)
      .subscribe((response: Response) => {
        this.documents.splice(pos, 1);
        let documentsListClone = this.documents.slice();
        this.documentListChangedEvent.next(documentsListClone);
        // this.storeDocuments();
      });
  }

  // deleteDocument(document: Document) {
  //   if (document === undefined || document === null) {
  //     return;
  //   }
  //   let pos = this.documents.indexOf(document);
  //   if (pos < 0) {
  //     return;
  //   }
  //   this.documents.splice(pos, 1);
  //   // let documentsListClone = this.documents.slice();
  //   // this.documentListChangedEvent.next(documentsListClone);
  //   this.storeDocuments();
  // }
}
