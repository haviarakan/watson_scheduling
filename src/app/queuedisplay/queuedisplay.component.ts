import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { WindowRef } from '../WindowRef';
import {MatDialog} from '@angular/material/dialog';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {formatDate}from '@angular/common';

@Component({
  selector: 'app-queuedisplay',
  templateUrl: './queuedisplay.component.html',
  styleUrls: ['./queuedisplay.component.css']
})
export class QueuedisplayComponent implements OnInit {
  db: AngularFirestore;
  TokenCollection:AngularFirestoreCollection;
  name;
  startdate;
  enddate;
  city;
  alltoken:Observable<any>;
  cometovenue:Observable<any>; 
  uplifereport:Observable<any>;
  nextstage:Array<String>;
  alljourney:Observable<any>;
  peoples;
  participantid;
  tokennumber;
  data;


  constructor(db: AngularFirestore, public auth: AuthService , private dialog:MatDialog,public route: ActivatedRoute ) {
    this.db = db;
    /*
    this.events= new event;
    this.db.doc('/defaults/stage').valueChanges().subscribe(data=>{
      this.nextstage=data['nextstage'];
      console.log(this.nextstage);
    })
    this.db.doc('/defaults/people').valueChanges().subscribe(data=>{
      this.peoples=data['people_involved'];
      console.log(this.peoples);
    });
    this.eventid = this.route.snapshot.paramMap.get('event.id');
    this.eventDoc = this.db.doc('/event/'+this.eventid);
    this.event = db.collection('event', ref => ref.orderBy('eventname')).valueChanges();
    this.eventCollection = db.collection('event', ref => ref.where("id","==",this.eventid).orderBy('eventname'));
    this.eventCollection.valueChanges().subscribe(snapshot=> {
     snapshot.forEach(data=>{
       this.name=data.eventname;
       this.city=data.city;
       this.startdate=data.startdate;
       this.enddate=data.enddate;
       this.eventid=data.id;
       console.log("eventid :",this.eventid);
       console.log("name:",this.name);
       console.log("city:",this.city);
       console.log("startdate:",this.startdate);
       console.log("enddate:",this.enddate);
      })
      this.alltoken = db.collection('Token', ref => ref.where("city",'==',this.city ).where("type",'==',this.name).where("status","==",'Requested').orderBy('name')).valueChanges();
      this.cometovenue = db.collection('Token', ref => ref.where("city",'==',this.city ).where("type",'==',this.name).where("status","==",'Active').where("nextstage","==","come to venue").orderBy('name')).valueChanges();
      this.uplifereport = db.collection('Token', ref => ref.where("city",'==',this.city ).where("type",'==',this.name).where("status","==",'Active').where("nextstage","==","uP! Life Report").orderBy('modifiedtime','asc')).valueChanges();
      this.readyforvideolog = db.collection('Token', ref => ref.where("city",'==',this.city ).where("type",'==',this.name).where("status","==",'Active').where("nextstage","==","Video Interview Queue").orderBy('modifiedtime','asc')).valueChanges();
      this.videolog = db.collection('Token', ref => ref.where("city",'==',this.city ).where("type",'==',this.name).where("status","==",'Active').where("nextstage","==","Video Interview").orderBy('modifiedtime','asc')).valueChanges();
      this.emqueue = db.collection('Token', ref => ref.where("city",'==',this.city ).where("type",'==',this.name).where("status","==",'Active').where("nextstage","==","Evolution Mapping Queue").orderBy('modifiedtime','asc')).valueChanges();
      this.evolutionmqpping= db.collection('Token', ref => ref.where("city",'==',this.city ).where("type",'==',this.name).where("status","==",'Active').where("nextstage","==","Evolution Mapping").orderBy('modifiedtime','asc')).valueChanges();
      this.previousadjqueu = db.collection('Token', ref => ref.where("city",'==',this.city ).where("type",'==',this.name).where("status","==",'Active').where("nextstage","==","Previous Adjustments Log Queue").orderBy('modifiedtime','asc')).valueChanges();
      this.previousadj = db.collection('Token', ref => ref.where("city",'==',this.city ).where("type",'==',this.name).where("status","==",'Active').where("nextstage","==","Previous Adjustments Log").orderBy('modifiedtime','asc')).valueChanges();
      this.AHreview = db.collection('Token', ref => ref.where("city",'==',this.city ).where("type",'==',this.name).where("status","==",'Active').where("nextstage","==","A&H Review Queue").orderBy('modifiedtime','asc')).valueChanges();
      this.ATCdiaqueue = db.collection('Token', ref => ref.where("city",'==',this.city ).where("type",'==',this.name).where("status","==",'Active').where("nextstage","==","EIS Review Queue").orderBy('modifiedtime','asc')).valueChanges();
      this.ATCdia = db.collection('Token', ref => ref.where("city",'==',this.city ).where("type",'==',this.name).where("status","==",'Active').where("nextstage","==","EIS Review").orderBy('modifiedtime','asc')).valueChanges();
      this.cwqueue = db.collection('Token', ref => ref.where("city",'==',this.city ).where("type",'==',this.name).where("status","==",'Active').where("nextstage","==","Change work Queue").orderBy('modifiedtime','asc')).valueChanges();
      this.cw = db.collection('Token', ref => ref.where("city",'==',this.city ).where("type",'==',this.name).where("status","==",'Active').where("nextstage","==","In Change Work").orderBy('modifiedtime','asc')).valueChanges();
      this.cwvalidationqueue = db.collection('Token', ref => ref.where("city",'==',this.city ).where("type",'==',this.name).where("status","==",'Active').where("nextstage","==","Change work Validation Queue").orderBy('modifiedtime','asc')).valueChanges();
      this.cwAHvalidation = db.collection('Token', ref => ref.where("city",'==',this.city ).where("type",'==',this.name).where("status","==",'Active').where("nextstage","==","Change work by A&H Validation").orderBy('modifiedtime','asc')).valueChanges();
      this.ATCvalidationqueue = db.collection('Token', ref => ref.where("city",'==',this.city ).where("type",'==',this.name).where("status","==",'Active').where("nextstage","==","ATC Validation Queue").orderBy('modifiedtime','asc')).valueChanges();
      this.AHATCvalidation= db.collection('Token', ref => ref.where("city",'==',this.city ).where("type",'==',this.name).where("status","==",'Active').where("nextstage","==","A&H ATC Validation").orderBy('modifiedtime','asc')).valueChanges();
      this.completed = db.collection('Token', ref => ref.where("city",'==',this.city ).where("type",'==',this.name).where("status","==",'Completed').where("nextstage","==","Completed").orderBy('modifiedtime','asc')).valueChanges();
      
    })
    this.TokenCollection = db.collection('Token', ref => ref.orderBy('id'));
    this.TokenCollection.valueChanges().subscribe(snapshot=>{
      snapshot.forEach(data=>{
        this.participantid=data.participantid;
        this.tokennumber=data.tokennumber;
       
    this.alljourney = db.collection('Journey', ref => ref.where("participantid",'==',this.participantid ).orderBy('id')).valueChanges();
      })
  })
    
  }
  */
  this.db.doc('/defaults/nextstage').valueChanges().subscribe(data=>{
    this.nextstage=data['stagelevel'];
    this.nextstage.forEach(item=>{
      this.data=item;
      console.log(this.data.Displayname);
      console.log(this.data.tesla);
      console.log(this.data.type);
    })
    console.log(this.nextstage);
  })

  this.db.doc('/defaults/people').valueChanges().subscribe(data=>{
    this.peoples=data['people_involved'];
    console.log(this.peoples);
  });

    this.uplifereport = db.collection('Token', ref => ref.where("status","==",'Active').orderBy('modifiedtime','asc')).valueChanges();
    
  this.TokenCollection = db.collection('Token', ref => ref.orderBy('id'));
  this.TokenCollection.valueChanges().subscribe(snapshot=>{
    snapshot.forEach(data=>{
      this.participantid=data.participantid;
      this.tokennumber=data.tokennumber;

  this.alljourney = db.collection('Journey', ref => ref.where("participantid",'==',this.participantid ).orderBy('id')).valueChanges();
    })
})
  
}


  ngOnInit() {
  }

}