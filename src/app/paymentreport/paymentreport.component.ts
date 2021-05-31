import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-paymentreport',
  templateUrl: './paymentreport.component.html',
  styleUrls: ['./paymentreport.component.css']
})
export class PaymentreportComponent implements OnInit {

  participantsCollection: Observable<any[]>;
  displayedColumns: string[] = ['name', 'purchasedate', 'lastpaymentdate', 'emi','emiduetilldate', 'emipaid', 'emimissed',  'emiamountpaid', 'emioverdue'];
  paymentreport = [];
  dataSource:MatTableDataSource<any>;
  sort;
@ViewChild(MatSort) set content(content: ElementRef) {
  this.sort = content;
  if (this.sort){
     this.dataSource.sort = this.sort;
  }
}

@ViewChild('TABLE') table: ElementRef;

  constructor(private route: ActivatedRoute, private router: Router, db: AngularFirestore) {
  this.dataSource = new MatTableDataSource();
  this.participantsCollection = db.collection('Participants', ref => ref.where('pp_status', '==', 'Active PaymentPlan').orderBy('pp_lastpayment')).valueChanges();

  }




  ngOnInit() {


    this.participantsCollection.subscribe(data => {
            for (let each of data){
              var emiduetilldate = this.diff_months(new Date(Date.now()), new Date(each.firstpurchasedate));
              var emiamountdue = each.pp_installmentamount * emiduetilldate;
              if(emiamountdue  > each.pp_totalpurchasevalue * 1.18)
              {
                emiamountdue = Math.ceil(each.pp_totalpurchasevalue * 1.18);
              }
              var emioverdue = (emiduetilldate - each.pp_installmentspaid) * each.pp_installmentamount ;
              if(emioverdue > (each.pp_totalpurchasevalue - each.pp_totalpaid) * 1.18)
              {
                emioverdue = Math.ceil((each.pp_totalpurchasevalue - each.pp_totalpaid) * 1.18);
              }
              var eachreport = {
                name: each.name,
                purchasedate: each.firstpurchasedate,
                lastpaymentdate: each.pp_lastpayment,
                emi: each.pp_installmentamount,
                emiduetilldate: emiduetilldate,
                emipaid: each.pp_installmentspaid,
                emimissed: emiduetilldate - each.pp_installmentspaid,
                emiamountdue: emiamountdue,
                emiamountpaid: each.pp_totalpaid,
                emioverdue: emioverdue
              };
              this.paymentreport.push(eachreport);

/*
              var paymentsCollection: Observale<any[]>;
              paymentsCollection = this.db.collection('ParticipantPayments', ref => ref.where('participantid', '==', each.id).orderBy('date', "desc")).valueChanges(),
              paymentsCollection.subscribe(data1 => {
                for(let eachpayment of data1){
// code here if you want anything to do with all the payments
                }

            });
            */
          }
          this.dataSource = new MatTableDataSource(this.paymentreport);
          this.dataSource.sort = this.sort;
        });
  }
  diff_months(d2, d1)
  {

    var months;
months = (d2.getFullYear() - d1.getFullYear()) * 12;
months -= d1.getMonth() + 1;
months += d2.getMonth();
months += 1;
return months;


  }
 
  ExportCSV()
  {
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Watsondataexport.csv');

  }
}
