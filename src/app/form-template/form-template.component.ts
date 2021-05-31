import { Component, OnInit, Input } from '@angular/core';
import { Adminform ,Templateform} from '../form';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { WindowRef } from '../WindowRef';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import 'rxjs/add/operator/take'; 

@Component({
  selector: 'app-form-template',
  templateUrl: './form-template.component.html',
  styleUrls: ['./form-template.component.css']
})
export class FormTemplateComponent implements OnInit {
  db: AngularFirestore;
  templateform:Templateform;
  updateform:Templateform;
  formquestionCollection:AngularFirestoreCollection;
  formsque:Observable<any>;
  windowref: WindowRef;
  formsid:String;
  dropdownoptions:string;
  checkboxs:string;
  types;
  formqueid;
  options;
  getoption=[];
  formquestions:Observable<any>;
  formid;
  currentid={};
  showedit:boolean;
  updateid;
 lable;
 
  constructor(db: AngularFirestore,public auth: AuthService, private window: WindowRef,public route: ActivatedRoute) { 
    this.db = db;
    this.formsid = this.route.snapshot.paramMap.get('form.id');
    this.templateform = new Templateform;
    this.formsque = db.collection('FormQuestion', ref => ref.orderBy('order')).valueChanges();
    this.formquestions = db.collection('FormQuestion', ref => ref.where('formid','==',this.formsid).orderBy('order')).valueChanges();
    
      console.log(this.formquestions);
    this.windowref = window;
    this.options=[];
    this.updateform=new Templateform;
   
  }

  ngOnInit() {

  }

  displaytemplate(formque){
    console.log("this is to show the template");
    console.log(formque.id);
    this.formqueid = formque.id;
    this.types = formque.type;
    this.db.doc('/FormQuestion/'+this.formqueid).valueChanges().subscribe(data => {
      this.getoption=data['Answeroption'];
    })
}

Addoptions(){
  console.log(this.formqueid);
  console.log(this.dropdownoptions);
  this.db.doc('/FormQuestion/'+this.formqueid).valueChanges().subscribe(data => {
    this.getoption=data['Answeroption'];
    console.log(this.getoption);
  this.getoption.push(this.dropdownoptions);
  this.db.doc('/FormQuestion/'+this.formqueid).update({
    Answeroption:this.getoption
  })
  this.dropdownoptions="";
  })
  
}

Addcheckoptions(){
  console.log(this.checkboxs);
  this.db.doc('/FormQuestion/'+this.formqueid).valueChanges().subscribe(data => {
    this.getoption=data['Answeroption'];
    console.log(this.getoption);
  this.getoption.push(this.checkboxs);
  this.db.doc('/FormQuestion/'+this.formqueid).update({
    Answeroption:this.getoption
  })
  this.checkboxs="";
  })
}

/*
  showedit(formque){
    console.log("formid",formque.id);
    this.currentid={
      formid:formque.id,
      formques: this.db.doc('/FormQuestion/'+formque.id).valueChanges(),
    }
    console.log(this.currentid);
  }
*/
deleteform(formque){
  if(confirm("Are you sure want to delete this Question")){
    console.log("Deleting FormQUestion&Answer:"+formque.id);
    this.db.doc('/FormQuestion/'+formque.id).delete().catch(error => console.log(error));
  }
  }

  editform(formque){
    this.showedit=true;
    this.updateid=formque.id;
    console.log(formque.order);
   this.updateform.order= formque.order;
   this.updateform.lable= formque.lable;
   this.updateform.type= formque.type;
   this.updateform.required=formque.required;
  }

  updatedetails(){
    console.log("the data is updated in ",this.updateid)
    this.db.doc('/FormQuestion/'+this.updateid).update({
      order:this.updateform.order,
      lable:this.updateform.lable,
      type:this.updateform.type,
      required:this.updateform.required
    }).then(res =>{
      this.updateform = new Templateform;
    });
  }

createform(){
  console.log("design a template");
  const questionid = this.db.createId();
  this.db.doc('/FormQuestion/'+questionid).set({
    order:this.templateform.order,
    heading:this.templateform.heading,
    description:this.templateform.description,
    lable:this.templateform.lable,
    type:this.templateform.type,
    Answeroption:this.options,
    required:this.templateform.required,
    formid:this.formsid,
    id:questionid
  }).then(res =>{
    this.templateform = new Templateform;
  });

}

}
