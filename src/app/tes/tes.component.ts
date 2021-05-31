import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute} from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, interval} from 'rxjs';
import { WindowService } from '../window.service';

import { DomSanitizer ,SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-tes',
  templateUrl: './tes.component.html',
  styleUrls: ['./tes.component.css']
})
export class TesComponent implements OnInit {
  private router: Router;
  private db: AngularFirestore;
  verificationCode:string;
  number;
  time:number=300;
  loggedin:boolean=true;
  recaptchaVerifier;
  interval;
  emaillistCollection:AngularFirestoreCollection;
  participantsCollection: AngularFirestoreCollection;
  participants:Observable<any>;
 Url:SafeUrl;
 sanitizer:DomSanitizer;
name;
userexist;
docexist;



 constructor(db: AngularFirestore, router: Router,private win:WindowService,sanitizer:DomSanitizer) { 
  this.router = router;
this.db = db;
/*
this.verificationCode;
this.sanitizer=sanitizer;
this.db.doc('/defaults/webinar').valueChanges().subscribe(data=>{
  this.Url=this.sanitizer.bypassSecurityTrustResourceUrl(data['link']);

  console.log(this.Url);
  
})
*/

 }


  ngOnInit() {
  }

 open(){
   console.log(this.number);
   this.loggedin=false;
    this.participantsCollection=this.db.collection('Participants',ref=>ref.where('phone','==',this.number).where('eit_status','==','started').orderBy('name'));
    this.participantsCollection.valueChanges().subscribe(snapshot=> {
          if(snapshot.length>0){
            this.userexist=true;
          }
          else{
            this.docexist=true;
          }
          })
    
}

  
 

}
