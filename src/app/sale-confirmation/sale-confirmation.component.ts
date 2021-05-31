import { Component, OnInit } from "@angular/core";
import { FormGroup,FormControl,Validators,FormBuilder} from "@angular/forms";
import {AngularFirestore,AngularFirestoreCollection} from "@angular/fire/firestore";
import { ActivatedRoute, Router } from "@angular/router";
import { User, Purchase, Paymentplan, Payment, Cheque } from '../classes';
import {DatePipe} from '@angular/common';
import{formatDate} from '@angular/common';
import {AuthService} from '../core/auth.service';
import {Observable} from 'rxjs';


@Component({
  selector: "app-sale-confirmation",
  templateUrl: "./sale-confirmation.component.html",
  styleUrls: ["./sale-confirmation.component.css"]
})
export class SaleConfirmationComponent implements OnInit {
  db: AngularFirestore;
  participantsCollection: any;
  purchasesCollection: any;
  paymentsCollection: any;
  paymentplansCollection: any;
  paymentplan: Paymentplan;
  user: User;
  updateuser: User;
  purchase: Purchase;
  saleCollection: AngularFirestoreCollection;
  //
  productlist;
  list;
  salesName;
  //
  productDate;
  pricechange;
  //
  packages: string[] = ["1", "2", "3", "4"];
  packagess: string[] = ["1", "2", "3", "4"];
  paymentStatus:string[]=["Fully Paid","EMI"]
  bonuspackage;
  //
  ids;
  data;
  count;
  userData;
  //
  userID;
  //payment fullypaid EMI select
  paymentStatusSelected:boolean;

  //form validation

  confirmationGroup: FormGroup = this.fb.group({
    firstName: [{ value: "", disabled: true }, Validators.required],
    lastName: [{ value: "", disabled: true }, Validators.required],
    email: [{ value: "", disabled: true }, Validators.required],
    phoneNumber: [{ value: "", disabled: true }, Validators.required],
    tokenAmount: [{ value: "", disabled: true }, Validators.required],
    saleDate: [{ value: "", disabled: true }, Validators.required],
    product: ["", Validators.required],
    closedPrice: ["", Validators.required],
    paymentStatus: ["", Validators.required],
    consultationPackage: ["", Validators.required],
    reviewPackage: ["", Validators.required],
    salesPersonName: ["", Validators.required],
    dateInWhichLeadCame: ["", Validators.required],
    productValidity: ["", Validators.required],
    totalPrice: ["", Validators.required],
    preDeliveryMinimumAmount: ["", ],
    EMI_Start_Date: ["",],
    EMI_Date: ["",],
    EMI_Amount: ["", ],
    bonus: ["",]
  });
  // logged in salesperson displayname
  username


  constructor( private fb: FormBuilder,db: AngularFirestore,private route: ActivatedRoute,private router: Router,private datePipe : DatePipe,private auth : AuthService) 
  {
   
    
    //
    this.db = db;
    //
    this.purchase = new Purchase;
    this.user = new User;
    this.updateuser = new User;
    this.paymentplan = new Paymentplan;
    // drop down list data in the form
this.db.collection("product").doc("productid").get().toPromise().then((doc) => {
  this.list  = doc.data()['products']; 
  this.bonuspackage = doc.data()['bonuspackages']
  this.salesName = doc.data()['salesname']
  this.productlist = doc.data();
  this.auth.user.subscribe( doc => {
    // console.log("doc:",doc.displayName);
    
    this.username = doc.displayName
    // console.log("username :",this.username);
    this.selectusername()
  })

  

  // for(let i = 0 ; i < this.salesName.length;i++){
  //   if(this.username == this.salesName[i]){
  //    return this.confirmationGroup.get('salesPersonName').setValue(this.salesName[i])
  //   }
    
  // }
  
  console.log(this.confirmationGroup.get('salesPersonName').value);
  
  
})
    //
    this.userID = this.route.snapshot.params.id;
    //
    this.participantsCollection = db.collection('Participants', ref => ref.orderBy('firstpurchasedate', "desc"));
    this.purchasesCollection = db.collection('ParticipantPurchases', ref => ref.orderBy('purchasedate', "desc"));
    this.paymentsCollection = db.collection('ParticipantPayments', ref => ref.orderBy('date', "desc"));
    
    //patching value in saleconfirmation form
    this.saleCollection = this.db.collection("saleinitiation", ref =>ref.where("id", "==", this.userID));
    this.saleCollection.valueChanges().subscribe(snapshot => {
      snapshot.forEach(doc => {
        this.data = doc;
        
        
      });
      this.confirmationGroup.patchValue({
        
        firstName: this.data.firstname,
        lastName: this.data.lastname,
        email: this.data.email,
        phoneNumber: this.data.phonenumber,
        tokenAmount: this.data.tokenamount,
        saleDate: this.data.saledate
        ///this.data.saledate.split("/").reverse().join("-")
        
      });
console.log(this.data.saledate);

    });
    
  }

