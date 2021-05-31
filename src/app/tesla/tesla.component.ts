import { Component, OnInit ,ViewChild,ElementRef } from '@angular/core';
import { Journey } from '../journey';
import { AuthService } from '../core/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, filter } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { WindowRef } from '../WindowRef';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';

import { MatTableDataSource } from '@angular/material/table';
import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-tesla',
  templateUrl: './tesla.component.html',
  styleUrls: ['./tesla.component.css']
})
export class TeslaComponent implements OnInit {
  displayedColumns: string[] = ['date','type','location','quicknotes','linkname','link','multiplelink','associatedmedia','people_involved','sequence'];
  dataSource:MatTableDataSource<any>;
  db: AngularFirestore;
  windowref: WindowRef;
  journey:Journey;
  updatejourney:Journey;
  JourneyCollection:AngularFirestoreCollection;
  participantsCollection:AngularFirestoreCollection;
  defaults:Observable<any>;
  sort;
  participant:Observable<any>;
  participantDoc:AngularFirestoreDocument;
  participantid:string;
  data;
  ref:AngularFireStorageReference;
  task:AngularFireUploadTask;
  uploadProgress:Observable<number>;
  downloadURL:Observable<string>;
  getDownloadloadURL:Observable<string>;
  linkarray;
  file;
  consultation:number;
  totalconsultation:number;
  review;
  total;
  total_consultations:number;
  total_review:number;
  consultation_taken=0;
  consultationtaken=0;
  count=0;
  review_taken=0;
  reviewtaken:number;
  increase=0;
  validty;
  id;
  link;
  name;
  date;
  location;
  type;
  quicknotes;
  people_involved;
  sequence;
  selecttype;
  selectedtypes:Array<String>;
  people:Array<String>=[];
  peoples:Array<String>;
newlink:[{}];
linkarr:string;
linkfield:{};
dropdownSettings={};
editparticipantid;
editid;
edittype;

  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort){
       this.dataSource.sort = this.sort;
    }
  }

  @ViewChild('TABLE') table: ElementRef;

  constructor(db: AngularFirestore,public route: ActivatedRoute ,private router: Router,private afStorage:AngularFireStorage, private window: WindowRef) {
   
   /* this.types=[
      'Consultation',
      'Review',
      'uP!',
      'Change Work Fellowship', 
      'EIS Training', 
      'EIS Fellowship',
      'Life Update Video', 
      'Life Report', 
      'Watched Pre Post',
      'EIS Diagnostic List',
      'Change-Work',
      'A&H Review - Change work',
      'A&H Review - ATC list' 
    ];
    */
    //this.peoples=['ram','sam','kumar'];
    this.db = db;
    this.participantid = this.route.snapshot.paramMap.get('participant.id');
    this.participantDoc = this.db.doc('/Participants/'+this.participantid);
    this.participant = db.collection('Participants', ref => ref.orderBy('firstpurchasedate')).valueChanges();
    this.participantsCollection = db.collection('Participants', ref => ref.orderBy('firstpurchasedate', "desc"));
    this.participant=this.participantsCollection.valueChanges();
    console.log(this.participantid);
    this.participantsCollection = this.db.collection('Participants', ref => ref.where('id','==',this.participantid).orderBy('name'));
    this.participantsCollection.valueChanges().subscribe(snapshot=> {
        snapshot.forEach(data=>{
          this.name=data.name;
          console.log(this.name);
        })
       
      })
      this.JourneyCollection =this.db.collection('Journey', ref => ref.where('participantid', '==', this.participantid).orderBy('date'));
      this.JourneyCollection.valueChanges().subscribe(data=>{
        data.forEach(data=>{
          this.id=data.id;
       console.log(this.id);
        })
       
      })
      
    this.participantsCollection = db.collection('/Participants', ref => ref.orderBy('firstpurchasedate', "desc"));
    this.journey=new Journey;
    this.dataSource = new MatTableDataSource();
   //this.JourneyCollection =this.db.collection('Journey', ref => ref.where('participantid', '==', this.participantid).orderBy('date'));
    this.JourneyCollection =this.db.collection('Journey', ref => ref.where('participantid', '==', this.participantid).orderBy('date').orderBy('sequence'));
    this.JourneyCollection.valueChanges().subscribe(data=>{
      this.dataSource.data=data;

    })  
    this.db.doc('/defaults/type').valueChanges().subscribe(data=>{
    this.selectedtypes=data['types'];
    console.log(this.selectedtypes);
    })
    this.db.doc('/defaults/people').valueChanges().subscribe(data=>{
      this.peoples=data['people_involved'];
      console.log(this.peoples);
    });


   //this.journey.type="Consultation";
   this.windowref=window;
   this.linkarray=[];
   this.file={}; 
      
}

  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filteredData);
  }
}
