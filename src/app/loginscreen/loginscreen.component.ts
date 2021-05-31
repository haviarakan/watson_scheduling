import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute} from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import {AngularFireAuth}from '@angular/fire/auth';
import { Observable, interval} from 'rxjs';
import { WindowRef} from '../WindowRef';
import firebase from 'firebase/app';

import { WindowService } from '../window.service';
import { DomSanitizer ,SafeUrl} from '@angular/platform-browser';
import { NumberFormatStyle } from '@angular/common';
import { PhoneNumber } from '../tokengenerator/phone';
import 'firebase/auth';

@Component({
  selector: 'app-loginscreen',
  templateUrl: './loginscreen.component.html',
  styleUrls: ['./loginscreen.component.css']
})
export class LoginscreenComponent implements OnInit {
  private router: Router;
  private db: AngularFirestore;
  verificationCode:string;
  phoneNumber = new PhoneNumber();
  windowRef:any;
  number:number;
  time:number=300;
  loggedin:boolean=true;
  recaptchaVerifier;
  interval;
  participantsCollection: AngularFirestoreCollection;
  participants:Observable<any>;
  Url:SafeUrl;
 sanitizer:DomSanitizer;
 docexist:boolean=false;
 userexist:boolean=false;
 resendbtn:boolean=false;
 internum:boolean=false;
 send:boolean=false;
 hideentry:boolean=true;
 verify:boolean=false;
 mobileoption:boolean=true;
 emailoption:boolean=false;
 Error;
 email;
 emailsent;
 mobileversion;
 requestOTP_btn:boolean=false;
 add:boolean=false;
 errormessage:string;
 user:Observable<any>;
num:string;
phone:string;
countrycode;
  afAuth: any;

  constructor(db: AngularFirestore, router: Router,private win:WindowService,sanitizer:DomSanitizer) { 
    this.router = router;
  this.db = db;
  this.verificationCode;
  this.sanitizer=sanitizer;
  this.db.doc('/defaults/webinar').valueChanges().subscribe(data=>{
    this.Url=this.sanitizer.bypassSecurityTrustResourceUrl(data['link']);
  
    console.log(this.Url);
    this.Error=data['errormsg'];
    console.log(this.Error);
  })

  if(firebase.auth().isSignInWithEmailLink(window.location.href)) {
    var email=window.localStorage.getItem('emailForSignIn');
           console.log(email);
          this.userexist=true;
          this.hideentry=false;
   

  }
 
   }


  ngOnInit() {
    this.recaptchaVerifier= new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
    });
    this.sendotp();
    this.user=this.afAuth.authState;
    var url=this.Url;
   
  }
  
 
sendemail(){

console.log(this.email);
this.email= this.email.toLowerCase();
console.log("lowercase email",this.email);
this.participantsCollection=this.db.collection('Participants',ref=>ref.where('email','==',this.email).where('eit_status','==','started'));
console.log("testing1");
this.participantsCollection.valueChanges().subscribe(snapshot=> {
  console.log("testing inside query");
  if(snapshot.length==0){
  this.docexist=true;
    console.log("inside if");
  }
  else{
    var mailid=this.email;
    var actionCodeSettings={
      handleCodeInApp:true,
      url:window.location.href,
    };
    
    console.log("this is inside the condition");
      firebase.auth().sendSignInLinkToEmail(mailid, actionCodeSettings)
      .then(function(){
        window.localStorage.setItem('emailForSignIn', mailid);
        this.emailsent=true;
      })
         .catch(function(err){
          this.errormessage=err.message;
         }) ; 
      
           
    console.log("inseide else");
  }
})
      }


confirmSignIn(url){
  if(this.afAuth.isSignInWithEmailLink(window.location.href)){
      var email=window.localStorage.getItem('emailForSignIn');
      if(!email){
        email=window.prompt('please Provide your email for confirmation');
      }
      firebase.auth().signInWithEmailLink(email,window.location.href)
      .then(function(result){
        
      })     
  .catch(function(err){
    this.errormessage=err.message;
  })
     
  }
}

addcountrycode(){
this.add=true;
  console.log(this.number);
    let number=this.number;
    console.log(number);
     this.phone=number.toString();
  if(this.phone.length==10){
   this.num = "+91"+this.phone;
   console.log(this.num);
 }
 else{
   this.internum=true;
   this.num=this.phone;
   console.log(this.countrycode);
 this.num=this.countrycode+this.phone;
console.log(this.num);
 }
  
  
}
  sendotp(){
 
    var appVerifier =this.recaptchaVerifier;
    var phonenum;
    this.verify=true;
    this.send=true;
    phonenum =this.num;
var provider =new firebase.auth.PhoneAuthProvider();
provider.verifyPhoneNumber(phonenum,appVerifier).then(result => {
            this.recaptchaVerifier.confirmationResult = result;
            console.log("the sms is sent");
        })
        .catch( error => console.log(error));

        this.interval = setInterval(()=>{
          if(this.time>0){
            this.time--;
          
          }
          else{
            console.log("OTP got EXpiered");
            
           }
         },1000)
        
  }

verifycode(){
  if(this.time>0){
    let signInCredential = firebase.auth.PhoneAuthProvider.credential(this.recaptchaVerifier.confirmationResult,this.verificationCode);
    firebase.auth().signInWithCredential(signInCredential).then((info)=>{
      console.log(info);
      console.log("logged in successfully"); 
      this.loggedin=false;
        this.participantsCollection=this.db.collection('Participants',ref=>ref.where('phone','==',this.number).where('eit_status','==','started').orderBy('name'));
        this.participantsCollection.valueChanges().subscribe(snapshot=> {
          console.log(" Login sucess testing");
            if(snapshot.length==0){
              this.docexist=true;
              this.hideentry=false;
              console.log("inside if");
            }
            else{
              this.userexist=true;
              this.hideentry=false;
              console.log("inseide else");
            }
    
         })
    }),(error)=>{
  
      console.log(error,"Incorrect Code Entered?");
    }
   }
    else if(this.resendbtn==false){
  console.log("Resend button  verification");
  let signInCredential = firebase.auth.PhoneAuthProvider.credential(this.windowRef.confirmationResult,this.verificationCode);
  firebase.auth().signInWithCredential(signInCredential).then((info)=>{
    console.log(info);
    console.log("logged in successfully");
   this.loggedin=false;
   this.participantsCollection=this.db.collection('Participants',ref=>ref.where('phone','==',this.number).where('eit_status','==','started').orderBy('name'));
        this.participantsCollection.valueChanges().subscribe(snapshot=> {
          console.log("else if testing");
          if(snapshot.length>0){
            this.userexist=true;
            this.hideentry=false;
          }
          else{
            this.docexist=true;
            this.hideentry=false;
          }
    
         })
  }),(error)=>{
    console.log(error,"Incorrect Code Entered?");
  }
}
else{
  console.log("OTP got EXpiered");
  
 }

}

resendcode(){ 
  this.send=true;
  const appVerifier = this.recaptchaVerifier;
  String(this.number)
  const num = "+91" + this.number;
  var provider =new firebase.auth.PhoneAuthProvider();
  provider.verifyPhoneNumber(num,appVerifier).then(res=>{
    console.log("sms send");
    this.windowRef.confirmationResult = res;  
    }),(error)=>{
      console.log(error);
    }
}




}