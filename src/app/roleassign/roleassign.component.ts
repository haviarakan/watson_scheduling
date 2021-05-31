import { Component, OnInit, Testability } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { WindowRef } from '../WindowRef';
import { MatDialog} from '@angular/material/dialog';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
//import {formatDate}from '@angular/common';

@Component({
  selector: 'app-roleassign',
  templateUrl: './roleassign.component.html',
  styleUrls: ['./roleassign.component.css']
})
export class RoleassignComponent implements OnInit {
  db: AngularFirestore;
  todaytime;
  mydate;
  todaysDatatime;
  today;
  role;
  peoplerole;
  dropdownSettings={};
  data = [{
    type: "",
    name : ""
  }];
user;
rolepeople;
username;


  constructor(db: AngularFirestore, public auth: AuthService , private dialog:MatDialog,public route: ActivatedRoute ) {
    this.db = db;
    this.user=this.auth.user;
  //  this.todaytime=formatDate(this.today,'hh:mm:ss a', 'en-US', '+0530');
    //this.mydate=formatDate(this.today,'dd/MM/yyyy','en' );
    //this.todaysDatatime=formatDate(this.today, 'dd-MM-yyy hh:mm:ss a', 'en-US', '+0530');
   
    this.db.doc('/defaults/role').valueChanges().subscribe(data=>{
      
      this.role=data['stage'];
      
      this.role.forEach(value=>{
        //   this.data=value;
           //console.log(value);
      this.data.push({ type: "",name : ""})  

      }
        )

        for (let i = 0; i < this.role.length; i++) {
          this.data[i].type= this.role[i]
          
        }
        
      console.log(this.role);
      
    })

   var list = [];
     this.db.collection("users").ref.get().then((doc)=>{
      doc.forEach(data=>{
      this.peoplerole = data.data();
      this.rolepeople=this.peoplerole.displayName;
     list.includes(this.rolepeople)? console.log("check"):
      list.push(this.rolepeople);
    })
    this.username=list;
    console.log(this.username);
  })
    

   /*
    this.db.doc('/defaults/member').valueChanges().subscribe(data=>{
      this.peoplerole=data['rolemanger'];
      console.log(this.peoplerole);
    })
   */ 
  }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    
 
    
    this.data.splice(this.data.length-1,1)
    }


    submit(){
      // for (let index = 0; index < this.data.length; index++) {
      //   this.data[index].name
      //   this.data[index].lable
        
      // }

      
      
          // const roleid = this.db.createId();
          // this.db.doc('/rolescreen/'+roleid).set({
          //   rolemanager:this.data,
          // })
          for (let i = 0; i < this.data.length; i++) {
            if(this.data[i].type=="" || this.data[i].name==""){
              console.log("Error")
              break
            }  
            if(i+1 == this.data.length){
              this.db.doc('/defaults/roleassigned').set({
                projectmanager:this.data,
              },{merge:true})

              console.log(this.data);
              console.log("new document is created role");
            }      
          }
         }


         
    onItemSelect(role){
    
      console.log(role);
    }
   

}
