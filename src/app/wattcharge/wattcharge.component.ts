import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { User, Purchase, Paymentplan, Payment, Cheque } from '../classes';
import { Observable } from 'rxjs';
import {MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import 'rxjs/add/operator/take';
import { AuthService } from '../core/auth.service';
import { WindowRef } from '../WindowRef';
import * as XLSX from 'xlsx';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';


@Component({
  selector: 'app-wattcharge',
  templateUrl: './wattcharge.component.html',
  styleUrls: ['./wattcharge.component.css']
})



export class WattchargeComponent implements OnInit {

  //displayedColumns: string[] = ['name', 'recentpurchase', 'pp_totalpaid', 'pp_balance'];
  statuslist: string[] = ['Missing PP', 'Active PaymentPlan', 'Paused Temporary', 'Long Pause', 'Fully Paid','Closed Lost','Suspended','Overdue'];
  displayedColumns: string[] = ['name', 'recentpurchase', 'pp_totalpurchasevalue', 'pp_totalpaid', 'pp_balance', 'pp_installmentamount', 'pp_status'];
  dataSource:MatTableDataSource<any>;
  user: User;
  updateuser: User;
  purchase: Purchase;
  paymentplan: Paymentplan;
  newpayment: Payment;
  newpurchase: Purchase;
  products: Array<String>;
  // db: AngularFirestore;
  // participantsCollection: AngularFirestoreCollection;
  // purchasesCollection: AngularFirestoreCollection;
  // paymentsCollection: AngularFirestoreCollection;
  // paymentplansCollection: AngularFirestoreCollection;
  // passwordCollection:AngularFirestoreCollection;
   participants: Observable<any[]>;
  currentparticipant: {};
  currentpaymentplan: Paymentplan;
  cheque: Cheque;
  defaults: Observable<any>;
  windowref: WindowRef;
  pp_status: String;
  billingshow: Boolean;
  billingshow1: Boolean;
  formshow: Boolean;
  pp_installmentamount:any;
  templateid;
  time;
  getpwd;
bntdisable:boolean=true;
password;
selectedparticipant;
  //@ViewChild(MatSort) sort: MatSort;
  sort;
  participantsCollection: any;
  purchasesCollection: any;
  paymentsCollection: any;
  paymentplansCollection: any;
  passwordCollection: any;
  db: AngularFirestore;
  editor:Editor;
  

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

  userform = new FormGroup({
    // Name : new FormControl(''),
    // LastName : new FormControl(''),
    // Email : new FormControl(''),
    // phone: new FormControl(''),
    // product: new FormControl(''),
    // purchasedate: new FormControl(''),
    // fee: new FormControl(''),
    // initialpayment:new FormControl(''),
    // installpayment: new FormControl(''),
    // paymentday: new FormControl(''),
    // billingEmail: new FormControl(''),
   billingaddress:new FormControl(''),
   editbillingaddress:new FormControl(''),
  
   })
  
  
  
 

  // make sure to destory the editor
  

@ViewChild(MatSort) set content(content: ElementRef) {
  this.sort = content;
  if (this.sort){
     this.dataSource.sort = this.sort;

  }
}

@ViewChild('TABLE') table: ElementRef;


  constructor(db: AngularFirestore, public auth: AuthService, private window: WindowRef) {
    this.dataSource = new MatTableDataSource();
    this.purchase = new Purchase;
    this.user = new User;
    this.updateuser = new User;
    this.paymentplan = new Paymentplan;
    this.products = [
      'uP!',
      'FastTrack Membership',
      'CPM', 
      'uPgrade to FastTrack',
      'uPgrade to EIS',
      'Fasttrack + EIS',
      'Breakthrough',
      'CTD',
      'Coaching Brilliance',
      'WiSH'
    ];
    this.currentpaymentplan = new Paymentplan;
    this.newpayment = new Payment;
    this.newpurchase = new Purchase;
    this.db = db;
    this.participantsCollection = db.collection('Participants', ref => ref.orderBy('firstpurchasedate', "desc"));
    this.purchasesCollection = db.collection('ParticipantPurchases', ref => ref.orderBy('purchasedate', "desc"));
    this.paymentsCollection = db.collection('ParticipantPayments', ref => ref.orderBy('date', "desc"));
    this.paymentplansCollection = db.collection('ParticipantPaymentPlans', ref => ref.orderBy('purchasedate', "desc"));
    this.participants = this.participantsCollection.valueChanges();
    this.passwordCollection=db.collection('defaults',ref =>ref.orderBy('password'));
    this.purchase.product="uP!";
    this.cheque = new Cheque;
    this.participantsCollection.valueChanges().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      console.log(this.dataSource.data);
    });
    
    
    this.defaults = this.db.doc('/defaults/2LzhWT7EuJI6QUKmHil3').valueChanges();
    this.windowref = window;
    this.billingshow = false;
    this.formshow = true;
  }

  ngOnInit() {
    this.editor = new Editor();

  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }


  

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filteredData);
  }

  /*
  filter(){
     
       this.selectedparticipant = this.db.collection('Participants', ref => ref.where('pp_status','==', this.pp_status).orderBy('name'));
       this.selectedparticipant.valueChanges().subscribe(data => {
         this.dataSource.data = data;
         this.dataSource.sort = this.sort; 
       }); 
     
   console.log("this is status",this.pp_status);
  
 }*/

  addcheques(currentparticipant)
  {
    console.log("Adding Cheques");
    this.db.doc('/Participants/'+currentparticipant.participantid).update({
      chequevalue: this.cheque.value,
      chequecount: this.cheque.count
    }).then(res =>{
      console.log("Cheques Added");
      this.cheque = new Cheque;
    });

  }

  clearcheques(currentparticipant)
  {
    console.log("Removing Cheques");
    this.db.doc('/Participants/'+currentparticipant.participantid).update({
      chequevalue: null,
      chequecount: null
    }).then(res =>{
      console.log("Cheques Removed");
    });
  }

  
  
