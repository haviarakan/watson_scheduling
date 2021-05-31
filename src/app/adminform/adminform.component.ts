import { Component, OnInit } from '@angular/core';
import { Adminform ,Templateform} from '../form';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { WindowRef } from '../WindowRef';

@Component({
  selector: 'app-adminform',
  templateUrl: './adminform.component.html',
  styleUrls: ['./adminform.component.css']
})
export class AdminformComponent implements OnInit {
  db: AngularFirestore;
  adminform:Adminform;
  forms:Observable<any>;
  windowref: WindowRef;
 

  constructor(db: AngularFirestore,public auth: AuthService, private window: WindowRef) { 
    this.db = db;
    this.adminform = new Adminform;
    this.forms =db.collection('Forms', ref => ref.orderBy('name')).valueChanges();
    this.windowref = window;
  }

  ngOnInit() {
  
  }

  /*
  showtemplateset(form)
  {
   
    console.log(form.id);
     console.log('Window object', this.windowref.nativeWindow);
     this.windowref.nativeWindow.open("/Formtemplate/"+form.id, "_blank");
  }
*/

  formlook(form){
    console.log(form.id);
     console.log('Window object', this.windowref.nativeWindow);
     this.windowref.nativeWindow.open("/Formdetails/"+form.id, "_blank");
  }

formcontinue()
{
  console.log("collection created")
  const formid = this.db.createId();
  this.db.doc('/Forms/'+formid).set({
    name: this.adminform.name,
    Description: this.adminform.Description,
    id:formid
  }).then(res =>{
    this.adminform = new Adminform;
  });
}
}
