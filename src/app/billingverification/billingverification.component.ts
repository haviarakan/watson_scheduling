import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AngularFireStorage } from "@angular/fire/storage";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { Observable } from "rxjs";
import { AuthService } from "../core/auth.service";
import firebase from "firebase/app";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreCollection } from "@angular/fire/firestore";
import { Billing } from "../sales";
import { BasePortalOutlet } from "@angular/cdk/portal";
import Image from "ngx-editor/lib/commands/Image";
import {finalize} from 'rxjs/operators'

@Component({
  selector: "app-billingverification",
  templateUrl: "./billingverification.component.html",
  styleUrls: ["./billingverification.component.css"]
})
export class BillingverificationComponent implements OnInit {
  uploadpercent;
  downloadURL:Observable<string>;
  gstChecked = false;
  //
  fileList = [];
  file;
  imageurls = [];  
  //
  // loading = true;
  formDisabled = false;
  //
  data;
  pp_data;
  //
  
  //
  billingForm: FormGroup = this.fb.group({
    firstname:[,{validators: [Validators.required],updateOn:"change"}],
    lastname: [,{validators: [Validators.required],updateOn:"change"}],
     dob:[,{validators: [Validators.required],updateOn:"change"}],
    email: [,{validators: [Validators.required,Validators.email],updateOn:"change"}],
    phoneNumber: [,{ validators : [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(10),Validators.minLength(10)],updateOn : "change"}],
    billingAddress: [,{validators: [Validators.required],updateOn:"change"}],
    billingEmail: [,{validators: [Validators.required,Validators.email],updateOn:"change"}],
    gstBillingAddress: [,],
    gstBillingEmail:[,],
    gstNumber: [,],
    pancardNumber: [,],
  }); 
  constructor(
    private db: AngularFirestore,
    private fb: FormBuilder,
    private storage: AngularFireStorage
  ) {
  }

  ngOnInit(): void {
   
  }

  // onImageChange(event) {
  //   const reader = new FileReader();

  //   if (event.target.files && event.target.files.length) {
  //     const [file] = event.target.files;
  //     reader.readAsDataURL(file);

  //     reader.onload = () => {
  //       this.billingForm.patchValue({
  //         file: reader.result
  //       });
  //     };
  //   }
  // }

  async addimage(image) {
 if(image.files.length === 0){
   return console.log("image not selected : ",image);
   
 }else{

  for(let i = 0;i<image.files.length;i++){
    this.fileList.push(image.files[i])
  }
   this.uploadpercent = 0;
    
    console.log(this.fileList);
    
    this.file = image.files
    console.log(this.file)
    
    console.log(this.file[0].name);
    console.log(this.file.length);
    for(let i=0;i < this.file.length;i++){
    const filepath = "client photo/"+this.file[i].name;
    console.log(filepath);
    const refpath = this.storage.ref(filepath);
    const task = this.storage.upload(filepath,this.file[i]);
    //  task.percentageChanges().subscribe(n => { this.uploadpercent = n});
    
    
    task.snapshotChanges().pipe(
      finalize(() => refpath.getDownloadURL().subscribe(url => {this.imageurls.push(url),
        console.log(this.imageurls),
        this.uploadpercent =  Math.round(this.imageurls.length /this.file.length* 100);
      
      })
      )
      ).subscribe()
    // this.loading = false;
    } 
  }
}

  
////
 onSubmit(value) {
    console.log(value, this.imageurls);
    console.log(this.fileList);

    
    
    console.log(this.imageurls.length);
    console.log(this.fileList.length);
    
    
    // this.data = value.gstNumber !== null ? value.gstNumber : "Not Provided";
    if(this.imageurls === undefined){
      return alert("Attach photocopy of any goverment id")
    }if(this.imageurls.length !== this.fileList.length){
      return alert("image uploading........")
    }if(this.imageurls.length === 0){
        return alert("please attach any goverment id photo")
    }else{
    this.formDisabled = true; 
    const billingId = this.db.createId();
    this.db
      .collection("/billingverification")
      .doc(billingId)
      .set({
        id: billingId,
        firstname:value.firstname,
        lastname:value.lastname,
        name: value.firstname + " " + value.lastname,
        dob:value.dob,
        email: value.email,
        phonenumber: value.phoneNumber,
        billingaddress: value.billingAddress,
        billingemail: value.billingEmail,
        gstaddress: value.gstBillingAddress,
        gstemail: value.gstBillingEmail,
        gstnumber: value.gstNumber ,  
        pancardnumber: value.pancardNumber,
        image: this.imageurls
      })
      .then(async () => {
        console.log("Document successfully Submitted");
        
       await this.db.collection("saleinitiation",ref => ref.where("email","==", value.email)).get().toPromise().then(snapshot => {
             snapshot.docs.forEach(doc => {
               this.pp_data = doc.id;
               console.log(this.pp_data);
             }) 
        })
        
      }).then(async () => {
        console.log("sucess");
        
        await this.db.collection("saleinitiation").doc(this.pp_data).update({
          paymentplanstatus:"Payment Plan Confirmed",
          paymentplanstatusmail:null
        })  
      }).catch( error => { console.log(error);
      }).catch(error => {
        console.error("Error written Document : ", error);
      });
    }
     
  }

  ///

