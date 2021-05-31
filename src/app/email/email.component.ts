import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import 'rxjs/add/operator/take';
import { AuthService } from '../core/auth.service';
import { WindowRef } from '../WindowRef';
import * as XLSX from 'xlsx';
import { Event } from '../event';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  db: AngularFirestore;
  participantsCollection: AngularFirestoreCollection;
 email;
 data;
 event:Event;
 status;
 selectstatus;
selectedemail;
editor:Editor;
message;
// emailform = new FormGroup({
//   message: new FormControl(''),
// })
toolbar: Toolbar = [
  ["bold", "italic"],
  ["underline", "strike"],
  ["code", "blockquote"],
  ["ordered_list", "bullet_list"],
  [{ heading: ["h1", "h2", "h3", "h4", "h5", "h6"] }],
  ["link", "image"],
  ["text_color", "background_color"],
  ["align_left", "align_center", "align_right", "align_justify"],
  
];
emailform = new FormGroup({
  emaillist : new FormControl(''),
  subject : new FormControl(''),
  message: new FormControl(''),
  templateid : new FormControl('')
})

  constructor(db: AngularFirestore, public auth: AuthService, private window: WindowRef) {
    this.db=db;
    this.event = new Event;
    this.participantsCollection = db.collection('Participants', ref => ref.orderBy('firstpurchasedate', "desc"));
    this.participantsCollection.valueChanges().subscribe(data=>
      {
        this.data=data;
      data.forEach(snapshot=>{
        this.email=snapshot.email

        console.log(this.email);
        //console.log(this.data);
      })
     
      })
      this.db.doc('/defaults/status').valueChanges().subscribe(data=>{
        this.status=data['statuslist'];
        console.log(this.status);
        })

  }

  ngOnInit() {
   this.editor = new Editor();

  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
 
   filteremail(){
     console.log(this.selectstatus);
     
    this.selectedemail=this.db.collection('Participants', ref => ref.where('pp_status','==',this.selectstatus).orderBy('firstpurchasedate', "desc"));
    this.selectedemail.valueChanges().subscribe(data=>
      {
        this.data=data;
      data.forEach(snapshot=>{
        this.email=snapshot.email

        console.log(this.email);
        //console.log(this.data);
      })
    })
   }  
   

  sendbatchmail(value){
    const mailid = this.db.createId();
  this.db.doc('/mail/'+mailid).set({
    subject:value.subject,
    message:value.message,
    templateid:value.templateid,
    emaillistcollection:value.emaillist,
    id:mailid
  })
  console.log(mailid);
  console.log(value.emaillist);
  console.log(value.subject);
  console.log(value.message);
  console.log(value.templateid);
  console.log("the doc for batch mail is created");
}




}
