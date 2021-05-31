import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { Observable } from "rxjs";
import { AuthService } from "../core/auth.service";
import firebase from "firebase/app";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreCollection } from "@angular/fire/firestore";
import Link from "ngx-editor/lib/commands/Link";
import { MatButton } from "@angular/material/button";
import { Router, RouterLinkWithHref } from "@angular/router";
import {MatPaginator} from '@angular/material/paginator';
import {FormGroup,Validators,FormBuilder} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: "app-new-sales",
  templateUrl: "./new-sales.component.html",
  styleUrls: ["./new-sales.component.css"]
})
export class NewSalesComponent implements OnInit {
  
  salesName
  ////
  
  checked = false;
  saleinitData;
  salePersonindividualData
  participantData = [];
  displayedColumns : string[] = [
    "saledate",
    "salespersonname",
    "name",
    "saleconfirmedstatus",
    "product",
    "bonus",
    "productvalidity",
    "consultationpackage",
    "reviewpackage",
    "paymentplanstatus",
    "minimumamountrequired",
    "pdcstatus",
    "oneshotpayment",
    "onboardingstatus"
  ];
  
  dataSource: MatTableDataSource<any>;
  

  @ViewChild(MatSort,{static:true}) sort:MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /// for sales dropdown 
  newsaleGroup:FormGroup = this.fb.group({
    filterInput : ['',],
    salesPersonName:['',]
  }) 


  ///// user authenticate
  user
  userDetails
  userRole

 

  constructor(private afs: AngularFirestore, private router: Router,private fb : FormBuilder,private afAuth : AngularFireAuth) {
  
  
    this.afs.collection("product").doc("productid").get().toPromise().then((doc) => {
      // this.list  = doc.data()['products']; 
      // this.bonuspackage = doc.data()['bonuspackages']
      this.salesName = doc.data()['salesname']
      // this.productlist = doc.data();
      
    })
    /////

    this.user = afAuth.authState;
    this.user.subscribe((user) => {
      this.userDetails = user
      console.log(this.userDetails.uid);
      
    })
   
    
    
  }

  ngAfterViewInit() {
    


    //// getting required data from participant collection
    this.afs.collection("Participants").valueChanges().subscribe( data => {
      data.forEach( doc => {
        this.participantData.push({
          
          firstname:doc['firstname'],
          participantemail:doc['email'],
          totalpaid:doc['pp_totalpaid'],
          chequecount:doc['chequecount']
        })
      })
    })

    ///getting data from saleinitiation collection to display data in table
    this.afs
      .collection<any>("saleinitiation")
      .valueChanges()
      .subscribe(async data => {
        ///
         this.saleinitData = data;
        ///
        await this.afs.collection('users').doc(this.userDetails.uid).get().toPromise().then ( (doc) => {

          this.userRole = doc.data()
          console.log(doc.data());
          
          console.log(this.userRole.role);
          
        })
        ////
        const result = this.saleinitData.map(item => {
          const obj = this.participantData.find( x => 
            x.participantemail === item.email
          
          );
          return {...item,...obj}
        })
        ////
       
        ///
        console.log(this.userRole.role);
        // console.log('super admin'.trim().toLowerCase());
        
        if(this.userRole.role == 'salesexecutive'){
          ///
          this.salePersonindividualData = result.filter(item => {
            console.log(item.salespersonname);
            console.log(this.userRole.displayName);
            
            
           return item.salespersonname === this.userRole.displayName
          })
              console.log(this.salePersonindividualData);
          ///
             return this.dataSource = new MatTableDataSource(this.salePersonindividualData),
             this.dataSource.sort = this.sort,
             this.dataSource.paginator = this.paginator;
        } else {
          return this.dataSource = new MatTableDataSource(result),
          this.dataSource.sort = this.sort,
          this.dataSource.paginator = this.paginator;
        }
        ////
       
        
      });
   
    
  }

 
  ngOnInit():void{
   
     
  }
//// filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filteredData);
  
  }
/// sale confirmed status
  onClick(text, text1) {
    console.log(text, text1);

    if (text1 == "Sale Confirmed") {
      this.router.navigateByUrl("/new_sales");
    } else {
      this.router.navigateByUrl(`/sale_confirmationform/${text}`);
    }
  }
  /// resend payment plan
  resendPaymentPlanMail(id){
    this.afs.collection("saleinitiation").doc(id).update({
      resendpaymentplanmail:true
    }).then(() => {
      console.log("document has successfully updated");     
    }).catch(error => {
      console.log("updating ",error);
      
    })
    
  }
  //// salespersonname dropdown select filter
    onnameselect(value){
      
  console.log(value);
this.newsaleGroup.patchValue({
  filterInput:value
})
if(value !== undefined){
return this.dataSource.filter = value.trim().toLowerCase();
    }else{
      return this.dataSource.filter = ""
      
    }
  };

}
