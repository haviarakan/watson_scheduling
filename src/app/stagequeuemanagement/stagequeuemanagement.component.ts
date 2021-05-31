import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { WindowRef } from '../WindowRef';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {formatDate}from '@angular/common';


@Component({
  selector: 'app-stagequeuemanagement',
  templateUrl: './stagequeuemanagement.component.html',
  styleUrls: ['./stagequeuemanagement.component.css']
})
 export class StagequeuemanagementComponent implements OnInit {
  db: AngularFirestore;
  TokenCollection:AngularFirestoreCollection;
  name;
  startdate;
  enddate;
  city;
  allrole;
  alltoken;
  cometovenue:Observable<any>; 
  uplifereport:Observable<any>;
  nextstage:Array<String>;
  alljourney:Observable<any>;
  peoples;
  participantid;
  tokennumber;
  data;
  btnstyle=[];
  roledata;
  role;
  username;
  displayName;
 
  

  constructor(db: AngularFirestore, public auth: AuthService ,public route: ActivatedRoute ) {
    this.db = db;
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
  
this.auth.user.subscribe(doc=>{
  this.username=doc.displayName;
  
  console.log(doc.displayName);
  console.log(this.username);
})


  this.db.doc('/defaults/people').valueChanges().subscribe(data=>{
    this.peoples=data['people_involved'];
    console.log(this.peoples);
  });

  this.db.doc('/defaults/roleassigned').valueChanges().subscribe(data=>{
    this.role=data['projectmanager'];
    this.role[1].type;
    this.role[1].name;

    console.log(this.role[3].type)
  console.log(this.role[3].name.includes(this.username))
    console.log(this.role);
  });
  
  this.cometovenue = db.collection('Token', ref => ref.where("status","==","Active").where("currentstage","==","Be Available").orderBy('modifiedtime','asc')).valueChanges();
      
  this.alltoken = db.collection('Token', ref => ref.where("status","==","Requested").orderBy('tokennumber','asc'));
  this.alltoken.valueChanges().subscribe(data=>{
    this.alltoken=data;
    console.log(this.alltoken);
  })

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

done(number,k,id){
  console.log("this is done btn");
  this.btnstyle.push(k);
  console.log(this.btnstyle);
 
  this.db.doc('/Token/'+id).update({
    done:true,
    move:true
  })
  
}


}