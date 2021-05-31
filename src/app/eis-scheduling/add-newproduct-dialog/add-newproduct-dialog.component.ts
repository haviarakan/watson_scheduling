import { Component, OnInit } from '@angular/core';
import {FormGroup,Validators,FormBuilder,FormControl,FormArray} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/firestore'


@Component({
  selector: 'app-add-newproduct-dialog',
  templateUrl: './add-newproduct-dialog.component.html',
  styleUrls: ['./add-newproduct-dialog.component.css']
})
export class AddNewproductDialogComponent implements OnInit {

  ////
  addnewproductForm:FormGroup 
  

  constructor(private fb : FormBuilder,private afs : AngularFirestore) { }

  ngOnInit(){

    this. addnewproductForm = this.fb.group({
      productname:[,{Validators : [Validators.required],updateOn : "change"}] ,
      eventtypearray: this.fb.array([this.createeventtypearray()])
    
    
    })
  }

 
  createeventtypearray(){
    return this.fb.group ({
      eventtypename:[,{Validators : [Validators.required],updateOn : "change"}] ,
      duration:[,{Validators : [Validators.required],updateOn : "change"}] ,
      collaboration:[,{Validators : [Validators.required],updateOn : "change"}] 
    })
  }

  get eventtypearray(){
    return this.addnewproductForm.get('eventtypearray') as FormArray
  }

  addeventtypearray(){
    return this.eventtypearray.push(this.createeventtypearray())
  }
  removeeventtypearray(index){
    console.log(index);
    
    return this.eventtypearray.removeAt(index)
  }

  onformsubmit(value){
     console.log(value);

    const id = this.afs.createId()
    this.afs.collection("New_Product").doc(id).set({
      productname:value.productname,
      eventtypenames: value.eventtypearray
    }).then ( () => {
      console.log("Form Successfully Submitted");
      
    }).catch( err => { console.log(err);
    })
     
  }
}