checkpassword(getpwd)
{
  var password;
  this.passwordCollection.valueChanges().subscribe(data=>{
    data.forEach(data=>{
      password=data.password;
      console.log(password);
      console.log(getpwd);
      if(password == getpwd)
      {
        console.log("this is pwd bnt");
        this.bntdisable=false;
      } 
      else{
        console.log("this is false bnt");
        this.bntdisable=true;
      }
    })
  })  
   
}  

  deleteparticipants(getpwd,currentparticipant)
  {
    console.log("this is to delete the record");
    this.db.doc('/Participants/'+currentparticipant.participantid).delete().catch(error => console.log(error));
    this.currentparticipant = false;
        
  }

  addpayment(currentparticipant)
  {
      //const batch1 = this.db.firestore.batch();
      this.db.doc('/Participants/'+currentparticipant.participantid).valueChanges().take(1).subscribe(data => {

      const fee = Math.ceil(this.newpayment.receipt / 1.18);
      const paymentid = this.db.createId();
      const paymentDoc = this.paymentsCollection.doc(paymentid);
      const participantDoc = this.participantsCollection.doc(currentparticipant.participantid);    
      console.log(data);
      var pp_balance = Math.ceil(data['pp_balance'] - fee);
      var pp_installmentsdue = data['pp_installmentsdue'] - 1;
      const batch = this.db.firestore.batch();
       batch.set(paymentDoc.ref,{
        date: this.newpayment.date,
        receipt: this.newpayment.receipt,
        fee: fee,
        gst: this.newpayment.receipt - fee,
        participantid: currentparticipant.participantid,
        id: paymentid
      });
        batch.update(participantDoc.ref, {
          pp_balance: pp_balance,
          pp_installmentsdue: pp_installmentsdue,
          pp_lastpayment: this.newpayment.date
        });
        this.newpayment = new Payment;
        return batch.commit();

    });
  console.log("Added Payment");

  }

  
  /*sendinvoice(payment,participantdetails,templateid)
{
  console.log("this is new sendinvoice");
  this.db.doc('/Invoice/'+payment.id).set({
    name:participantdetails.name,
    product:participantdetails.recentpurchase,
    purchasedate:participantdetails.firstpurchasedate,
    email:payment.email,
    fee:payment.fee,
    receipt:payment.receipt,
    gst:payment.gst,
    invoiceid:payment.invoiceid,
    participantid:payment.participantid,
    templateid:templateid,
    id:payment.id
  })
}
*/

