import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import {MatSort} from '@angular/material/sort';
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: "app-onboardingscreen",
  templateUrl: "./onboardingscreen.component.html",
  styleUrls: ["./onboardingscreen.component.css"]
})
export class OnboardingscreenComponent implements OnInit {

  participantBoardingData = [];
  saleinitBoardingData;

  displayedColumns = [
    "name",
    "email",
    "phonenumber",
    "product",
    "consultationpackage",
    "reviewpackage",
    "bonus",
    "minimumamountrequired",
    "pdcstatus",
    "oneshotpayment",
    "onboardingstatus"
  ];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort,{static:true}) sort:MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private afs: AngularFirestore, private router: Router) {}

  ngAfterViewInit() {
    this.afs.collection("Participants").valueChanges().subscribe( data => {
      data.forEach( doc => {
        this.participantBoardingData.push({
          
          firstname:doc['firstname'],
          participantemail:doc['email'],
          totalpaid:doc['pp_totalpaid'],
          chequecount:doc['chequecount']
          
        })
      })
    })
    this.afs
      .collection("saleinitiation")
      .valueChanges()
      .subscribe(data => {
        this.saleinitBoardingData = data;
        const result = this.saleinitBoardingData.map(item => {
          const obj = this.participantBoardingData.find( x => 
            x.participantemail === item.email
          );
          return {...item,...obj}
        })
        console.log(result);
        
       
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        
      });
  }

  ngOnInit(): void {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filteredData);
  }
  onChange(id) {
    this.afs
      .collection("/saleinitiation")
      .doc(id)
      .update({
        onboardingstatus: "OnBoarded"
      })
      .then(() => {
        console.log("Document updated with new field");
      })
      .catch(error => {
        console.error("error updating document with new field:", error);
      });
  }
}
