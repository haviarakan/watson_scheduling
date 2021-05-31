import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router} from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable} from 'rxjs';
import { forms } from './form';
import { FormGroup, FormControl } from '@angular/forms'

@Component({
  selector: 'app-confirmationform',
  templateUrl: './confirmationform.component.html',
  styleUrls: ['./confirmationform.component.css']
})
export class ConfirmationformComponent implements OnInit {
  db: AngularFirestore;
  participantsCollection: AngularFirestoreCollection;
  participants:Observable<any>;
  participantDoc:AngularFirestoreDocument;
  FormCollection:AngularFirestoreCollection;
  FormTokenCollection:AngularFirestoreCollection;
  cityCollection:AngularFirestoreCollection;
  defaultsCollection:AngularFirestoreCollection;
  defaults:Observable<any>;
  type:Array<string>;
  cities:Array<string>;
  participantid;
  name;
  number;
  Email;
  selectedtype;
  selectedcity;
  token;
  mumbai;
  chennai;
  delhi;
  email;
  event:Array<string>;
  selectedevent;
  form:forms;
  selectedvalue;
  tokennumber;
emailid;
  fillform = new FormGroup({
    type:new FormControl(''),
    cities: new FormControl(''),
    message:new FormControl(''),
    comment:new FormControl(''),
    answer:new FormControl(''),
    event:new FormControl(''),
  })
  time:number=500;
  interval;

  constructor(db: AngularFirestore , private route:ActivatedRoute, public routing:Router) { 
    this.db=db;
     this.type=['Consultation with A&H','Review with A&H','Complimentary ATC'];
     this.cities=['Chennai','Delhi','Mumbai'];
     this.event=['uP! Advanced (Revisit)','Conversational Programming Mastery','EIS Aspirant','EIS Apprenticeship','EIS Fellowship','Ask A&H for Recommendation'];
     this.form=new forms;
     this.defaultsCollection = db.collection('defaults', ref => ref.orderBy("desc"));
     this.participantsCollection = db.collection('Participants', ref => ref.orderBy('firstpurchasedate', "desc"));
     this.participants = this.participantsCollection.valueChanges();
     this.route.queryParams.subscribe(params =>{
      this.email = params['email'];
      console.log(this.email);
    }); 
      this.participantsCollection=this.db.collection('Participants',ref=>ref.where('email','==',this.email).orderBy('name'));
      this.participantsCollection.valueChanges().subscribe(snapshot=> {
          snapshot.forEach(data=>{
            console.log("the email exsits");
            this.participantid=data.id;
              this.name=data.name;
              this.number=data.phone;
              this.Email=data.email;
              this.participantid= data.id;
              console.log(this.participantid);
              console.log(this.Email);
              console.log(this.number);
              console.log(this.name);
              
          }) 
      })
      this.FormCollection = this.db.collection('form', ref => ref.where('email','==',this.email).orderBy("name"));
      this.FormCollection.valueChanges().subscribe(data=>{
        
         data.forEach(data=>{
         this.emailid = data.email;
         })
        })
      
        this.interval = setInterval(()=>{
          if(this.time>0){
            this.time--;
          
          }
        }) 
  }
  
  ngOnInit() {
  }

  selecttype(){
    console.log(this.selectedtype);
   
   }
   
     selectcity(){
      console.log(this.selectedcity);
      this.selectedvalue=this.selectedcity+this.selectedtype;
      console.log(this.selectedvalue);
          }