invoice(payment,participantdetails,templateid){
  console.log("this is new sendinvoice");
  var time=Date.now();
  console.log(time);
if(participantdetails.billingemail==null){
  console.log("this is email invoice");
  this.db.doc('/Invoice/'+payment.id).set({
    name:participantdetails.name,
    billingaddress:participantdetails.billingaddress,
    product:participantdetails.recentpurchase,
    purchasedate:participantdetails.firstpurchasedate,
    email:payment.email,
    date:payment.date,
    fee:payment.fee,
    receipt:payment.receipt,
    gst:payment.gst,
    invoiceid:payment.invoiceid,
    participantid:payment.participantid,
    templateid:templateid,
    timestamp:time,
    id:payment.id

  })
 
}
else{
  console.log("this is billing invoice");
  this.db.doc('/Invoice/'+payment.id).set({
    name:participantdetails.name,
    billingaddress:participantdetails.billingaddress,
    product:participantdetails.recentpurchase,
    purchasedate:participantdetails.firstpurchasedate,
    email:participantdetails.billingemail,
    date:payment.date,
    fee:payment.fee,
    receipt:payment.receipt,
    gst:payment.gst,
    invoiceid:payment.invoiceid,
    participantid:payment.participantid,
    templateid:templateid,
    timestamp:time,
    id:payment.id
  })
}
 console.log(participantdetails.billingemail);
 console.log(this.updateuser.billingemail);
}


addremarks(remarks,currentparticipant)
  {
    this.db.doc('/Participants/'+currentparticipant.participantid).update({
    Remarks:remarks
    })
      console.log("comment added");
      console.log(remarks);
  }
 
  showfulldetails(participant)
  {
     console.log('Window object', this.windowref.nativeWindow);
     this.windowref.nativeWindow.open("/participant/"+participant.id, "_blank");

}

  showparticipant(participant)
  {
    
    this.updateuser.firstname=null;
    this.updateuser.lastname =null;
    this.updateuser.email = null;
    this.updateuser.phone = null;
    this.updateuser.billingemail=null;
    this.updateuser.billingaddress="";
     
    const paymentplandocurl = '/ParticipantPaymentPlans/'+participant.id;
    console.log(paymentplandocurl);
    this.currentparticipant = {
      participantid: participant.id,
      participant: this.db.doc('/Participants/'+participant.id).valueChanges(),
      purchases: this.db.collection('ParticipantPurchases', ref => ref.where('participantid', '==', participant.id)).valueChanges(),
      payments: this.db.collection('ParticipantPayments', ref => ref.where('participantid', '==', participant.id).orderBy('date', "desc")).valueChanges(),
      //paymentplan: this.db.doc(paymentplandocurl).valueChanges()
    };
    console.log(this.currentparticipant);
  }

  edituser(participantdetails)
  {
    
    console.log("Showing the edit user panel");
    console.log(participantdetails);
    this.updateuser.firstname = participantdetails.firstname;
    this.updateuser.lastname = participantdetails.lastname;
    this.updateuser.email = participantdetails.email;
    this.updateuser.phone = participantdetails.phone;
    this.updateuser.billingaddress=participantdetails.billingaddress;
    this.updateuser.billingemail=participantdetails.billingemail;
console.log("billing add:" ,this.updateuser.billingaddress);
console.log("billing email: " ,this.updateuser.billingemail);
    if(participantdetails.billingaddress)
    {
    this.updateuser.billingaddress = participantdetails.billingaddress;
    }
    if(participantdetails.billingemail){

      this.updateuser.billingemail=participantdetails.billingemail;
    }
  }

  Editemi(participantdetails){
    console.log("this is in editemi");
    this.pp_installmentamount=participantdetails.pp_installmentamount;
  }
  
  updateemi(currentparticipant){
    this.db.doc('/Participants/'+currentparticipant.participantid).update({
     pp_installmentamount:this.pp_installmentamount
    });
    console.log(this.pp_installmentamount);
  }

  updateparticipant(currentparticipant)
  {
    console.log("updating the user");
    if(this.updateuser.billingaddress)
    {


    this.db.doc('/Participants/'+currentparticipant.participantid).update({
      firstname: this.updateuser.firstname,
      lastname: this.updateuser.lastname,
      email: this.updateuser.email,
      phone: this.updateuser.phone,
      name: this.updateuser.firstname + " " + this.updateuser.lastname,
      billingaddress: this.updateuser.billingaddress,
      billingemail:this.updateuser.billingemail
    }).then(res =>{
      console.log("User details updated");
      this.updateuser = new User;
      this.updateuser.billingaddress="";
    });
  }
  else {
    this.db.doc('/Participants/'+currentparticipant.participantid).update({
      firstname: this.updateuser.firstname,
      lastname: this.updateuser.lastname,
      email: this.updateuser.email,
      phone: this.updateuser.phone,
      name: this.updateuser.firstname + " " + this.updateuser.lastname,
      billingemail:this.updateuser.billingemail,
    }).then(res =>{
      console.log("User details updated");
      this.updateuser = new User;
      this.updateuser.billingaddress="";
    });
  }

  }

