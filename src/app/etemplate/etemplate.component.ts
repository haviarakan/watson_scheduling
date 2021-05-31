import { Component, OnInit } from '@angular/core';
import { Template1 } from '../template';
import { AngularFirestore} from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-etemplate',
  templateUrl: './etemplate.component.html',
  styleUrls: ['./etemplate.component.css']
})
export class EtemplateComponent implements OnInit {
  db: AngularFirestore;
  template1:Template1;
  alltemplate:Observable<any>
  
constructor(db: AngularFirestore)
   {
    this.template1 = new Template1;
    this.db =db;
    this.alltemplate = db.collection('ETemplate', ref => ref.orderBy('name')).valueChanges();

    }

  ngOnInit() {
  }
savetemplate()
{
  console.log(this.template1);
  const tempid = this.db.createId();
  this.db.doc('/ETemplate/'+tempid).set({
    name: this.template1.name,
     Description: this.template1.Description,
     templateid: this.template1.templateid,
     fields:this.template1.fields,
     id:tempid
}).then(res =>{
  this.template1 = new Template1;
});

}


}
