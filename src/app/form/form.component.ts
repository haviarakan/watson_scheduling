import { Component, OnInit } from '@angular/core';
import { Adminform ,Templateform} from '../form';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { WindowRef } from '../WindowRef';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  db: AngularFirestore;
  templateform:Templateform;
  formsque:Observable<any>;
  windowref: WindowRef;
  form:AngularFirestoreCollection;
  formque;
  formsname:String;
  getoption;
  selectoption;
  textinput;
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
  order;
  checked;
 textarea={}
 dropdown={}
 input={}
 checkbox={} 
filledarr;
textvalue;
typesarray=[];
  data;

  constructor(db: AngularFirestore,public auth: AuthService, private window: WindowRef,public route: ActivatedRoute) { 
    this.db = db;
    this.windowref = window;
    this.formsname = this.route.snapshot.paramMap.get('form.name');
    console.log(this.formsname);
    this.templateform = new Templateform;

  //this.formsque = db.collection('FormQuestion', ref => ref.orderBy('order')).valueChanges();
  
  this.forms = db.collection('Forms', ref => ref.where("name",'==',this.formsname).orderBy('id'));
  this.forms.valueChanges().subscribe(data=>{
    data.forEach(snap=> {
      this.formid=snap.id;
    });
    console.log(this.formid);

   
    this.formsque = db.collection('FormQuestion', ref => ref.where('formid','==',this.formid).orderBy('order')).valueChanges();
    
    console.log(this.formsque);
    this.form = db.collection('FormQuestion', ref => ref.where('formid','==',this.formid).orderBy('order'));
    this.form.snapshotChanges().subscribe(val=>{
      var list=[];
      val.forEach(snap=>{
        this.data=snap.payload.doc.data()['lable'];
        list.push({
          que:this.data,ans:[]
        })
      })
      this.typesarray=list;
      console.log(this.data);
      console.log(this.typesarray);
    })
    
  });

 


}

  ngOnInit() {
  }

  selectedoption(selectoption){
    console.log(selectoption);
  }

  
  onchange(ans,i,ischecked:boolean){
    console.log(ans);
    console.log(i);
    this.typesarray[i].ans.includes(ans) ? this.typesarray[i].ans.splice(this.typesarray[i].ans.indexOf(ans),1) : this.typesarray[i].ans.push(ans)
    /* if(ischecked){
       this.marked.push(ans);
       this.checked=this.marked;
       console.log(this.marked)
       
     }
     else{
       let index=this.marked.indexOf(ans);
       this.marked.splice(index,1);
       console.log(this.marked);
       
     }*/
  }


  displaytemplate(formque){
    
    console.log("this is to show the template");
    console.log(formque.id);
    this.id = formque.id; 
    /*
    if(formque.type=="dropdown"){
      this.filled.push({questions:formque.lable,answers:this.selectoption})
      console.log(this.filled);
    }
    else if(formque.type=="textarea"){
      this.filled.push({questions:formque.lable,answers:this.templateform.textinput})
      console.log(this.filled);
    }
  else if(formque.type=="checkbox"){
    this.filled.push({questions:formque.lable,answers:this.checked})
    console.log(this.filled);
  
  }*/
}
  


  formsubmitted(){
    console.log("this is the complet form submitted by participant");
    console.log(this.typesarray);
    var submitid = this.db.createId();
    this.db.doc('/Formsubmitted/'+submitid).set({
      QuestionAnswers:this.typesarray,
      id:submitid,
    })
    
  }

}