testdata()
{
  this.user.lastname = "testee";
  this.user.email = "rmtestee@example.com";
  this.user.phone = 99999999 ;
  this.purchase.product = this.products[0].toString();
  //this.purchase.purchasedate = "2018-10-01";
  this.purchase.fee = 475000;
  this.paymentplan.initialpayment = 100000;
  this.paymentplan.installmentamount = 200000;
  this.paymentplan.paymentday = 2;

}
  async newparticipant(fluid) {

    console.log("Adding New Participant");
    const batch = this.db.firestore.batch();
    const participantid = this.db.createId();
    const particpantDoc = this.participantsCollection.doc(participantid);
    const feespaid = Math.ceil(this.paymentplan.initialpayment/1.18);
    var pp_status = "Active PaymentPlan";
    if(this.paymentplan.installmentamount < 0)
    {
      this.paymentplan.installmentamount = 0;
      pp_status = "Missing PP";
    }
    if(this.paymentplan.paymentday < 0)
    {
      this.paymentplan.paymentday = 0;
    }
    if(this.user.billingaddress)
    {
    batch.set(particpantDoc.ref, { 
      id: participantid,
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      name:this.user.firstname + " " + this.user.lastname,
      email: this.user.email,
      phone: this.user.phone,
      firstpurchasedate: this.purchase.purchasedate,
      recentpurchase: this.purchase.product,
      pp_totalpurchasevalue: this.purchase.fee,
      pp_totalpaid: feespaid,
      pp_balance: this.purchase.fee - feespaid,
      pp_frequency: "monthly",
      pp_installmentamount: this.paymentplan.installmentamount,
      pp_installmentspaid: 0,
      pp_paymentday: this.paymentplan.paymentday,
      pp_lastpayment: this.purchase.purchasedate,
      pp_installmentsdue: Math.ceil((this.purchase.fee - feespaid) / (this.paymentplan.installmentamount / 1.18)),
      pp_status: pp_status,
      billingaddress: this.user.billingaddress,
      
    });
    }
    else {
      batch.set(particpantDoc.ref, {
        id: participantid,
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        name:this.user.firstname + " " + this.user.lastname,
        email: this.user.email,
        phone: this.user.phone,
        firstpurchasedate: this.purchase.purchasedate,
        recentpurchase: this.purchase.product,
        pp_totalpurchasevalue: this.purchase.fee,
        pp_totalpaid: feespaid,
        pp_balance: this.purchase.fee - feespaid,
        pp_frequency: "monthly",
        pp_installmentamount: this.paymentplan.installmentamount,
        pp_installmentspaid: 0,
        pp_paymentday: this.paymentplan.paymentday,
        pp_lastpayment: this.purchase.purchasedate,
        pp_installmentsdue: Math.ceil((this.purchase.fee - feespaid) / (this.paymentplan.installmentamount / 1.18)),
        pp_status: pp_status
        });
    }

      //Add Purchase
      const purchaseid = this.db.createId();
      const purchaseDoc = this.purchasesCollection.doc(purchaseid);
      batch.set(purchaseDoc.ref, {
      participantid: participantid,
      fee: this.purchase.fee,
      gst: Math.ceil(this.purchase.fee * .18),
      gross: this.purchase.fee * 1.18,
      initialpayment: this.paymentplan.initialpayment,
      product: this.purchase.product,
      purchasedate: this.purchase.purchasedate,
      id: purchaseid
      });
      console.log("Added Purchase");
       //Add Payment
      const paymentid = this.db.createId();
      const paymentDoc = this.paymentsCollection.doc(paymentid);
      batch.set(paymentDoc.ref, {
         date: this.purchase.purchasedate,
         receipt: this.paymentplan.initialpayment,
         fee: feespaid,
         gst: this.paymentplan.initialpayment - feespaid,
         participantid: participantid,
         id:paymentid,
         fluid: fluid
         });
      console.log("Added Payment");
      await batch.commit();
      this.paymentplan = new Paymentplan();
      this.purchase = new Purchase();
      this.user = new User();
  }

  addpurchase(currentparticipant) {

    const batch = this.db.firestore.batch();
    //Add Purchase
    const purchaseid = this.db.createId();
    const purchaseDoc = this.purchasesCollection.doc(purchaseid);
    batch.set(purchaseDoc.ref,{ 
    participantid:  currentparticipant.participantid,
    fee: this.newpurchase.fee,
    gst: Math.ceil(this.newpurchase.fee * .18),
    gross: this.newpurchase.fee * 1.18,
    initialpayment: this.newpurchase.initialpayment,
    product: this.newpurchase.product,
    purchasedate: this.newpurchase.purchasedate,
    id: purchaseid
     });
    console.log("Added New Purchase");
    const paymentid = this.db.createId();
    const paymentDoc = this.paymentsCollection.doc(paymentid);
    batch.set(paymentDoc.ref, {
       date: this.newpurchase.purchasedate,
       receipt: this.newpurchase.initialpayment,
       fee: Math.ceil(this.newpurchase.initialpayment/1.18),
       gst: this.newpurchase.initialpayment - Math.ceil(this.newpurchase.initialpayment/1.18),
       participantid: currentparticipant.participantid,
       id:paymentid
       });
    console.log("Added Payment");
    this.newpurchase = new Purchase;
    return batch.commit()

  }

  deletepurchase(purchase)
  {
    if(confirm("Are you sure want to delete purchase")){
    console.log("Deleting purchase:"+purchase.id);
    this.db.doc('/ParticipantPurchases/'+purchase.id).delete().catch(error => console.log(error));
  }
  }
  deletepayment(payment)
  {
    if(confirm("Are you sure want to delete payment")){
    console.log("Deleting Payment:"+payment.id);
    this.db.doc('/ParticipantPayments/'+payment.id).delete().catch(error => console.log(error));
  }
}

  totalpurchasevalue()
  {
    return this.dataSource.filteredData.reduce(function (a, c) {
    return a + c.pp_totalpurchasevalue;
  }, 0)
  }

  totalbalance()
  {
    return this.dataSource.filteredData.reduce(function (a, c) {
    return a + c.pp_balance;
  }, 0)
  }

  totalpaid()
  {
    return this.dataSource.filteredData.reduce(function (a, c) {
    return a + c.pp_totalpaid;
  }, 0)
  }

  emitotal()
  {
    return this.dataSource.filteredData.reduce(function (a, c) {
    return a + c.pp_installmentamount;
  }, 0)
  }

  ExportCSV()
  {
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Watsondataexport.csv');

  }

  update_ppstatus(currentparticipant)
  {
    console.log("Chaging PP_Status");
   this.db.doc('/Participants/'+currentparticipant.participantid).update({
      pp_status: this.pp_status
    }).then(res =>{
      console.log("PP Status Changed");
    });

  }
  togglebilling()
  {
    
    console.log("Toggle GST Billing");
    if(this.billingshow)
    {
      this.billingshow = false;
      
    }
    else {
      this.billingshow = true;
     
    }
  }

togglebilling1()
  {
    
    
    console.log("Toggle GST Billing1");
    if(this.billingshow1)
    {
       this.billingshow1 = false;
       this.updateuser.billingaddress="";
    }
    else {
      this.billingshow1 = true;
      this.updateuser.billingaddress="";
    }
  }
  showform()
  {
    console.log("Toggle Form View");
    if(this.formshow)
    {
      this.formshow = false;
    }
    else {
      this.formshow = true;
    }
  }

}

