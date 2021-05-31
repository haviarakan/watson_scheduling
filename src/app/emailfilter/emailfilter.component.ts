import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection,DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import * as _ from "lodash"
import  'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import firebase from 'firebase/app';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import 'rxjs/add/operator/take';
import { AuthService } from '../core/auth.service';
import { WindowRef } from '../WindowRef';
import * as XLSX from 'xlsx';
import {formatDate}from '@angular/common';
import { Event } from '../event';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-emailfilter',
  templateUrl: './emailfilter.component.html',
  styleUrls: ['./emailfilter.component.css']
})
export class EmailfilterComponent implements OnInit {
  dataSource:MatTableDataSource<any>;
  displayedColumns: string[] = ['name','email','phone','Payment status','Milestone Attended','EIT Eductation Status'];
  db: AngularFirestore;
  participantsCollection: AngularFirestoreCollection;
  emaillistCollection:AngularFirestoreCollection;
  participants: Observable<any[]>;
  defaults: Observable<any>;
  windowref: WindowRef;
  miles:Array<string>;
  eitstatus;
  currentparticipant;

 dropdownList = [];
selectedItems = [];
dropdownSettings = {};
  milestone;
  participant;
  selectedstatus;
  paymentplan;
  paymentstatus;
  mileupdate;
  Milestone;
  pp_status;
  today=new Date();
  todaysDatatime='';
  mydate;
  todaytime;
  alldoc;
  data1;
  data2;
  data3;
  query1;
  query2;
  query3;
  list;
  allparticipant;
  event:Event;
 
map=new Map<string ,string>();
val1;
sort;
editor:Editor;
message;

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



@ViewChild(MatSort) set content(content: ElementRef) {
  this.sort = content;
  if (this.sort){
     this.dataSource.sort = this.sort;

  }
}

@ViewChild('TABLE') table: ElementRef;


constructor(db: AngularFirestore, public auth: AuthService, private window: WindowRef) {
  this.dataSource = new MatTableDataSource();
  this.db = db;
  this.event = new Event;
  this.todaytime=formatDate(this.today,'hh:mm:ss a', 'en-US', '+0530');
    this.mydate=formatDate(this.today,'dd/MM/yyyy','en' );
    this.todaysDatatime=formatDate(this.today, 'dd-MM-yyy hh:mm:ss a', 'en-US', '+0530');
  this.emaillistCollection = db.collection('emaillist', ref => ref.orderBy('firstpurchasedate', "desc"));
  this.participantsCollection = db.collection('Participants', ref => ref.orderBy('firstpurchasedate', "desc"));
  this.db.doc('/defaults/milestone').valueChanges().subscribe(data=>{
    this.miles=data['multiplemile'];
    this.eitstatus=data['eitedustatus'];
    console.log(this.miles);
    console.log(this.eitstatus);
  })
  this.db.doc('/defaults/status').valueChanges().subscribe(data=>{
    this.paymentplan=data['statuslist'];
  })
/*
  this.query1 = this.db.collection('Participants', ref => ref.where('pp_status','in',[ 'Active PaymentPlan','Paused Temporary','Fully Paid'])).snapshotChanges()
  .subscribe(res=>{
    let data1=res.map((res1:any)=>res1.payload.doc.data().id);
           console.log(data1);
     let dataq1=res.map((res)=>res.payload.doc.data());
     console.log("paymentplan",dataq1);

  this.query2=this.db.collection('Participants',ref=>ref.where('eit_status','in',['started'])).snapshotChanges()
  .subscribe(res=>{
    let data2=res.map((res:any)=>res.payload.doc.data().id);
           console.log(data2);
           let dataq2=res.map((res)=>res.payload.doc.data());
           console.log("eitstatus",dataq2);

           /*const datainboth= combineLatest(data1,data2).pipe(filter(([data1,data2])=>_.intersection(data1,data2)))
           
           console.log(datainboth);
      
           this.query3=this.db.collection('Participants',ref=>ref.where('milestone','array-contains-any',['First uP! Attended'])).snapshotChanges()
           .subscribe(data=>{
             let data3=data.map((res:any)=>res.payload.doc.data());
             console.log("query milestone",data3);
            
             this.val1=_.intersection(data1,data2);
             console.log(this.val1);
  
     var databoth=data3.filter(b=>this.val1.includes(b['id'])); 
        console.log(databoth);
  
       })*/
           /*

           data1.filter(item=>data2.includes(item))
           console.log(data1);
           /*
           const result=data1.map(val=>{
             return Object.assign(val,data2.filter(res=>res.id === val.id));
            })
     console.log(result);
/*this.exictval=_.intersection(dataq1,dataq2);
           console.log(this.exictval)

  ;*/
  //})
  //})

}
  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.editor = new Editor();

  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filteredData);
  }
  onSelectAll(milestone: any,) {
    console.log(milestone);
  }
  onpayItemSelect(paymentstatus){
  
    console.log(paymentstatus);
  }
  oneitItemSelect(selectedstatus){
console.log(selectedstatus)
  }
 
  onmileItemSelect(mileupdate){
    console.log(mileupdate);
  }
  selectstatus(){
    console.log(this.selectedstatus);
  
   }
   selectplan(){
     console.log(this.paymentstatus);
   }
   
  filter(){
    console.log("Payment",this.paymentstatus);
    console.log("EIT",this.selectedstatus);
    console.log("Mile",this.mileupdate);
    console.log("query");  

    
   
if(this.paymentstatus!=null){
 this.query1 = this.db.collection('Participants', ref => ref.where('pp_status','in',this.paymentstatus)).snapshotChanges()
 .subscribe(res=>{
   this.data1=res.map((res1:any)=>res1.payload.doc.data().id);
          console.log(this.data1);
  })
  }else{
  this.alldoc=this.db.collection('Participants').snapshotChanges().subscribe(res=>{
    this.data1=res.map((res:any)=>res.payload.doc.data().id);
    console.log("alldoc",this.data1);
  })
    
  }
if(this.selectedstatus!=null){
    this.query2=this.db.collection('Participants',ref=>ref.where('eit_status','in',this.selectedstatus)).snapshotChanges()
    .subscribe(res=>{
       this.data2=res.map((res:any)=>res.payload.doc.data().id);
             console.log(this.data2);
             this.val1=_.intersection(this.data1,this.data2);
  console.log("intersect of two query",this.val1);
  this.list=this.data3.filter(b=>this.val1.includes(b['id']));

 console.log("all query final list",this.list);
 this.dataSource.data=this.list;
    this.dataSource.sort = this.sort; 
    console.log(this.dataSource.data);
    })
  }else{
    this.alldoc=this.db.collection('Participants').snapshotChanges().subscribe(res=>{
      this.data2=res.map((res:any)=>res.payload.doc.data().id);
      console.log("alldoc",this.data2);
    })
    }
if(this.mileupdate!=null){
    this.query3=this.db.collection('Participants',ref=>ref.where('milestone','array-contains-any',this.mileupdate)).snapshotChanges()
    .subscribe(data=>{
       this.data3=data.map((res:any)=>res.payload.doc.data());
      console.log("query milestone",this.data3);
console.log(this.data1);
console.log(this.data2);
 
  this.val1=_.intersection(this.data1,this.data2);
  console.log("intersect of two query",this.val1);
  this.list=this.data3.filter(b=>this.val1.includes(b['id']));

 console.log("all query final list",this.list);
    this.dataSource.data=this.list;
    this.dataSource.sort = this.sort; 
    console.log(this.dataSource.data);
    console.log(this.list);
 
    })
  }else{
    this.alldoc=this.db.collection('Participants').snapshotChanges().subscribe(res=>{
      this.data3=res.map((res:any)=>res.payload.doc.data());
      console.log("alldoc",this.data3);
  console.log(this.data1);
  
  console.log(this.data2);
console.log(this.val1);
    this.val1=_.intersection(this.data1,this.data2);
  console.log("intersect of two query",this.val1);
  this.list=this.data3.filter(b=>this.val1.includes(b['id']));

 console.log("all query final list",this.list);
    this.dataSource.data=this.list;
    this.dataSource.sort = this.sort; 
    console.log(this.dataSource.data);
    console.log(this.list); 
  })

 
   }
   
  }
  


   sendemail(dataSource){
     console.log(dataSource.data);
  
    const batch = this.db.firestore.batch();
    const emaillistid = this.db.createId();
    const snapshotDoc=this.db.collection('emaillist').doc(emaillistid).ref;
    console.log(emaillistid);
    console.log("this is batchmail");
    batch.set(snapshotDoc,{
      id:emaillistid,
      snapshot:dataSource.data,
      subject:this.event.subject,
      message:this.event.message,
      templateid:this.event.templateid,
    })
   console.log("the document is created");
   return batch.commit();
  
}

  ExportCSV()
  {
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Emaildataexport.csv');

  }


  
}

   
