import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, interval} from 'rxjs';
import { WindowRef} from '../WindowRef';
import { FormGroup, FormControl } from '@angular/forms'

@Component({
  selector: 'app-thankyoupage',
  templateUrl: './thankyoupage.component.html',
  styleUrls: ['./thankyoupage.component.css']
})
export class ThankyoupageComponent implements OnInit {
  db: AngularFirestore;
  participantsCollection: AngularFirestoreCollection;
  participants:Observable<any>;
  participantDoc:AngularFirestoreDocument;
  FormCollection:AngularFirestoreCollection;
  cityCollection:AngularFirestoreCollection;
  defaultsCollection:AngularFirestoreCollection;
  defaults:Observable<any>;
  email;
  name;
  number;
  Email;
  event;
  type;
  city;
  constructor(db: AngularFirestore , private route:ActivatedRoute) { 
    this.db=db;
    this.email = this.route.snapshot.paramMap.get('email'); 
  this.FormCollection=this.db.collection('form',ref=>ref.where('email','==',this.email).orderBy('name'));
  this.FormCollection.valueChanges().subscribe(snapshot=> {
      snapshot.forEach(data=>{
          this.name=data.name;
          this.number=data.phone;
          this.event=data.event;
          this.type=data.type;
          this.city=data.city;
          console.log(this.name);
          console.log(this.number);
          console.log(this.type);
          console.log(this.city);
          console.log(this.event);
      })
    })
  
  
  }
  ngOnInit() {
  }

}