  onChange(value){

 this.gstChecked = value;
 if(value === true){
 this.billingForm.get('gstBillingAddress').setValidators(Validators.required)
 this.billingForm.get('gstBillingEmail').setValidators([Validators.required,Validators.email])
 this.billingForm.get('gstNumber').setValidators(Validators.required)
 this.billingForm.get('pancardNumber').setValidators(Validators.required)
 this.billingForm.get('gstBillingAddress').updateValueAndValidity()
 this.billingForm.get('gstBillingEmail').updateValueAndValidity()
 this.billingForm.get('gstNumber').updateValueAndValidity()
 this.billingForm.get('pancardNumber').updateValueAndValidity()
 return console.log(value);
 
  }if(value === false){
    this.billingForm.get('gstBillingAddress').clearValidators()
 this.billingForm.get('gstBillingEmail').clearValidators()
 this.billingForm.get('gstNumber').clearValidators()
 this.billingForm.get('pancardNumber').clearValidators()
 this.billingForm.get('gstBillingAddress').updateValueAndValidity()
 this.billingForm.get('gstBillingEmail').updateValueAndValidity()
 this.billingForm.get('gstNumber').updateValueAndValidity()
 this.billingForm.get('pancardNumber').updateValueAndValidity()
 
 return console.log(value);
 
  }else{
    console.log("hello");
    
  }
  
}
}

// this.dataSource = new MatTableDataSource();
// this.billing = new Billing;
// this.db=db;
// this.products = [
//   'uP!',
//   'FastTrack Membership',
//   'CPM',
//   'uPgrade to FastTrack',
//   'uPgrade to EIS',
//   'Fasttrack + EIS',
//   'Breakthrough',
//   'WiSH',
// ];

// addbillingdetails(){
//   console.log("Inside the add document screen");
//  const Participantid = this.db.createId();
//  this.db.doc('/Participants/'+Participantid).set({
//    checkvariable:30,
//    firstname:this.billing.firstname,
//    lastname:this.billing.lname,
//    name:this.billing.firstname+" "+this.billing.lname,
//    email:this.billing.email,
//    phone:this.billing.phone,
//    recentpurchase:this.billing.product,
//    bemail:this.billing.email,
//    firstpurchasedate:"25-12-2020",
//    pp_paymentday:this.billing.paymentday,
//    pp_installmentamount:0,
//    pp_balance:0,
//    pp_status:"Active PaymentPlan",
//    pp_lastpayment:" ",
//    pp_installmentsdue:0,
//    pp_frequency:"monthly",
//    pp_installmentspaid:0,
//    pp_totalpaid:0,
//    pp_totalpurchasevalue:0,
//    billingaddress:this.billing.billingaddress,
//    //Photo:this.billing.Photo,
//    Pancard:this.billing.pancard,
//    status:"onboard",
//    id:Participantid

//  })
//  console.log("the Participant id",Participantid);

// // this.billingCollection = this.db.collection('/saleinitiation',ref =>ref.where('email','==',this.billing.email).orderBy("name"));
// // this.billingCollection.valueChanges().subscribe(data=>{
// //   this.paymentplan=data.paymentplan;
// // })

//old Code 

// import { Component, OnInit } from '@angular/core';
// import { MatTableDataSource} from '@angular/material/table';
// import {MatSort} from '@angular/material/sort';
// import {Observable } from 'rxjs';
// import { AuthService } from '../core/auth.service';
// import firebase from 'firebase/app';
// import { AngularFirestore} from '@angular/fire/firestore';
// import { AngularFireModule } from '@angular/fire';
// import { AngularFirestoreCollection } from '@angular/fire/firestore';
// import {Billing} from '../sales' ;

// @Component({
//   selector: 'app-billingverification',
//   templateUrl: './billingverification.component.html',
//   styleUrls: ['./billingverification.component.css']
// })
// export class BillingverificationComponent implements OnInit {
//   dataSource:MatTableDataSource<any>;
//   billing:Billing;
//   products: Array<String>;
//   db: AngularFirestore;
//   purchasedate;
//   recentpurchase;
//   totalpurchasevalue;
//   billingCollection;
//   paymentplan;

//   constructor(db: AngularFirestore) {
//     this.dataSource = new MatTableDataSource();
//     this.billing = new Billing;
//     this.db=db;
//     this.products = [
//       'uP!',
//       'FastTrack Membership',
//       'CPM', 
//       'uPgrade to FastTrack',
//       'uPgrade to EIS',
//       'Fasttrack + EIS',
//       'Breakthrough',
//       'WiSH',
//     ];
//   }

//   ngOnInit(): void {
//   }

//   addbillingdetails(){
//     console.log("Inside the add document screen");
//    const Participantid = this.db.createId();
//    this.db.doc('/Participants/'+Participantid).set({
//      checkvariable:30,
//      firstname:this.billing.firstname,
//      lastname:this.billing.lname,
//      name:this.billing.firstname+" "+this.billing.lname,
//      email:this.billing.email,
//      phone:this.billing.phone,
//      recentpurchase:this.billing.product,
//      bemail:this.billing.email,
//      firstpurchasedate:"25-12-2020",
//      pp_paymentday:this.billing.paymentday,
//      pp_installmentamount:0,
//      pp_balance:0,
//      pp_status:"Active PaymentPlan",
//      pp_lastpayment:" ",
//      pp_installmentsdue:0,
//      pp_frequency:"monthly",
//      pp_installmentspaid:0,
//      pp_totalpaid:0,
//      pp_totalpurchasevalue:0,
//      billingaddress:this.billing.billingaddress,
//      //Photo:this.billing.Photo,
//      Pancard:this.billing.pancard,
//      status:"onboard",
//      id:Participantid
   
//    })
//    console.log("the Participant id",Participantid);
  
//   // this.billingCollection = this.db.collection('/saleinitiation',ref =>ref.where('email','==',this.billing.email).orderBy("name"));
//   // this.billingCollection.valueChanges().subscribe(data=>{
//   //   this.paymentplan=data.paymentplan;
//   // })
      
  
//   }
// }
