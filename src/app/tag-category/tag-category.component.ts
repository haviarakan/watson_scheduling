import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Newcategory, Newtag, counter } from '../categorytag';
import { isNgTemplate } from '@angular/compiler';


@Component({
  selector: 'app-tag-category',
  templateUrl: './tag-category.component.html',
  styleUrls: ['./tag-category.component.css']
})
export class TagCategoryComponent implements OnInit {
 db:AngularFirestore;
 allcategory:Observable<any>;
 alltag:Observable<any>;
 allcounter:Observable<any>;
 tagCollection:AngularFirestoreCollection;
 counterCollection:AngularFirestoreCollection;
 category:Newcategory;
 tag:Array<string>;
 tagname:Newtag;
 count:counter;
 data;
 catid;
 countnumber:Array<any>;



constructor(db: AngularFirestore) {
  this.db=db;
  this.tag=[];
  this.count= new counter;
  this.tagname=new Newtag;
  this.category = new Newcategory; 
  this.allcategory= db.collection('Category',ref => ref.orderBy('name')).valueChanges();
  this.alltag= db.collection('Tag',ref => ref.orderBy('name')).valueChanges();
  this.allcounter=db.collection('Counter',ref=>ref.orderBy('name')).valueChanges();   
  this.countnumber=[0,1,2,3];   
}

  ngOnInit() {
  }

addcategory()
{
  console.log("this is addcategory function");
  console.log(this.category);
  const categoryid = this.db.createId();
  this.db.doc('/Category/'+categoryid).set({
  name:this.category.name,
  id:categoryid
  })
}

addcounter(){
  console.log(this.count.name);
  const countid = this.db.createId();
  this.db.doc('/Counter/'+countid).set({
    name:this.count.name,
    id:countid
  })
}

incrementcount(cntname,index)
{
  if(!this.countnumber[index])
  {
    this.countnumber[index]=0;
  }
    this.countnumber[index]= this.countnumber[index]+1;

    //this.countnum=cntname+this.countnumber[];

    console.log(this.countnumber[index]);
}

decrementcount(cntname,index)
{
  if(!this.countnumber[index]){
    this.countnumber[index]=0;
  }
  
  this.countnumber[index]=this.countnumber[index]-1;

  if(this.countnumber[index]<=0){
 this.countnumber[index]=0;
  }
 
    
  console.log(this.countnumber[index]);
}


addtag()
{
 var newdata;
 this.tagCollection=this.db.collection('Tag',ref=>ref.where('categoryid','==',this.catid).orderBy('name'));
 this.tagCollection.valueChanges().subscribe(data=> {
      newdata=data;
    
if(data.length>0){
  console.log(data[0].name);
 //var index =data[0].name.contains(this.tagname.name)
      //console.log(index);
      var oldarr=data[0].name;
  if (oldarr.indexOf(this.tagname.name) !== -1)
   {
    console.log("name already exists");  
     }
    else {
      var arr=[];
      arr=data[0].name;
      arr.push(this.tagname.name);
     this.db.doc('/Tag/'+data[0].id).update({
        name:arr,
        categoryname:this.data,
        categoryid:this.catid,
        id:data[0].id 
      })
    
  }
}
else{
   /*var newdata;
   this.tagCollection=this.db.collection('Tag',ref=>ref.where('categoryid','==',this.catid).orderBy('name'));
 this.tagCollection.valueChanges().subscribe(data=> {
             newdata=data; 
            */
      var array=[];
      array.push(this.tagname.name);  
  const tagid = this.db.createId();
  this.db.doc('/Tag/'+tagid).set({
    name:array,
    categoryname:this.data,
    categoryid:this.catid,
    id:tagid
    })
   //})
  }
})
}


showtag(cat:any,catid:any)
{
  this.data=cat;
  console.log(cat);
  this.catid=catid;
  console.log(this.catid);
  var newtag;
      this.tagCollection=this.db.collection('Tag',ref=>ref.where('categoryname','==',cat).orderBy('name'));
      this.tagCollection.valueChanges().subscribe(data=> {
        data.forEach(data=>{
        newtag=data.name;
          console.log(newtag);
          this.tag=newtag;
          console.log(this.tag);
        })
      })
    }
  
}



