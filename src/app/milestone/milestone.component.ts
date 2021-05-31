import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User, Purchase, Paymentplan, Payment, Cheque } from '../classes';
import { Observable } from 'rxjs';
import { MatTableModule,MatTableDataSource } from '@angular/material/table';
import 'rxjs/add/operator/take';
import { AuthService } from '../core/auth.service';
import { WindowRef } from '../WindowRef';
import * as XLSX from 'xlsx';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-milestone',
  templateUrl: './milestone.component.html',
  styleUrls: ['./milestone.component.css']
})
export class MilestoneComponent implements OnInit {
  displayedColumns: string[] = ['name','email','phone','Milestone Attended','EIT Eductation Status'];
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
  miles:Array<string>;
  eitstatus;
  currentparticipant;
  dropdownSettings={};
  milestone;
  participant;
  selectedstatus;
mileupdate;
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
    this.db.doc('/defaults/milestone').valueChanges().subscribe(data=>{
      this.miles=data['multiplemile'];
      this.eitstatus=data['eitedustatus'];
      console.log(this.miles);
      console.log(this.eitstatus);
    })

  }

  ngOnInit() {
  this.dropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filteredData);
  }

  onSelectAll(milestone: any,mileupdate:any) {
    console.log(milestone);
    console.log(mileupdate);
  }
  onItemSelect(milestone,mileupdate){
  
    console.log(milestone);
    console.log(mileupdate);
    
  }
  selectstatus(){
    console.log(this.selectedstatus);
   
   }
   
   addstatus(currentparticipant){
     var mile=this.milestone.join(",");
     console.log(mile);
    console.log(currentparticipant.id)
    this.db.doc('/Participants/'+currentparticipant.id).update({
      eit_status:this.selectedstatus,
      milestone:mile,
    })
   }
      

   edituser(participantdetails){
     console.log(participantdetails.id);
     console.log(participantdetails.eit_status);
   }
   updateuser(participantdetails){
    console.log(participantdetails.id);
    console.log(participantdetails.eit_status);
    this.db.doc('/Participants/'+participantdetails.id).update({
      eit_status:this.selectedstatus,
    })
   }

   updatemile(participantdetails){
    console.log(participantdetails.id);
    console.log(participantdetails.eit_status);
    this.db.doc('/Participants/'+participantdetails.id).update({
      milestone:this.mileupdate,
    })
   }

  showparticipant(participant)
  {
    console.log(participant.id)
    this.currentparticipant = {
      participantid: participant.id,
      participant: this.db.doc('/Participants/'+participant.id).valueChanges(),
    }
    console.log(this.currentparticipant);
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
