import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, interval} from 'rxjs';
import { WindowRef} from '../WindowRef';
import firebase from 'firebase/app';
import { PhoneNumber } from './phone';
import { sign } from 'jsonwebtoken';
import { WindowService } from '../window.service';
import "firebase/firestore";
import "firebase/auth";
     

firebase.initializeApp({
  apiKey: "AIzaSyAWSXDNAlnrmk4g8own2z_ojyBPQ_NNqZg",
  authDomain: "watsonproduction-becde.firebaseapp.com",
  databaseURL: "https://watsonproduction-becde.firebaseio.com",
  projectId: "watsonproduction-becde",
  storageBucket: "watsonproduction-becde.appspot.com",
  messagingSenderId: "155851178064"
}
);

@Component({
  selector: 'app-tokengenerator',
  templateUrl: './tokengenerator.component.html',
  styleUrls: ['./tokengenerator.component.css']
})

export class TokengeneratorComponent implements OnInit {
  cities:Array<string>;
  db: AngularFirestore;
  participantsCollection: AngularFirestoreCollection;
  participants:Observable<any>;
  participantDoc:AngularFirestoreDocument;
  TokenCollection:AngularFirestoreCollection;
  cityCollection:AngularFirestoreCollection;
  defaultsCollection:AngularFirestoreCollection;
  defaults:Observable<any>;
  selectedcity='Online';
  selectedtype;
  type:Array<string>;
  token;
  status;
  mail;
  participantid;
  consultation_taken;
  review_taken;
  Totalconsultation;
  TotalReview;
  validty;
  email;
  number;
  firstname;
  name;
  online;
  chennai;
  mumbai;
  delhi;
  windowRef:any;
  verificationCode:string;
  phoneNumber = new PhoneNumber()
  interval;
  sendbtn:boolean=false;
  resendbtn:boolean=false;
  loggedin:boolean=true;
  screen1:boolean=true;
  time:number=300;
  selectedvalue;
  note1;
  note2;
  Subscription;
  ConsultationSummary;
  emailid;
  data;
  emails;
  mobileversion;
  requestOTP_btn:boolean=false;
  otpDiv:boolean=false;
  mailerror:boolean=false;
  screen3:boolean=false;
  link:boolean=false;
  internumber:boolean=false;
  countrycode;
  emaillable;
  otplable;
  question1;
  question2;
  btntype;
  num:String;
  phone:String;
  emaillink;
   constructor(db: AngularFirestore , private route:ActivatedRoute,private win:WindowService) { 
    this.db=db;
    this.verificationCode;
    this.selectedtype;
     this.selectedcity;
     this.defaultsCollection = db.collection('defaults', ref => ref.orderBy("desc"));
     this.participantsCollection = db.collection('Participants', ref => ref.orderBy('firstpurchasedate', "desc"));
     this.participants = this.participantsCollection.valueChanges();
     

      this.db.doc('/defaults/token').valueChanges().subscribe(data=>{
        this.cities=data['cities'];
        this.type=data['type'];
        this.note1=data['please note1'];
        this.note2=data['please note2'];
        this.Subscription=data['Subscription Summary'];
        this.ConsultationSummary=data['Consultation Summar'];
        this.emaillable=data['emaillable'];
        this.otplable=data['optlable'];
        this.question1=data['question1'];
        this.question2=data['question2'];
        this.emaillink=data['emaillink'];
        console.log(this.question1);
        console.log(this.question2);
        console.log(this.emaillable);
        console.log(this.otplable);
        console.log(this.type);
        console.log(this.cities);
        console.log(this.note1);
        console.log(this.note2);
        console.log(this.Subscription);
        console.log(this.ConsultationSummary);
        })

        if(firebase.auth().isSignInWithEmailLink(window.location.href)) {
          this.screen1=false;
          var email=window.localStorage.getItem('emailForSignIn');
           console.log(email);
           this.emailid = email.toLowerCase();
           console.log(this.emailid);
           this.participantsCollection=this.db.collection('Participants',ref=>ref.where('email','==',this.emailid).orderBy('name'));
           this.participantsCollection.valueChanges().subscribe(snapshot=> {
            snapshot.forEach(data=>{
               this.name=data.name;
               this.email=data.email;
               this.participantid= data.id;
            })
          })
          this.TokenCollection = this.db.collection('Token', ref => ref.where('email','==',this.emailid));
          this.TokenCollection.valueChanges().subscribe(data=>{
            if(data.length==0){
              this.requestOTP_btn=true;
            }
            else{
              this.screen1=false;
              this.screen3=true;
              data.forEach(data=>{
                this.token = data.tokennumber;
                this.status=data.status;
                this.selectedtype =data.type;
                this.selectedcity = data.city;
               })
            }
          })
      
      }



        /*
        this.db.doc('/defaults/token').valueChanges().subscribe(data=>{
          this.type=data['type'];
          console.log(this.type);
          })*/
     /*
  this.TokenCollection = this.db.collection('Token', ref => ref.where('email','==',this.email).orderBy("name"));
  this.TokenCollection.valueChanges().subscribe(data=>{
    
     data.forEach(data=>{
     this.token = data.tokennumber;
     this.status=data.status;
     this.selectedtype =data.type;
     this.selectedcity = data.city;
    })
   })
   */
  }



