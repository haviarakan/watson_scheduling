import { Component, OnInit,inject, Inject } from '@angular/core';
import {FormGroup,Validators,FormBuilder} from '@angular/forms' 
import {AngularFirestore} from '@angular/fire/firestore'
import {MAT_DIALOG_DATA} from '@angular/material/dialog'

@Component({
  selector: 'app-add-neweisdialog',
  templateUrl: './add-neweisdialog.component.html',
  styleUrls: ['./add-neweisdialog.component.css']
})
export class AddNeweisdialogComponent implements OnInit {


  ////formgroup
  addneweisForm: FormGroup = this.fb.group({
   
    name : [,{Validators : [Validators.required],updateOn : "change"}],
    email : [,{Validators: [Validators.required,Validators.email],updateOn:"change"}],
    phonenumber : [,{Validators: [Validators.required],updateOn:"change"}],
    zoomurl:[,{Validators: [Validators.required],updateOn:"change"}],
    zoomid:[,{Validators: [Validators.required],updateOn:"change"}],
    zoompassword:[,Validators.required]
  
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data : any ,private afs : AngularFirestore,private fb : FormBuilder) {
    console.log("user data : ",this.data);
    console.log(this.data !== null);
    
    if(this.data){

      this.addneweisForm.patchValue({
        
        name : this.data.name,
        email:this.data.email,
        phonenumber:this.data.phonenumber,
        zoomurl:this.data.zoomurl,
        zoomid:this.data.zoomid,
        zoompassword:this.data.zoompassword
  
      })

    }
    
    
   }

  ngOnInit(): void {
  }

  onFormSubmit(value){
    console.log(value);

if (this.data !== null ){

  
  this.afs.collection("EISUserDetails").doc(this.data.id).update({
    
    name : value.name,
    email:value.email,
    phonenumber:value.phonenumber,
    zoomurl:value.zoomurl,
    zoomid:value.zoomid,
    zoompassword:value.zoompassword
  }).then( () => {
    console.log("edit document  succesfully updated to database");
    this.addneweisForm.reset()
    
  }).catch( err => {
    console.log(err);
    
  })

}if(this.data === null) {   

  const id = this.afs.createId();
  console.log(id);
  this.afs.collection("EISUserDetails").doc(id).set({
    id:id,
    name : value.name,
    email:value.email,
    phonenumber:value.phonenumber,
    zoomurl:value.zoomurl,
    zoomid:value.zoomid,
    zoompassword:value.zoompassword
  }).then( () => {
    console.log("Form succesfully submitted to database");
    this.addneweisForm.reset()
    
  }).catch( err => {
    console.log(err);
    
  })

}
   
    
    

  }

}