  ngOnInit():void {
    
  }
  ngAfterViewInit(){
   
  }
//
selectusername(){
  const nameFind = this.salesName.find( item => { return this.username === item
  })
  // console.log(nameFind);
  
  this.confirmationGroup.get('salesPersonName').setValue(nameFind)
  
}

//
onselected(x){
console.log(this.paymentStatusSelected);
if ( x === "EMI"){
  this.paymentStatusSelected = true;
  this.confirmationGroup.get('preDeliveryMinimumAmount').setValidators(Validators.required)
  this.confirmationGroup.get('EMI_Start_Date').setValidators(Validators.required)
  this.confirmationGroup.get('EMI_Date').setValidators(Validators.required)
  this.confirmationGroup.get('EMI_Amount').setValidators(Validators.required)
  this.confirmationGroup.get('preDeliveryMinimumAmount').updateValueAndValidity()
  this.confirmationGroup.get('EMI_Start_Date').updateValueAndValidity()
  this.confirmationGroup.get('EMI_Date').updateValueAndValidity()
  this.confirmationGroup.get('EMI_Amount').updateValueAndValidity()
}else{
  this.paymentStatusSelected = false;
  this.confirmationGroup.get('preDeliveryMinimumAmount').clearValidators()
  this.confirmationGroup.get('EMI_Start_Date').clearValidators()
  this.confirmationGroup.get('EMI_Date').clearValidators()
  this.confirmationGroup.get('EMI_Amount').clearValidators()
  this.confirmationGroup.get('preDeliveryMinimumAmount').updateValueAndValidity()
  this.confirmationGroup.get('EMI_Start_Date').updateValueAndValidity()
  this.confirmationGroup.get('EMI_Date').updateValueAndValidity()
  this.confirmationGroup.get('EMI_Amount').updateValueAndValidity()
}

}
///
onpricechange(value){
 this.pricechange = parseInt(value);
 const num1 = this.pricechange * 0.18
 console.log(num1);
 const num2 = this.pricechange + num1
 console.log(num2);
 this.confirmationGroup.patchValue({
   totalPrice : num2
 })
}
///
  