  ngOnInit() {
    console.log(window.innerWidth)
    if(window.innerWidth < 768){
      this.mobileversion = true
    }
    else{
      this.mobileversion = false
    }
    this.windowRef = this.win.windowRef;
  }

  submitemail(){
    console.log("input email",this.email)
   this.emailid= this.email.toLowerCase();
    console.log("lowercase email",this.emailid);
    this.participantsCollection=this.db.collection('Participants',ref=>ref.where('email','==',this.emailid).orderBy('name'));
      this.participantsCollection.valueChanges().subscribe(snapshot=> {
        if(snapshot.length==0){
          this.mailerror=true;
          this.requestOTP_btn=false;
        } 
        else{
          snapshot.forEach(data=>{
            console.log("the email exsits");
            this.participantid=data.id;
            this.firstname=data.firstname;
              this.name=data.name;
              this.number=data.phone;
              this.mail=data.email;
              this.participantid= data.id;
              console.log(this.participantid);
              console.log(this.mail);
              console.log(this.number);
              console.log(this.name);             
          })
          let number=this.number;
console.log(number);
   this.phone=number.toString();
console.log(number.toString());

if(this.phone.length==10){
  this.num = "+91"+this.phone;
 console.log(this.num);
}
else{
  console.log(this.phone);
this.internumber=true;

}
         this.mailerror=false;
      this.TokenCollection = this.db.collection('Token', ref => ref.where('email','==',this.email).orderBy("name"));
  this.TokenCollection.valueChanges().subscribe(data=>{
    if(data.length==0){
      this.requestOTP_btn=true;
    }
    else{
      this.screen1=false;
      this.screen3=true;
      data.forEach(data=>{
        this.token = data.tokennumber;
        this.status=data.status;
        this.selectedtype =data.type;
        this.selectedcity = data.city;
       })
    }
  })
  }
  })
  }

  sendemail(email){
    console.log(email);
    
   console.log(this.email);
  this.btntype="email";
       
    var actionCodeSettings={
      handleCodeInApp:true,
      url:window.location.href,
    };
      firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
      .then(function(){
        window.localStorage.setItem('emailForSignIn', email);
        
      }).catch(function(err){
          console.log(err);
         }); 
         this.otpDiv=true; 
          
  }

  addcountrycode(){
 console.log(this.phone);
    console.log(this.countrycode);
 this.num=this.countrycode+this.phone;
console.log(this.num);
  }

