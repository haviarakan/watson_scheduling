import {AfterViewInit,ViewChild, Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog'
import { AddNeweisdialogComponent } from '../add-neweisdialog/add-neweisdialog.component';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort'
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-add-eis',
  templateUrl: './add-eis.component.html',
  styleUrls: ['./add-eis.component.css']
})
export class AddEisComponent implements OnInit {

  ////
  displayedColumns = [ "name","email","phonenumber","zoomurl","zoomid","zoompassword","Edit","Delete"]
  dataSource : MatTableDataSource<any>
  eisuser

  @ViewChild(MatPaginator) paginator : MatPaginator;
  @ViewChild(MatSort) sort : MatSort;

  constructor(public dialog : MatDialog,private afs : AngularFirestore) { 
    
    
  }

  ///
  ngAfterViewInit(){

    this.afs.collection("EISUserDetails").valueChanges().subscribe( snapshot => {
      console.log(snapshot);
      
      this.eisuser = snapshot;
      this.dataSource = new MatTableDataSource(snapshot);
      this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    })
    

    // this.afs.collection("EISUserDetails").valueChanges().subscribe( snapshot => {
    //   snapshot.forEach( doc => {
    //     console.log(doc);
    //     this.eisuser.push(doc)
        
    //   })
    //   this.dataSource = new MatTableDataSource(this.eisuser);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // })
    
  }
  ///
  openDialog():void {
    this.dialog.open(AddNeweisdialogComponent)
      
  }

  ngOnInit(): void {
  }

  ///
  onrowdelete(id){
console.log(id);
this.afs.collection("EISUserDetails").doc(id).delete().then(() => {
  console.log("document successfully deleted");
  
})
  }
////
onrowedit (id){
  const userobj = this.eisuser.find( item => {
    return item.id === id
  })
  console.log(userobj);

  this.dialog.open(AddNeweisdialogComponent,{data : userobj})
  
}

}