  selectevent(){
    console.log(this.selectedevent);
  }

 

confirm(fillform){
  console.log("form collection is creadted");
  const formid = this.db.createId();
this.db.doc('/form/'+formid).set({
 name:this.name,
 email:this.email,
 type:fillform.type,
 city:fillform.cities,
 participantid:this.participantid,
 event:fillform.event,
 question1:fillform.message,
 question2:fillform.comment,
 id:formid,
})
console.log("data is updated");
this.fillform.reset()
this.routing.navigate(['./thankyoupage', this.email]);
  }
}
  /*
  var cnt=0;
    
    if(this.selectedvalue == 'ChennaiComplimentary ATC'){
    this.db.collection('/defaults').doc('city').valueChanges().take(1).subscribe(data =>{ 
        this.chennai = data['chennaiATC'];
        console.log(this.chennai);
    cnt=this.chennai+1;
      console.log("this is to check"); 
      this.token = 'CA0' + cnt;
      console.log(this.token);
    console.log(cnt);
        
this.db.collection('/defaults').doc('city').update({
  chennaiATC:cnt
})

console.log("this is after update");
  console.log('this is for token generation');     
  const formtokenid = this.db.createId();
  this.db.doc('/FormToken/'+formtokenid).set({
     name:this.name,
     email:this.email,
     tokennumber:this.token,
     type:fillform.type,
     city:fillform.cities,
     participantid:this.participantid,
     question1:fillform.message,
     question2:fillform.comment,
     status:"Requested",
     id:formtokenid,   
    
 })
 console.log("the token document is updated");
    })
}
 var cnt=0;
    console.log(this.selectedtype);
    if(this.selectedvalue == 'ChennaiConsultation'){
    this.db.collection('/defaults').doc('city').valueChanges().take(1).subscribe(data =>{ 
        this.chennai = data['chennaiConsultation'];
        console.log(this.chennai);
    cnt=this.chennai+1;
      console.log("this is to check"); 
      this.token = 'CC0' + cnt;
      console.log(this.token);
    console.log(cnt);
        
this.db.collection('/defaults').doc('city').update({
  chennaiConsultation:cnt
})

console.log("this is after update");
  console.log('this is for token generation');     
  const formtokenid = this.db.createId();
  this.db.doc('/FormToken/'+formtokenid).set({
     name:this.name,
     email:this.email,
     tokennumber:this.token,
     type:fillform.type,
     city:fillform.cities,
     participantid:this.participantid,
     question1:fillform.message,
     question2:fillform.comment,
     status:"Requested",
     id:formtokenid,   
    
 })
 console.log("the token document is updated");
    })
}
 var cnt=0;
    console.log(this.selectedtype);
    if(this.selectedvalue == 'ChennaiReview with A&H'){
    this.db.collection('/defaults').doc('city').valueChanges().take(1).subscribe(data =>{ 
        this.chennai = data['chennaiReview'];
        console.log(this.chennai);
    cnt=this.chennai+1;
      console.log("this is to check"); 
      this.token = 'CR0' + cnt;
      console.log(this.token);
    console.log(cnt);
        
this.db.collection('/defaults').doc('city').update({
  chennaiReview:cnt
})
console.log("this is after update");
  console.log('this is for token generation');     
  const formtokenid = this.db.createId();
  this.db.doc('/FormToken/'+formtokenid).set({
     name:this.name,
     email:this.email,
     tokennumber:this.token,
     type:fillform.type,
     city:fillform.cities,
     participantid:this.participantid,
     question1:fillform.message,
 question2:fillform.comment,
     status:"Requested",
     id:formtokenid,   
    
 })
 console.log("the token document is updated");
    })
}


if(this.selectedvalue == 'MumbaiComplimentary ATC'){
  this.db.collection('/defaults').doc('city').valueChanges().take(1).subscribe(data =>{ 
      this.mumbai = data['mumbaiATC'];
      console.log(this.mumbai);
  cnt=this.mumbai+1;
    console.log("this is to check"); 
    this.token = 'MA0' + cnt;
    console.log(this.token);
  console.log(cnt);
      
this.db.collection('/defaults').doc('city').update({
mumbaiATC:cnt
})
console.log("this is after mumbai update");
console.log('this is for token generation');     
const formtokenid = this.db.createId();
  this.db.doc('/FormToken/'+formtokenid).set({
   name:this.name,
   email:this.email,
   tokennumber:this.token,
   type:fillform.type,
   city:fillform.cities,
   participantid:this.participantid,
   question1:fillform.message,
 question2:fillform.comment,
   status:"Requested",
   id:formtokenid,   
  
})
console.log("the token document is updated");
  })
}
if(this.selectedvalue == 'MumbaiConsultation'){
  this.db.collection('/defaults').doc('city').valueChanges().take(1).subscribe(data =>{ 
      this.mumbai = data['mumbaiConsultation'];
      console.log(this.mumbai);
  cnt=this.mumbai+1;
    console.log("this is to check"); 
    this.token = 'MC0' + cnt;
    console.log(this.token);
  console.log(cnt);
      
this.db.collection('/defaults').doc('city').update({
mumbaiConsultation:cnt
})
console.log("this is after mumbai update");
console.log('this is for token generation');     
const formtokenid = this.db.createId();
  this.db.doc('/FormToken/'+formtokenid).set({
   name:this.name,
   email:this.email,
   tokennumber:this.token,
   type:fillform.type,
   city:fillform.cities,
   participantid:this.participantid,
   question1:fillform.message,
 question2:fillform.comment,
   status:"Requested",
   id:formtokenid,   
  
})
console.log("the token document is updated");
  })
}
if(this.selectedvalue == 'MumbaiReview with A&H'){
  this.db.collection('/defaults').doc('city').valueChanges().take(1).subscribe(data =>{ 
      this.mumbai = data['mumbaiReview'];
      console.log(this.mumbai);
  cnt=this.mumbai+1;
    console.log("this is to check"); 
    this.token = 'MR0' + cnt;
    console.log(this.token);
  console.log(cnt);
      
this.db.collection('/defaults').doc('city').update({
mumbaiReview:cnt
})
console.log("this is after mumbai update");

console.log('this is for token generation');     
const formtokenid = this.db.createId();
  this.db.doc('/FormToken/'+formtokenid).set({
   name:this.name,
   email:this.email,
   tokennumber:this.token,
   type:fillform.type,
   city:fillform.cities,
   participantid:this.participantid,
   question1:fillform.message,
 question2:fillform.comment,
   status:"Requested",
   id:formtokenid,   
  
})
console.log("the token document is updated");
  })
}
if(this.selectedvalue == 'DelhiComplimentary ATC'){
  this.db.collection('/defaults').doc('city').valueChanges().take(1).subscribe(data =>{ 
      this.delhi = data['delhiATC'];
      console.log(this.delhi);
  cnt=this.delhi+1;
    console.log("this is to check"); 
    this.token = 'DA0' + cnt;
    console.log(this.token);
  console.log(cnt);
      
this.db.collection('/defaults').doc('city').update({
delhiATC:cnt
})
console.log("this is after delhi update");

console.log('this is for token generation');     
const formtokenid = this.db.createId();
  this.db.doc('/FormToken/'+formtokenid).set({
   name:this.name,
   email:this.email,
   tokennumber:this.token,
   type:fillform.type,
   city:fillform.cities,
   participantid:this.participantid,
   question1:fillform.message,
 question2:fillform.comment,
   status:"Requested",
     id:formtokenid,   
     
    })
console.log("the token document is updated");
  })
}   
if(this.selectedvalue == 'DelhiConsultation'){
  this.db.collection('/defaults').doc('city').valueChanges().take(1).subscribe(data =>{ 
      this.delhi = data['delhiConsultation'];
      console.log(this.delhi);
  cnt=this.delhi+1;
    console.log("this is to check"); 
    this.token = 'DC0' + cnt;
    console.log(this.token);
  console.log(cnt);
      
this.db.collection('/defaults').doc('city').update({
delhiConsultation:cnt
})
console.log("this is after delhi update");

console.log('this is for token generation');     
const formtokenid = this.db.createId();
  this.db.doc('/FormToken/'+formtokenid).set({
   name:this.name,
   email:this.email,
   tokennumber:this.token,
   type:fillform.type,
   city:fillform.cities,
   participantid:this.participantid,
   question1:fillform.message,
 question2:fillform.comment,
   status:"Requested",
     id:formtokenid,   
     
    })
console.log("the token document is updated");
  })
}   
if(this.selectedvalue == 'DelhiReview with A&H'){
  this.db.collection('/defaults').doc('city').valueChanges().take(1).subscribe(data =>{ 
      this.delhi = data['delhiReview'];
      console.log(this.delhi);
  cnt=this.delhi+1;
    console.log("this is to check"); 
    this.token = 'DR0' + cnt;
    console.log(this.token);
  console.log(cnt);
      
this.db.collection('/defaults').doc('city').update({
delhiReview:cnt
})
console.log("this is after delhi update");

console.log('this is for token generation');     
const formtokenid = this.db.createId();
  this.db.doc('/FormToken/'+formtokenid).set({
   name:this.name,
   email:this.email,
   tokennumber:this.token,
   type:fillform.type,
   city:fillform.cities,
   participantid:this.participantid,
   question1:fillform.message,
 question2:fillform.comment,
   status:"Requested",
     id:formtokenid,   
     
    })
console.log("the token document is updated");
  })
  
} 
*/  