 sendcode(){
this.btntype="mobile";
console.log("code function");  
this.otpDiv=true;

var appVerifier = new firebase.auth.RecaptchaVerifier('sendcode',{
  'size':'invisible',
});

var phonenum;
phonenum=this.num;
/*var phonenum;
phonenum=this.countrycode+this.num;*/
 var provider = new firebase.auth.PhoneAuthProvider();
provider.verifyPhoneNumber(phonenum,appVerifier).then(result => {
            this.windowRef.confirmationResult = result;
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
        let signInCredential = firebase.auth.PhoneAuthProvider.credential(this.windowRef.confirmationResult,this.verificationCode);
        firebase.auth().signInWithCredential(signInCredential).then((info)=>{
          console.log(info);
          console.log("logged in successfully");
          this.screen1=false;
    
         //location.reload();
        }),(error)=>{
          console.log(error,"Incorrect Code Entered?");
          alert("Incorrect Code Entered");
        }
      }
      else if(this.resendbtn==false){
        console.log("Resend button  verification");
        let signInCredential = firebase.auth.PhoneAuthProvider.credential(this.windowRef.confirmationResult,this.verificationCode);
        firebase.auth().signInWithCredential(signInCredential).then((info)=>{
          console.log(info);
          console.log("logged in successfully");
         this.loggedin=false;
         this.screen1=false;
    
        }),(error)=>{
          console.log(error,"Incorrect Code Entered?");
        }
      }
    
      else{
        console.log("OTP got EXpiered");
        
       }
    
    }

  resendcode(){ 
    
      const appVerifier =  new firebase.auth.RecaptchaVerifier('sendcode',{
        'size':'invisible',
      });
      var phonenum;
      phonenum=this.num;
      
      var provider = new firebase.auth.PhoneAuthProvider();
      provider.verifyPhoneNumber(phonenum,appVerifier).then(res=>{
        console.log("sms send");
        this.windowRef.confirmationResult = res;  
        }),(error)=>{
          console.log(error);
        }
    }

    
selecttype(){
 console.log(this.selectedtype);

}

  selectcity(){
   console.log(this.selectedcity);
   this.selectedvalue=this.selectedcity+this.selectedtype;
   console.log(this.selectedvalue);
       }

/*
  generatetoken(){
    var cnt=0;
    console.log(this.selectedtype);
    var cnt=0;
    console.log(this.selectedtype);
    if(this.selectedcity == 'Online'){
      this.db.collection('/defaults').doc('city').valueChanges().take(1).subscribe(data =>{ 
          this.online = data['online'];
          console.log(this.online);
      cnt=this.online+1;
        console.log("this is to check"); 
        this.token = cnt;
        console.log(this.token);
      console.log(cnt);
          
  this.db.collection('/defaults').doc('city').update({
    online:cnt
  })
  console.log("this is after update");
  console.log('this is for token generation');     
  const tokenid = this.db.createId();
  this.db.doc('/Token/'+tokenid).set({
     name:this.name,
     email:this.email,
     tokennumber:this.token,
     type:this.selectedtype,
     currentstage:"Requested",
     city:this.selectedcity,
     quicknotes:"test",
     people_involved:"Joshua Samuel",
     participantid:this.participantid,
     status:"Requested",
     id:tokenid,   
     total_consultations:this.Totalconsultation,
     total_Review:this.TotalReview,
     consultation_taken:this.consultation_taken,
     review_taken:this.review_taken,
     validty:this.validty
 })
 console.log("the token document is updated");
    })
}
    if(this.selectedcity == 'Chennai'){
    this.db.collection('/defaults').doc('city').valueChanges().take(1).subscribe(data =>{ 
        this.chennai = data['chennai'];
        console.log(this.chennai);
    cnt=this.chennai+1;
      console.log("this is to check"); 
      this.token = cnt;
      console.log(this.token);
    console.log(cnt);
        
this.db.collection('/defaults').doc('city').update({
  chennai:cnt
})
console.log("this is after update");
  console.log('this is for token generation');     
  const tokenid = this.db.createId();
  this.db.doc('/Token/'+tokenid).set({
     name:this.name,
     email:this.email,
     tokennumber:this.token,
     type:this.selectedtype,
     currentstage:"Requested",
     city:this.selectedcity,
     quicknotes:"test",
     people_involved:"Joshua Samuel",
     participantid:this.participantid,
     status:"Requested",
     id:tokenid,   
     total_consultations:this.Totalconsultation,
     total_Review:this.TotalReview,
     consultation_taken:this.consultation_taken,
     review_taken:this.review_taken,
     validty:this.validty
 })
 console.log("the token document is updated");
    })
}

if(this.selectedcity == 'Mumbai'){
  this.db.collection('/defaults').doc('city').valueChanges().take(1).subscribe(data =>{ 
      this.mumbai = data['mumbai'];
      console.log(this.mumbai);
  cnt=this.mumbai+1;
    console.log("this is to check"); 
    this.token =  cnt;
    console.log(this.token);
  console.log(cnt);
      
this.db.collection('/defaults').doc('city').update({
mumbai:cnt
})
console.log("this is after mumbai update");


console.log('this is for token generation');     
const tokenid = this.db.createId();
this.db.doc('/Token/'+tokenid).set({
   name:this.name,
   email:this.email,
   tokennumber:this.token,
   type:this.selectedtype,
   currentstage:"Requested",
   city:this.selectedcity,
   quicknotes:"test",
   people_involved:"Joshua Samuel",
   participantid:this.participantid,
   status:"Requested",
   id:tokenid,   
   total_consultations:this.Totalconsultation,
   total_Review:this.TotalReview,
   consultation_taken:this.consultation_taken,
   review_taken:this.review_taken,
   validty:this.validty
})
console.log("the token document is updated");
  })
}
if(this.selectedcity == 'Delhi'){
  this.db.collection('/defaults').doc('city').valueChanges().take(1).subscribe(data =>{ 
      this.delhi = data['delhi'];
      console.log(this.delhi);
  cnt=this.delhi+1;
    console.log("this is to check"); 
    this.token = cnt;
    console.log(this.token);
  console.log(cnt);
      
this.db.collection('/defaults').doc('city').update({
delhi:cnt
})
console.log("this is after delhi update");


console.log('this is for token generation');     
const tokenid = this.db.createId();
this.db.doc('/Token/'+tokenid).set({
   name:this.name,
   email:this.email,
   tokennumber:this.token,
   type:this.selectedtype,
   currentstage:"Requested",
   city:this.selectedcity,
   quicknotes:"test",
   people_involved:"Joshua Samuel",
   participantid:this.participantid,
   status:"Requested",
     id:tokenid,   
     total_consultations:this.Totalconsultation,
     total_Review:this.TotalReview,
     consultation_taken:this.consultation_taken,
     review_taken:this.review_taken,
     validty:this.validty
    })
console.log("the token document is updated");
  })
}   
  } 
*/
  generatetoken1(email){
    console.log(email);
    this.screen3=true;
    var cnt=0;
    console.log(this.selectedtype);
    if(this.selectedcity =='Online'){
      this.db.collection('/defaults').doc('city').valueChanges().take(1).subscribe(data =>{ 
          this.online = data['online'];
          console.log(this.online);
      cnt=this.online+1;
        console.log("this is to check"); 
        this.token = cnt;
        console.log(this.token);
      console.log(cnt);
          
  this.db.collection('/defaults').doc('city').update({
    online:cnt
  })
  
  console.log("this is after update");
    console.log('this is for token generation');     
    const tokenid = this.db.createId();
    this.db.doc('/Token/'+tokenid).set({
       name:this.name,                                                            
       email:this.email,
       tokennumber:this.token,
       type:this.selectedtype,
       city:this.selectedcity,
       currentstage:"Requested",
       quicknotes:" ",
       people_involved:" ",
       nextstage:"Don't come to venue",
       participantid:this.participantid,
       status:"Requested",
       id:tokenid,   
       exception:1
   })
   
   console.log("the token document is updated");
      })
  }
    if(this.selectedcity == 'Chennai'){
    this.db.collection('/defaults').doc('city').valueChanges().take(1).subscribe(data =>{ 
        this.chennai = data['chennai'];
        console.log(this.chennai);
    cnt=this.chennai+1;
      console.log("this is to check"); 
      this.token = cnt;
      console.log(this.token);
    console.log(cnt);
        
this.db.collection('/defaults').doc('city').update({
  chennai:cnt
})

console.log("this is after update");
  console.log('this is for token generation');     
  const tokenid = this.db.createId();
  this.db.doc('/Token/'+tokenid).set({
     name:this.name,
     email:this.email,
     tokennumber:this.token,
     type:this.selectedtype,
     city:this.selectedcity,
     currentstage:"Requested",
     quicknotes:" ",
     people_involved:" ",
     nextstage:"Don't come to venue",
     participantid:this.participantid,
     status:"Requested",
     id:tokenid,   
     exception:1
 })
 console.log("the token document is updated");
    })
}

if(this.selectedcity == 'Mumbai'){
  this.db.collection('/defaults').doc('city').valueChanges().take(1).subscribe(data =>{ 
      this.mumbai = data['mumbai'];
      console.log(this.mumbai);
  cnt=this.mumbai+1;
    console.log("this is to check"); 
    this.token =  cnt;
    console.log(this.token);
  console.log(cnt);
      
this.db.collection('/defaults').doc('city').update({
mumbai:cnt
})
console.log("this is after mumbai update");

console.log("this is after update");
  console.log('this is for token generation');     
  const tokenid = this.db.createId();
  this.db.doc('/Token/'+tokenid).set({
     name:this.name,
     email:this.email,
     tokennumber:this.token,
     type:this.selectedtype,
     city:this.selectedcity,
     currentstage:"Requested",
     quicknotes:" ",
     people_involved:" ",
     nextstage:"Don't come to venue",
     participantid:this.participantid,
     status:"Requested",
     id:tokenid,   
     exception:1
 })
console.log("the token document is updated");
  })
}

if(this.selectedcity == 'Delhi'){
  this.db.collection('/defaults').doc('city').valueChanges().take(1).subscribe(data =>{ 
      this.delhi = data['delhi'];
      console.log(this.delhi);
  cnt=this.delhi+1;
    console.log("this is to check"); 
    this.token = cnt;
    console.log(this.token);
  console.log(cnt);
      
this.db.collection('/defaults').doc('city').update({
delhi:cnt
})
console.log("this is after delhi update");

console.log("this is after update");
  console.log('this is for token generation');     
  const tokenid = this.db.createId();
  this.db.doc('/Token/'+tokenid).set({
     name:this.name,
     email:this.email,
     tokennumber:this.token,
     type:this.selectedtype,
     city:this.selectedcity,
     currentstage:"Requested",
     quicknotes:" ",
     people_involved:" ",
     nextstage:"Don't come to venue",
     participantid:this.participantid,
     status:"Requested",
     id:tokenid,   
     exception:1
 })
console.log("the token document is updated");
  })
}   
  }

}
    