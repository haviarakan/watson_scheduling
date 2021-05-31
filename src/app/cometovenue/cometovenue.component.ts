import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, interval} from 'rxjs';
import { ActivatedRoute} from '@angular/router';
import { WindowRef } from '../WindowRef';
import { Token } from '@angular/compiler';
import {formatDate}from '@angular/common';
import { timestamp } from 'rxjs/operators';
import  firebase from 'firebase';

@Component({
  selector: 'app-cometovenue',
  templateUrl: './cometovenue.component.html',
  styleUrls: ['./cometovenue.component.css']
})
export class CometovenueComponent implements OnInit {
db:AngularFirestore;
cityCollection:AngularFirestoreCollection;
cities:Array<String>;
defaultsCollection:AngularFirestoreCollection;
TokenCollection:AngularFirestoreCollection
defaults:Observable<any>;
windowref: WindowRef;
AHtype:Array<String>;
selecttype:Array<String>;
selectcities:Array<String>;
cometovenu:Observable<any>;
token;
status;
alltoken;
nextlevel;
nextlevel1;
nextlevel2;
peoples;
cometovenue;
selectedid;
oldstage;
newstage;
today=new Date();
todaysDatatime='';
mydate;
todaytime;
dropdownSettings={};
date;
  quicknotes='';
  link;
  sequence=null;
  nextstage:Array<String>;
  people='';
  selectstage;
  participantid;
  tokennumber;
  alljourney;
  data;
  oldpeople;
  oldquicknotes;
  



  constructor(db: AngularFirestore , private route:ActivatedRoute,private window: WindowRef) { 
    this.db=db;
    this.todaytime=formatDate(this.today,'hh:mm:ss a', 'en-US', '+0530');
    this.mydate=formatDate(this.today,'dd/MM/yyyy','en' );
    this.todaysDatatime=formatDate(this.today, 'dd-MM-yyy hh:mm:ss a', 'en-US', '+0530');
    this.windowref = window;
   // this.cities=['Chennai','Delhi','Mumbai'];
    this.db.doc('/defaults/cometovenu').valueChanges().subscribe(data=>{
      this.AHtype=data['AHtype'];
      console.log(this.AHtype);
      })
      this.db.doc('/defaults/cometovenu').valueChanges().subscribe(data=>{
        this.cities=data['City'];
        console.log(this.cities);
        })
        this.db.doc('/defaults/stage').valueChanges().subscribe(data=>{
          this.nextstage=data['nextstage'];
          console.log(this.nextstage);
        })
        this.db.doc('/defaults/people').valueChanges().subscribe(data=>{
          this.peoples=data['people_involved'];
          console.log(this.peoples);
        });

        this.db.doc('/defaults/stage').valueChanges().subscribe(data=>{
      
          this.nextstage=data['nextstage'];
          this.nextstage.forEach(value=>{
              this.data=value;
               //console.log(value);
          })
          console.log(this.data);
        })
      
    this.defaultsCollection = db.collection('defaults', ref => ref.orderBy("desc"));
    
    this.cometovenue = db.collection('Token', ref => ref.where("status","==","Active").where("currentstage","==","Be Available").orderBy('modifiedtime','asc')).valueChanges();
      
  this.alltoken = db.collection('Token', ref => ref.where("status","==","Requested").orderBy('tokennumber','asc'));
  this.alltoken.valueChanges().subscribe(data=>{
    this.alltoken=data;
    console.log(this.alltoken);
  })
  
    
    this.TokenCollection = db.collection('Token', ref => ref.orderBy('id'));
    this.TokenCollection.valueChanges().subscribe(snapshot=>{
      snapshot.forEach(data=>{
        this.participantid=data.participantid;
        this.tokennumber=data.tokennumber;
       
    this.alljourney = db.collection('Journey', ref => ref.where("participantid",'==',this.participantid ).orderBy('id')).valueChanges();
      })
  })
    

  this.nextlevel = new Array(100);
  this.nextlevel.fill(false);
  this.nextlevel1 = new Array(100);
  this.nextlevel1.fill(false);
}

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    
  }
  
  onItemSelect(people){
    
    console.log(people);
  }
 
  queue1(i){
  
    this.nextlevel1[i]=this.nextlevel1[i] ? false : true;
    
    }
    queue2(j){
      this.nextlevel2[j]=this.nextlevel2[j] ? false : true;
    }

