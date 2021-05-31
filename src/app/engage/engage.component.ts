import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as firebase from 'firebase/app';
import { Emailer1 } from '../messageclasses';
import { Template1 } from '../template';
import { Observable } from 'rxjs';

import { EtemplateComponent } from '../etemplate/etemplate.component';

@Component({
  selector: 'app-engage',
  templateUrl: './engage.component.html',
  styleUrls: ['./engage.component.css']
})
export class EngageComponent implements OnInit {
emailer1: Emailer1;
template1:Template1;
db: AngularFirestore;
arrfields:[{ }];
btnDisable:boolean;
alltemplate:Observable<any>;
templateid: string;
fields: string;
fieldsarray: [{}];
template:string;
fieldsvalue: {};
name:string;
Description:string;
email:string;
time:number=10;
statusmessage:string;
interval;
status;
allemailapproval:Observable<any>;
approvalstatus:string;
testbtn:boolean=true;
fieldvalue:{};


constructor(private route: ActivatedRoute ,db: AngularFirestore) {
    this.emailer1 = new Emailer1;
    this.db = db;
    this.alltemplate = db.collection('ETemplate', ref => ref.orderBy('name')).valueChanges();
    this.fieldsvalue = {};
    this.allemailapproval = db.collection('EmailApproval', ref => ref.orderBy('name')).valueChanges();
    this.fieldvalue={};
    this.status;
  }

  ngOnInit() {
//    emailmessage: String;
  }

sendtocustomers()
{
  
  console.log(this.name);
  const emailerid = this.db.createId();
  this.db.doc('/CustomerEmailsv2/'+emailerid).set({
  email:this.email,
  fieldsvalue:this.fieldsvalue,
  templateid : this.templateid,
  name:this.name,
    id:emailerid
  }).then(res =>{
    this.statusmessage = "Email will be sent within 15 minutes to ALL customers";
    this.fieldsvalue = {};
  
  });;
}

test()
{
  this.interval = setInterval(()=>{
    if(this.time>0){
      this.time--;
      this.testbtn=false;
    }
    else{
      this.time=10;
     
    }
  },1000)
  console.log(this.templateid);
  const emailerid = this.db.createId();
  this.db.doc('/TestEmail/'+emailerid).set({
  email:this.email,
  fieldsvalue:this.fieldsvalue,
  templateid : this.templateid,
  name:this.name,
  id: emailerid
}).then(res =>{
  this.statusmessage = "Test Email will be sent within 30 seconds";
  
});


}

displaytemplatedata(template)
{
  this.name = template.name;
  this.templateid = template.templateid;
 this.fields = template.fields;
 this.fieldsarray = template.fields.split(',');

}

sendemailtoapproval(approval)
{
  
    
  console.log(this.fieldsvalue);
    const emailapprovalid = this.db.createId();
    this.db.doc('/EmailApproval/'+emailapprovalid).set({
    fieldsvalue: this.fieldsvalue,
    templateid : this.templateid,
    name: this.name,
    approvalstatus: 'approved',
    id:emailapprovalid 
    }).then(res =>{
     this.statusmessage = "Email will be sent within 10 minutes to Approval";
      
    });
        
  }
  
  delete(approval)
  {
    console.log("deleted the unapproved data:"+approval.id);
    this.db.doc('/EmailApproval/'+approval.id).delete().catch(error => console.log(error));
  }
}