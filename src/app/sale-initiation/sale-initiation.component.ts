import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { Observable } from "rxjs";
import { Newsale } from "../sales";
import { AuthService } from "../core/auth.service";
import firebase from "firebase/app";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreCollection } from "@angular/fire/firestore";
import { FormGroup, FormControl } from "@angular/forms";
import { FormBuilder, Validators } from "@angular/forms";
//import { DateAdapter } from "@angular/material/core";
import { Router } from "@angular/router";
import {formatDate} from '@angular/common';

@Component({
  selector: "app-sale-initiation",
  templateUrl: "./sale-initiation.component.html",
  styleUrls: ["./sale-initiation.component.css"]
})
export class SaleInitiationComponent implements OnInit {
  // dataSource:MatTableDataSource<any>;
  // newsale: Newsale;
  // products: Array<String>;
  dontshowform;
  db: AngularFirestore;
  dob;

  registrationForm: FormGroup = this.fb.group({
    firstname: [, { Validators: [Validators.required], updateOn: "change" }],
    lastname: [, { Validators: [Validators.required], updateOn: "change" }],
    email: [
      ,
      {
        Validators: [Validators.required, Validators.email],
        updateOn: "change"
      }
    ],
    phonenumber: [, { Validators: [Validators.required], updateOn: "change" }],
    tokenamount: [, { Validators: [Validators.required], updateOn: "change" }],
    saledate: [, { Validators: [Validators.required], updateOn: "change" }],
    paymentMode: [
      ,
      { Validators: [Validators.required], updateOn: "change" }
    ]
  });

  constructor(
    db: AngularFirestore,
    private fb: FormBuilder,
  //  private dateAdapter: DateAdapter<Date>,
    private router: Router
  ) {
    console.log(this.dontshowform);

    //     this.dataSource = new MatTableDataSource();
    //     this.newsale = new Newsale;
    this.db = db;
//    this.dateAdapter.setLocale("en-GB"); //dd/MM/yyyy

    //     this.products = [
    //       'uP!',
    //       'FastTrack Membership',
    //       'CPM',
    //       'CTD',
    //       'uPgrade to FastTrack',
    //       'uPgrade to EIS',
    //       'Fasttrack + EIS',
    //       'Breakthrough',
    //       'WiSH',
    //     ];
  }

  ngOnInit(): void {}

  // addsale() {
  //   console.log("Adding New leads");
  //   const saleinitiationid = this.db.createId();
  //   this.db.doc("/saleinitiation/" + saleinitiationid).set({
  //     firstname: this.newsale.firstname,
  //     lastname: this.newsale.lname,
  //     name: this.newsale.firstname + this.newsale.lname,
  //     email: this.newsale.email,
  //     phone: this.newsale.phone,
  //     purchasedate: this.newsale.saledate,
  //     product: this.newsale.product,
  //     closedprice: this.newsale.closedprice,
  //     emiplan: this.newsale.emiplan,
  //     tokenamount: this.newsale.tokenamt,
  //     saleby: this.newsale.saleby,
  //     paymentplan: "PP not confirmed",
  //     onboarding: "onboarding pending",
  //     id: saleinitiationid,
  //     salestatus: "sale pending"
  //   });
  // }

  // updateDOB(dateObject) {
  //   // convert object to string then trim it to yyyy-mm-dd
  //   const stringified = JSON.stringify(dateObject.value);
  //   this.dob = stringified.substring(1, 11);
  //   console.log(this.dob);
  //   return this.registrationForm.get("saledate").setValue(this.dob);
  // }
  

  onSubmit(value) {
    this.dontshowform = true;
    console.log(value);
    const saleinitiationid = this.db.createId();
    this.db
      .collection("/saleinitiation")
      .doc(saleinitiationid)
      .set({
        id: saleinitiationid,
        saleconfirmedstatus: "Enter sale Details",
        firstname: value.firstname,
        lastname: value.lastname,
        name:value.firstname +" "+ value.lastname,
        email: value.email,
        phonenumber: value.phonenumber,
        saledate: new Date(value.saledate).toLocaleDateString(),
        tokenamount: value.tokenamount,
        modeofpayment: value.paymentMode
      })
      .then(() => {
        console.log("Document successfully written!");
        this.router.navigateByUrl("/new_sales");
      })
      .catch(error => {
        console.error("Error writing document: ", error);
      });
  }
}

//old code.
//formatDate(value.saledate,'dd-MM-yyyy','en-US')a
// import { Component, OnInit } from '@angular/core';
// import { MatTableDataSource} from '@angular/material/table';
// import {MatSort} from '@angular/material/sort';
// import {Observable } from 'rxjs';
// import {Newsale} from '../sales';
// import { AuthService } from '../core/auth.service';
// import firebase from 'firebase/app';
// import { AngularFirestore} from '@angular/fire/firestore';
// import { AngularFireModule } from '@angular/fire';
// import { AngularFirestoreCollection } from '@angular/fire/firestore';


// @Component({
//   selector: 'app-sale-initiation',
//   templateUrl: './sale-initiation.component.html',
//   styleUrls: ['./sale-initiation.component.css']
// })
// export class SaleInitiationComponent implements OnInit {
//   dataSource:MatTableDataSource<any>;
//   newsale: Newsale;
//   products: Array<String>;
//   db: AngularFirestore;
  
  
//   constructor(db: AngularFirestore) {
//     this.dataSource = new MatTableDataSource();
//     this.newsale = new Newsale;
//     this.db=db;
//     this.products = [
//       'uP!',
//       'FastTrack Membership',
//       'CPM', 
//       'CTD',
//       'uPgrade to FastTrack',
//       'uPgrade to EIS',
//       'Fasttrack + EIS',
//       'Breakthrough',
//       'WiSH',
//     ];
//  }
  

//   ngOnInit(): void {
//   }

//   addsale(){
//     console.log("Adding New leads");
//     const saleinitiationid = this.db.createId();
//     this.db.doc('/saleinitiation/'+saleinitiationid).set({
//       firstname:this.newsale.firstname,
//       lastname:this.newsale.lname,
//       name:this.newsale.firstname+this.newsale.lname,
//       email:this.newsale.email,
//       phone:this.newsale.phone,
//       purchasedate:this.newsale.saledate,
//       product:this.newsale.product,
//       closedprice:this.newsale.closedprice,
//       emiplan:this.newsale.emiplan,
//       tokenamount:this.newsale.tokenamt,
//       saleby:this.newsale.saleby,
//       paymentplan:"PP not confirmed",
//       onboarding:"onboarding pending",
//       id:saleinitiationid,
//       salestatus:"sale pending",
//       })
//    }
//   }
