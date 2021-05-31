import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Customer} from '../classes';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email','phone'];
  dataSource:MatTableDataSource<any>;
 customerCollection:AngularFirestoreCollection;
 tagCollection:AngularFirestoreCollection;
 categoryCollection:AngularFirestoreCollection;
  db:AngularFirestore;
  tag:Array<string>;
  category:Array<string>;
  tagdetail:Observable<any>;
  selectedid:string;
  customertag:Array<string>;
  sort;
  selectedtag;
  selectedcategory;
  currentcustomer:{};


@ViewChild(MatSort) set content(content: ElementRef) {
  this.sort = content;
  if (this.sort){
     this.dataSource.sort = this.sort;

  }
}
@ViewChild('TABLE') table: ElementRef;

  constructor(db: AngularFirestore) {
    this.db=db;
    this.customertag=[];
    this.category=[];
    this.tag=[];
    this.dataSource = new MatTableDataSource();
    this.customerCollection = db.collection('Customers' ,ref => ref.orderBy('name'));
    this.customerCollection.valueChanges().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      console.log(this.dataSource.data);
    })
    var newcategory;
    this.categoryCollection= db.collection('Category',ref => ref.orderBy('name'));
    this.categoryCollection.valueChanges().subscribe(snapshot=>{
       snapshot.forEach(snapshot=>{
         newcategory=snapshot;
         console.log(newcategory);
         this.category.push(snapshot.name);
       })
         console.log(this.category);
      })
      var taglist;
      this.tagCollection=this.db.collection('Tag',ref=>ref.orderBy('name'));
      this.tagCollection.valueChanges().subscribe(data=> {
        data.forEach(data=>{
           taglist=data;
           console.log(taglist);
           this.tag.push(data.name);
        })
        console.log(this.tag);
      })

    this.selectedtag="all";
    this.selectedcategory="all";
  }

  ngOnInit() {

  }
  
filtercategory(){
    var newtag
    if(this.selectedcategory !='all'){
      this.tagCollection=this.db.collection('Tag',ref=>ref.where('categoryname','==',this.selectedcategory).orderBy('name'));
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

filtertag(){
    console.log(this.selectedtag);
   var newid;
    this.tagCollection=this.db.collection('Tag',ref=>ref.where('name','array-contains',this.selectedtag).orderBy('name'));
    this.tagCollection.valueChanges().subscribe(data=> {
          newid=data;
          console.log(data);
          if(this.selectedtag !='all'){
            console.log(newid[0].id);
            this.customerCollection=this.db.collection('Customers',ref=>ref.where(newid[0].id,'==','true').orderBy('name'));
            this.customerCollection.valueChanges().subscribe(data => {
              this.dataSource.data = data;
              this.dataSource.sort = this.sort;
              console.log(this.dataSource.data);
            });
          }
          else{
            if(this.selectedtag =='all'){
              this.customerCollection=this.db.collection('Customers',ref=>ref.orderBy('name'));
              this.customerCollection.valueChanges().subscribe(data => {
                this.dataSource.data = data;
                this.dataSource.sort = this.sort;
                console.log(this.dataSource.data);
              });
            }
          }
    });
  }


showtagdetails(customer)
{
  this.selectedid=customer.id;
  console.log(this.selectedid);
  var tagname;
  this.tagCollection=this.db.collection('Tag',ref=>ref.where('customerid','==',this.selectedid).orderBy('name'));
      this.tagCollection.valueChanges().subscribe(data=> {
        data.forEach(data=>{
          tagname=data.name;
          console.log(tagname);
          this.customertag=tagname;
          console.log(this.customertag);
        })
      })  
}

}