  async onSubmit(value) {
    console.log(value);
    console.log(value.productValidity);
    
    
    const tocalpdc = parseInt(value.closedPrice)
    const pdc = Math.round(
      ((tocalpdc + (tocalpdc * 0.18))-this.data.tokenamount) / value.EMI_Amount
    );
  // document updated in sale initiation field ....
    this.db
      .collection("/saleinitiation")
      .doc(this.userID)
      .update({
        product: value.product,
        closedprice: value.closedPrice,
        paymentstatus: value.paymentStatus,
        consultationpackage: value.consultationPackage,
        reviewpackage: value.reviewPackage,
        salespersonname: value.salesPersonName,
        dateinwhichleadcame: new Date(value.dateInWhichLeadCame).toLocaleDateString(),
        productvalidity:new Date(value.productValidity).toLocaleDateString(),
        totalprice: value.totalPrice,
        predeliveryminimumamount: value.preDeliveryMinimumAmount,
        emistartdate: value.EMI_Start_Date !== "" ? new Date(value.EMI_Start_Date).toLocaleDateString() : null,
        emidate: value.EMI_Date !== "" ? new Date(value.EMI_Date).toLocaleDateString(): null,
        emiamount: value.EMI_Amount,
        bonus: value.bonus !== "" ? value.bonus : "---",
        saleconfirmedstatus: "Sale Confirmed",
        paymentplanstatus: "Waiting for Confirmation",
        paymentplanstatusmail: "Resend Mail",
        onboardingstatus: "Ready For OnBoarding",
        pdcstatus: value.EMI_Amount !== "" ? pdc : ""
      })
      .then(() => {
        console.log("Document updated with new field");
        this.router.navigateByUrl("/new_sales");
      })
      .catch(error => {
        console.error("error updating document with new field:", error);
      });
  // updating value in participants collection
      const batch = this.db.firestore.batch();
      const participantid = this.db.createId();
      const particpantDoc = this.participantsCollection.doc(participantid);
      const feespaid = Math.ceil(this.data.tokenamount/1.18);

    var pp_status = "Active PaymentPlan";

    // if(this.paymentplan.installmentamount < 0) {
    //   this.paymentplan.installmentamount = 0;
    //   pp_status = "Missing PP";
    // }if(this.paymentplan.paymentday < 0){
    //   this.paymentplan.paymentday = 0;
    // }if(this.user.billingaddress){
    // batch.set(particpantDoc.ref, { 
    //   id: participantid,
    //   firstname: this.data.firstname,
    //   lastname: this.data.lastname,
    //   name:this.data.firstname + " " + this.data.lastname,
    //   email: this.data.email,
    //   phone: this.data.phonenumber,
    //   firstpurchasedate: this.data.saledate,
    //   recentpurchase: value.product,
    //   pp_totalpurchasevalue: value.closedPrice,
    //   pp_totalpaid: feespaid,
    //   pp_balance: value.closedPrice - feespaid,
    //   pp_frequency: "monthly",
    //   pp_installmentamount: value.EMI_Amount,
    //   pp_installmentspaid: 0,
    //   pp_paymentday: value.EMI_Date,
    //   pp_lastpayment: null,
    //   pp_installmentsdue: Math.ceil((value.closedPrice - feespaid) / (value.EMI_Amount / 1.18)),
    //   pp_status: pp_status,
    //   billingaddress: null,
      
    // });
    // }
    
      batch.set(particpantDoc.ref, {
        id: participantid,
        firstname: this.data.firstname,
        lastname: this.data.lastname,
        name:this.data.firstname + " " + this.data.lastname,
        email: this.data.email,
        phone: this.data.phonenumber,
        firstpurchasedate: this.data.saledate,
        recentpurchase:value.product,
        pp_totalpurchasevalue: value.closedPrice,
        pp_totalpaid: feespaid,
        pp_balance: value.closedPrice - feespaid,
        pp_frequency: "monthly",
        pp_installmentamount: value.EMI_Amount,
        pp_installmentspaid: 0,
        pp_paymentday: value.EMI_Date !== "" ? new Date(value.EMI_Date).toLocaleDateString(): null,
        pp_lastpayment: null,
        pp_installmentsdue: Math.ceil((value.closedPrice - feespaid) / (value.EMI_Amount / 1.18)),
        pp_status: pp_status
        });
    

      //Add Purchase
      const purchaseid = this.db.createId();
      const purchaseDoc = this.purchasesCollection.doc(purchaseid);
      batch.set(purchaseDoc.ref, {
      participantid: participantid,
      fee: value.closedPrice,
      gst: Math.ceil(value.closedPrice * .18),
      gross: value.closedPrice* 1.18,
      initialpayment: this.data.tokenamount,
      product: value.product,
      purchasedate: this.data.saledate,
      id: purchaseid
      });
      console.log("Added Purchase");
       //Add Payment
      const paymentid = this.db.createId();
      const paymentDoc = this.paymentsCollection.doc(paymentid);
      batch.set(paymentDoc.ref, {
         date: this.data.saledate,
         receipt: this.data.tokenamount,
         fee: feespaid,
         gst: this.data.tokenamount - feespaid,
         participantid: participantid,
         id:paymentid,
        
         });
      console.log("Added Payment");
      await batch.commit();
      this.paymentplan = new Paymentplan();
      this.purchase = new Purchase();
      this.user = new User();
  }
////////

  onProductSelect(value){ 

if(value === "uP!"){  
 console.log(this.productlist.uPdate.toDate())
  this.productDate = this.datePipe.transform(this.productlist.uPdate.toDate(),"yyyy-MM-dd");
  var n = this.productDate.toString();
  this.confirmationGroup.patchValue({productValidity:n})
  
  return      
}if(value === "Fast Track Membership"){
 
  this.productDate = this.datePipe.transform(this.productlist.FTMdate.toDate(),"yyyy-MM-dd");
  var n = this.productDate.toString();
  this.confirmationGroup.patchValue({productValidity: n})
  
  return  
}if(value === "EIT"){
  this.productDate = this.datePipe.transform(this.productlist.EITdate.toDate(),"yyyy-MM-dd");
  var n = this.productDate.toString();
  this.confirmationGroup.patchValue({productValidity: n})
  return
  
  }else
{console.log("Enter date manually"); }
   
  }

///////

  }

