import { Component, OnInit ,ViewChild,ElementRef } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Sales } from '../sales';
import { MatSort } from '@angular/material/sort';
import { MatDatepicker } from '@angular/material/datepicker';


@Component({
  selector: 'app-saleslead',
  templateUrl: './saleslead.component.html',
  styleUrls: ['./saleslead.component.css']
})
export class SalesleadComponent implements OnInit {
  displayedColumns:string[] = ['name', 'message', 'source', 'createddate', 'activeupdates', 'status', 'lastvisit','owner','comments','followupdate'];
  dataSource:MatTableDataSource<any>;
  owner:Array<string>;
  statuslead:Array<string>;
  sort;
  db:AngularFirestore;
  leadsCollection:AngularFirestoreCollection;
  lead:{};
  sales:Sales; 
  selectedowner;
  selectedstatus;
  comments;




  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort){
       this.dataSource.sort = this.sort;
  
    }
  }

  @ViewChild(MatDatepicker) Datepicker:MatDatepicker<Date>;

  @ViewChild('TABLE') table: ElementRef;
 
  constructor(db: AngularFirestore) {
    this.db=db;
    this.sales=new Sales;
    this.dataSource = new MatTableDataSource();
    this.owner =["joshua","preethi","hari","puru"];
    this.statuslead =["fresh","called","p1","p2","bad"]; 
    this.selectedowner = 'all';
    this.selectedstatus = 'all';
    this.filterlead();
 
  
   }
  
 
  ngOnInit() {
  
  }

  filterlead(){
     if((this.selectedowner != 'all') && (this.selectedstatus != 'all')){
      this.leadsCollection = this.db.collection('Leads', ref => ref.where('owner','==', this.selectedowner).where('statuslead','==', this.selectedstatus).orderBy('name'));
      this.leadsCollection.valueChanges().subscribe(data => {
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
        console.log(this.dataSource.data);      
        
      });
      console.log("this is both if");
     }
      else {
        if(this.selectedowner != 'all') {
        this.leadsCollection = this.db.collection('Leads', ref => ref.where('owner','==', this.selectedowner).orderBy('name'));
        this.leadsCollection.valueChanges().subscribe(data => {
          this.dataSource.data = data;
          this.dataSource.sort = this.sort;
        });  
        console.log("this is owner");
       }
       
       if(this.selectedstatus != 'all' ){
        this.leadsCollection = this.db.collection('Leads', ref => ref.where('statuslead','==', this.selectedstatus).orderBy('name'));
        this.leadsCollection.valueChanges().subscribe(data => {
          this.dataSource.data = data;
          this.dataSource.sort = this.sort;
        }); 
       console.log("this is statuslead");
       }

       if((this.selectedowner == 'all') && (this.selectedstatus == 'all'))
       {
        this.leadsCollection = this.db.collection('Leads', ref => ref.orderBy('name'));
        this.leadsCollection.valueChanges().subscribe(data => {
          this.dataSource.data = data;
          this.dataSource.sort = this.sort;
          console.log(this.dataSource.data);      
          
        });
       }

      }
    console.log(this.selectedowner);
    console.log(this.statuslead);
    
  }
  
  updatestatus(status,id)
  {
    this.db.doc('/Leads/'+id).update({
        statuslead:status
       }).then(res =>{
         console.log("Status Changed");
         console.log(status);  
     })
  }

  addleads()
  {
    console.log("Adding New leads");
    const leadsid = this.db.createId();
    this.db.doc('/Leads/'+leadsid).set({
      id:leadsid,
      name: this.sales.name,
      message:this.sales.message,
      source:this.sales.source,
      createddate:this.sales.createddate,
      activeupdates:this.sales.activeupdates,
      statuslead:this.sales.statuslead,
      lastvisit:this.sales.lastvisit,
      owner:this.sales.owner,            
       
    });
    console.log("displayed the data");
  }
  
  addcomments(comments,id,followupdate)
  {
    this.db.doc('/Leads/'+id).update({
    comments:comments
    }).then(res=>{
      console.log("comment added");
      console.log(comments);
    })
  }

  }
