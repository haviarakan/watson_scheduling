import { Component, OnInit } from '@angular/core';
import { Adminform ,Templateform} from '../form';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { WindowRef } from '../WindowRef';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-adminformslook',
  templateUrl: './adminformslook.component.html',
  styleUrls: ['./adminformslook.component.css']
})
export class AdminformslookComponent implements OnInit {
  db: AngularFirestore;
  templateform:Templateform;
  formsque:Observable<any>;
  windowref: WindowRef;
  formquestionCollection:AngularFirestoreCollection;
  formsid:String;
  getoption;
  selectoption;
  checkselected;
  marked:Array<any>=[];
  get;
  id;
  test;
  filled=[{
    questions:"",
    answers:""
  }]
  forms;
  formid;

  constructor(db: AngularFirestore,public auth: AuthService, private window: WindowRef,public route: ActivatedRoute) { 
    this.db = db;
    this.formsid = this.route.snapshot.paramMap.get('form.id');
    console.log(this.formsid);
  // this.formsque = db.collection('FormQuestion', ref => ref.orderBy('order')).valueChanges();
    this.formsque = db.collection('FormQuestion', ref => ref.where('formid','==',this.formsid).orderBy('order')).valueChanges();
    
    /* this.formquestionCollection = db.collection('FormQuestion', ref => ref.where('formid','==',this.formsid).orderBy('order'));
     this.formquestionCollection.valueChanges().subscribe(data=>{
      data.forEach(snap=>{
        this.id=snap.data.id;
      })
    console.log(this.id);
  })*/
  /*
  this.forms =db.collection('Forms', ref => ref.where("name",'==',this.formsname).orderBy('id'));
  this.forms.valueChanges().subscribe(data=>{
    data.forEach(snap=> {
      this.formid=snap.id;
    });
    console.log(this.formid);
  });
   
   */
  this.windowref = window;
  this.db.collection('FormQuestion').ref.get().then((doc)=>{
    doc.forEach(data=>{
      this.test=data.data();
    })
    console.log(this.test);
  })
}

  ngOnInit() {
  }

  selectedoption(){
    console.log(this.selectoption);
  }

  
  onchange(option,ischecked:boolean){
     if(ischecked){
       this.marked.push(option);
       console.log(this.marked)
     }
     else{
       let index=this.marked.indexOf(option);
       this.marked.splice(index,1);
       console.log(this.marked);
     }
  }


  displaytemplate(){
    /*
    console.log("this is to show the template");
    console.log(formque.id);
    this.id = formque.id; 
  this.filled.push({questions:formque.lable,answers:this.selectoption})
  console.log(this.filled);
*/
console.log(this.formsid);
console.log('Window object', this.windowref.nativeWindow);
this.windowref.nativeWindow.open("/Formtemplate/"+this.formsid, "_blank");

}
  

/*
  formsubmit(textinput,formque){
    console.log("this is the complet form submitted by participant");
    console.log("drop1",this.selectoption);
    console.log("drop2",this.selectoption);
    console.log("textarea",textinput);
    console.log("checkbox",this.marked);
    console.log(this.id);
    console.log(formque.id);
    this.db.doc('/FormQuestion/'+this.id).valueChanges().take(1).subscribe(data => {
      this.get=data['lable'];
      console.log(this.get);
    })
  }
*/
}
