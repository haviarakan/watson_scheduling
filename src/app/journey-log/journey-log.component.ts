import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User, Purchase, Paymentplan, Payment, Cheque } from '../classes';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import 'rxjs/add/operator/take';
import { AuthService } from '../core/auth.service';
import { WindowRef } from '../WindowRef';
import * as XLSX from 'xlsx';
import { Server } from 'http';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-journey-log',
  templateUrl: './journey-log.component.html',
  styleUrls: ['./journey-log.component.css']
})
export class JourneyLogComponent implements OnInit {

  
  //displayedColumns: string[] = ['name', 'recentpurchase', 'pp_totalpaid', 'pp_balance'];
  displayedColumns: string[] = ['name','consultation_taken','review_taken','total_consultations','total_review', 'first_consultation', 'recent_consultation', 'validty'];
  dataSource:MatTableDataSource<any>;
  user: User;
  db: AngularFirestore;
  participantsCollection: AngularFirestoreCollection;
  purchasesCollection: AngularFirestoreCollection;
  paymentsCollection: AngularFirestoreCollection;
  paymentplansCollection: AngularFirestoreCollection;
  passwordCollection:AngularFirestoreCollection;
  participants: Observable<any[]>;
  defaults: Observable<any>;
  windowref: WindowRef;
  pp_status: String;
  billingshow: Boolean;
  formshow: Boolean;
  currentparticipant:{};
  data:[{}]; 
  alldata;
  //@ViewChild(MatSort) sort: MatSort;
  sort;
@ViewChild(MatSort) set content(content: ElementRef) {
  this.sort = content;
  if (this.sort){
     this.dataSource.sort = this.sort;

  }
}

@ViewChild('TABLE') table: ElementRef;


  constructor(db: AngularFirestore, public auth: AuthService, private window: WindowRef) {
    this.dataSource = new MatTableDataSource();
    this.user = new User;
    this.db = db;
    this.participantsCollection = db.collection('Participants', ref => ref.orderBy('firstpurchasedate', "desc"));
    this.participants = this.participantsCollection.valueChanges();
    this.participantsCollection.valueChanges().subscribe(data => {
          this.dataSource.data = data;
          this.dataSource.sort = this.sort;
          console.log(this.dataSource.data);  
    
    });
    this.defaults = this.db.doc('/defaults/2LzhWT7EuJI6QUKmHil3').valueChanges();
    this.windowref = window;
    this.billingshow = false;
    this.formshow = true;
     
    
  }

  ngOnInit() {

  }

  applyFilter(filterValue: string) { 
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filteredData);
  }

    
  showfulldetails(participant)
    {
      console.log(participant.id);
       console.log('Window object', this.windowref.nativeWindow);
       this.windowref.nativeWindow.open("/Journey/"+participant.id , "_blank");
    }

  ExportCSV()
  {
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'testladataexport.csv');

  }
}