//function for filter two dropdown values  
  queue(){
    console.log(this.selectcities);
    console.log(this.selecttype);
    this.alltoken= this.db.collection('Token', ref => ref.where('city','==',this.selectcities).where('type','==',this.selecttype).where('status','==','Requested').orderBy("name"));
    this.alltoken.valueChanges().subscribe(data=>{
    this.alltoken=data;
    //  data.forEach(data=>{
    //  this.token = data.tokennumber;
    //  this.status=data.status;
    //  })
    })
  
  }
//function to cancel 
  queuecancel1(id){
    console.log(id);
    this.db.doc('/Token/'+id).update({
      cancel:1,
      status:"cancelled",
    })
  }

  //button function to move the token from one stage to next.
  queuestage(id,city,name,tokennumber,participantid){
  console.log(city);
  console.log(name);
  console.log(tokennumber);
  console.log(participantid);
  console.log(this.mydate);
  console.log(this.quicknotes);
  console.log(this.sequence);
  console.log(this.selectstage);
  console.log(id);
  console.log(this.people);
  this.db.doc('/Token/'+id).valueChanges().take(1).subscribe(data=>{
    this.oldstage=data['currentstage'];
    this.newstage=data['stagehistory'];
    this.oldpeople=data['people_involved'];
    this.oldquicknotes=data['quicknotes'];

//if the dropdown value is not cometovenue the set the journey document and update token document.
  if(this.selectstage!="Be Available")
  {
    console.log("this is if inside");
  const journeyid = this.db.createId();
  
  console.log("journey updated");
  this.db.doc('/Journey/'+journeyid).set({
     date:this.mydate,
     type:this.selectstage,
     quicknotes:this.quicknotes,
     sequence:this.sequence,
     name:name,
     location:city,
     tokennumber:tokennumber,
     participantid:participantid,
     people_involved:this.people,
     tokenid:id,
     modifiedtime:this.today,
     id:journeyid,
 })
 .then(res => {
  console.log(journeyid);
  console.log("Token is updated");
  this.db.doc('/Token/'+id).update({
    date:this.mydate,
    modifiedtime:firebase.firestore.Timestamp.now(),
    previouspeople_involved:this.oldpeople,
    people_involved:this.people,
    previousstage:this.oldstage,
    currentstage:this.selectstage,
    status:"Active",
    stagehistory:this.oldstage + ',' + this.newstage + ',' + this.selectstage + ',' + this.todaysDatatime
      })
      if(this.selectstage == "Completed"){
        this.db.doc('/Token/'+id).update({
          status:"Completed",
          modifiedtime:this.todaytime,
        })
      }
      this.quicknotes="";
      this.sequence="";
      this.selectstage="";
      this.people="";
});
  }
})
 
//if the dropdown value is not requested the update the status of token document.
 this.db.doc('/Token/'+id).valueChanges().take(1).subscribe(data=>{
   this.oldstage=data['currentstage'];
   this.newstage=data['stagehistory'];
   this.oldpeople=data['people_involved'];
   this.oldquicknotes=data['quicknotes'];
 
 console.log(this.oldstage);
if(this.selectstage!="Requested"){
  this.db.doc('/Token/'+id).update({
    date:this.mydate,
    previouspeople_involved:this.oldpeople,
    people_involved:this.people,
    modifiedtime:firebase.firestore.Timestamp.now(),
    previousstage:this.oldstage,
    currentstage:this.selectstage,
    status:"Active",
    stagehistory:this.oldstage + ',' + this.newstage + ',' + this.selectstage + ',' + this.todaysDatatime
      })
    } 
    
 })
}

  }
  
/*
  addqueue(){
    this.citytype=this.events.cities+this.events.name;
  console.log(this.citytype);
     
     const eventid = this.db.createId();
     this.db.doc('/event/'+eventid).set({
      eventname:this.events.name,
      city:this.events.cities,
      citytype:this.citytype,
      startdate:this.events.startdate,
      enddate:this.events.enddate,
      id:eventid,

   })
     console.log(eventid);
  }
*/

