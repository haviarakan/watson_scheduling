import { Component, OnInit ,ViewChild,ElementRef } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, } from '@angular/material/sort';
import { HttpClientModule,HttpClient,HttpHeaders} from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-bigquery',
  templateUrl: './bigquery.component.html',
  styleUrls: ['./bigquery.component.css']
})
export class BigqueryComponent implements OnInit {
 displayedColumns: string[] =  ['name', 'pp_totalpaid', 'pp_totalpurchasevalue', 'pp_installmentamount', 'pp_lastpayment', 'pp_status'];
//displayedColumns: string[] =  ['name'];

dataSource:MatTableDataSource<any>; 
  report:any;
  sort;
  db:AngularFirestore;
  startdate;
  enddate;
  data;
  @ViewChild('TABLE') table: ElementRef;

  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort){
       this.dataSource.sort = this.sort;
  
    }
  }

  
  
  constructor(private http:HttpClient,db:AngularFirestore){
   this.dataSource=new MatTableDataSource();
   this.dataSource.data = [];
  // this.db=db;
  
  }
  ngOnInit() {

  }
 
  
  getdata(){
    
  //this.http.get("https://us-central1-watson-9878.cloudfunctions.net/getdata").subscribe(response=>{

   const url='https://us-central1-watson-9878.cloudfunctions.net/getdata';
  
   const httpOptions={
    headers : new HttpHeaders({
      'Content-Type':'text/plain',
      'Access-Control-Allow-origin':'*'
    })
   };
  const data={
    sdate:'2019-03-01',
    edate:'2019-03-31'
}
return this.http.post(url,data, httpOptions)
    .subscribe(data=>{
       console.log(data);
    })
//})
   
   
  
}

radndom1(){
  
 this.http.get<any>("https://us-central1-watson-9878.cloudfunctions.net/radndom1").subscribe(response=>{
   // this.report= new MatTableDataSource<any>([response]);
  // this.report.push(response);
  this.report=response;
   this.dataSource.data = response;
   this.dataSource.sort = this.sort;
    //this.dataSource = new MatTableDataSource(this.report);
   console.log(this.dataSource);
   console.log(this.dataSource.data);

});
const url='https://us-central1-watson-9878.cloudfunctions.net/radndom1';
  
   const httpOptions={
    headers : new HttpHeaders({
      'Content-Type':'text/plain',
      'Access-Control-Allow-origin':'*'
    })
   };

   const data={
    "startdate":'2019-04-01',
     "enddate":'2019-04-30'
   }
   let body =JSON.stringify(data)
    
   return this.http.post(url, body, httpOptions)
    .subscribe((data:any)=>{
       console.log(url + data);
    })
}


}