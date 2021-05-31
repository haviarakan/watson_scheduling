import { Component, OnInit } from '@angular/core';
import { Customer } from '../classes';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {


  newcustomer: Customer;
  db: AngularFirestore;
  allcustomers: Observable<any[]>;

  constructor(db: AngularFirestore) {
    this.newcustomer = new Customer;
    this.db = db;
    this.allcustomers = db.collection('Customers' ,ref => ref.orderBy('name')).valueChanges();
  }

  ngOnInit() {
  }

  addcustomer()
  {
   
    console.log(this.newcustomer);
      const customerid = this.db.createId();
      this.db.doc('/Customers/'+customerid).set(
        {
          firstname:this.newcustomer.fname,
          lastname: this.newcustomer.lname,
          name: this.newcustomer.fname +" "+ this.newcustomer.lname,
          email: this.newcustomer.email,
          phone: this.newcustomer.phone,
          id: customerid
        }
      ).then(res =>{
        this.newcustomer = new Customer;
      });;
  
    }
    
  }

