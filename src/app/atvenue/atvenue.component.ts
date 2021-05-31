import { Component, OnInit ,Output,EventEmitter} from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {formatDate}from '@angular/common';
import { timestamp } from 'rxjs/operators';
import firebase from 'firebase';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-atvenue',
  templateUrl: './atvenue.component.html',
  styleUrls: ['./atvenue.component.css']
})
export class AtvenueComponent implements OnInit {
  db: AngularFirestore;
  TokenCollection:AngularFirestoreCollection;
  name;
  startdate;
  enddate;
  city;
  uplifereport:Observable<any>;
  message;
  nextlevel:Array<Boolean>;
  date;
  quicknotes='';
  link;
  sequence=null;
  nextstage:Array<String>;
  people;
  selectstage;
  participantid;
  tokennumber;
  journeyid;
  alljourney;
  peoples:Array<String>;
  people_involved='peoples';
  dropdownSettings={};
  selectedid;
  oldstage;
  newstage;
  today=new Date();
  todaysDatatime='';
  mydate;
  todaytime=new Date().getTime();
  citytype;
  panel;
  data;
  currentstage;
  previousstage;
  bntenable:boolean=false;
  oldpeople;
  oldquicknotes;
  done;
  jouid;
  sequencenum;
  partid;

  
  constructor(db: AngularFirestore, public auth: AuthService , private dialog:MatDialog,public route: ActivatedRoute ) {
    this.db = db;
    this.todaytime;
    console.log("current time",this.todaytime);
    this.mydate=formatDate(this.today,'dd/MM/yyyy','en' );
    this.todaysDatatime=formatDate(this.today, 'dd-MM-yyy hh:mm:ss a', 'en-US', '+0530');
    /*
    this.db.doc('/defaults/control').valueChanges().subscribe(data=>{
      
      this.panel=data['panel'];
      this.panel.forEach(value=>{
          this.data=value;
           //console.log(value);
      })
      console.log(this.data);
    })
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
           
      this.nextlevel = new Array(100);
      this.nextlevel.fill(false);
      
    this.TokenCollection = db.collection('Token', ref => ref.orderBy('id'));
    this.TokenCollection.valueChanges().subscribe(snapshot=>{
      snapshot.forEach(data=>{
        this.participantid=data.participantid;
        this.tokennumber=data.tokennumber;
        this.done=data.done;
  console.log("partid :" ,this.participantid);
  
    this.alljourney = db.collection('Journey', ref => ref.where("participantid",'==',this.participantid ).orderBy('id'));
    this.alljourney.valueChanges().subscribe(data=>{
      data.forEach(snapshot=>{
        this.partid=snapshot.participantid;
        this.jouid=snapshot.id;
        this.sequencenum=snapshot.sequence;
        console.log(this.sequencenum);
        console.log(this.jouid);
        console.log(this.partid);
      })
    })
      })
  })
    
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

   
/*
  showname(name){
    name;
    console.log(name);
  }

sendmessage(){
  var message=this.message;
  console.log(message);
  const messageid = this.db.createId();
  this.db.doc('/Message/'+ messageid).set({
    message:message,
    city:this.city,
    id:messageid
  })
console.log("this is send message function");

}*/

queue1(i){
  
  this.nextlevel[i]=this.nextlevel[i] ? false : true;
  }
 
  onItemSelect(people){
    
    console.log(people);
  }

  //function to move token from one stage to next.
queuestage(id,city,name,tokennumber,participantid,tesla,currentstage,Displayname){
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
  console.log("currentstage",currentstage);
  console.log("displayname",Displayname);
  this.db.doc('/Token/'+id).get().toPromise().then(data=>{
    this.oldstage=data.data()['currentstage'];
    this.newstage=data.data()['stagehistory'];
    this.oldpeople=data.data()['people_involved'];
    this.oldquicknotes=data.data()['quicknotes'];
  
//if the stage is not requested the update the data in token document.
  console.log(this.oldstage);
 if(this.selectstage!="Requested"){
   console.log("token document");
   this.db.doc('/Token/'+id).update({
     date:this.mydate,
     modifiedtime:firebase.firestore.Timestamp.now(),
     move:false,
     done:false,
     previouspeople_involved:this.oldpeople,
    people_involved:this.people,
     previousstage:this.oldstage,
     currentstage:this.selectstage,
     status:"Active",
     stagehistory:this.oldstage + ',' + this.newstage + ',' + this.selectstage + ',' + this.todaysDatatime
       })
      }
//if tesla value is true for previous stge the set in journey document after moving from that stage.
 if(tesla){
 
  
  const journeyid = this.db.createId();
  
  console.log("journey updated");
  this.db.doc('/Journey/'+journeyid).set({
     date:this.mydate,
     type:this.oldstage,
     quicknotes:this.quicknotes,
     sequence:this.sequence,
     location:city,
     tokennumber:tokennumber,
     participantid:participantid,
     people_involved:this.oldpeople,
     tokenid:id,
     modifiedtime:firebase.firestore.Timestamp.now(),
     id:journeyid,
 }).then(res => {
  console.log(journeyid);
  console.log("Token is updated");
  this.db.doc('/Token/'+id).update({
    date:this.mydate,
  })
})
     
    }

    if(this.selectstage == "Completed"){
      this.db.doc('/Token/'+id).update({
        status:"Completed",
        modifiedtime:this.today,
      })
    }
    this.quicknotes="";
    this.sequence="";
    this.selectstage="";
    this.people="";
     
  
  })
}

//function to undo from currentstage to previousstage.
undo(id,journey,tesla){

  console.log(id);
console.log(journey);

  this.db.doc('/Token/'+id).valueChanges().subscribe(data=>{
    this.oldstage=data['currentstage'];
    this.previousstage=data['previousstage'];
    this.oldpeople=data['people_involved'];
    this.oldquicknotes=data['previousquicknotes'];

    console.log(this.previousstage);
  console.log(this.oldstage);

  
    console.log("this is undo if ");
    this.db.doc('/Token/'+id).update({
   //   journey:'',
      date:this.mydate,
      modifiedtime:this.today,
      previousstage:'',
      currentstage:this.previousstage,
      status:"Active",
      stagehistory: this.newstage +','+ this.previousstage + ',' + this.todaysDatatime
        })
        
        if(tesla){
          console.log("Deleting journey:"+journey);
          this.db.doc('/Journey/'+journey).delete().catch(error => console.log(error));
        
        }
       
        
      
      if(this.previousstage == null){
        this.bntenable=true;
      }
    
    })
  }


}

