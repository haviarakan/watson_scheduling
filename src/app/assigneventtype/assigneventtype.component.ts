import { Component, OnInit } from '@angular/core';
import {FormGroup,Validators,FormBuilder} from '@angular/forms';
import {AngularFirestore} from "@angular/fire/firestore";
import {MatTableDataSource} from '@angular/material/table'

@Component({
  selector: 'app-assigneventtype',
  templateUrl: './assigneventtype.component.html',
  styleUrls: ['./assigneventtype.component.css']
})
export class AssigneventtypeComponent implements OnInit {

  /// product list variable 
  products

  /// eventtype list variable
  eventtype
  eventtypelist = []
  eventtypeproduct = []

  selectedproduct

  ///formGroup
  assigneventtypeForm : FormGroup = this.fb.group ({
    name : [,{Validators: [Validators.required],updateOn:"change"}],
    product : [,{Validators: [Validators.required],updateOn:"change"}],
    eventType : [,{Validators: [Validators.required],updateOn:"change"}]


  })
////table formGroup
ontableForm:FormGroup = this.fb.group({
  enterduration: [,]
})

  ///
  displayedColumns:string[] = ["eventtypename","duration","collaboration","enterduration","checkcollaboration"]
  eventtypewholelist = []
  dataSource : MatTableDataSource<any>;

  constructor(private afs: AngularFirestore,private fb : FormBuilder) {

    ///getting product from product collection stored in firebase
    this.afs.collection("product").doc("productid").get().toPromise().then( doc => {
       this.products = doc.data()['products']
       console.log(this.products);
       
    })

    ///getting eventtype from product collection stored in firebase
    this.afs.collection("product").doc("eventtypeid").get().toPromise().then ( doc => {
         this.eventtype = doc.data()
         console.log(this.eventtype);
         console.log(this.eventtype.WiSH);

         ///getting eventtype whole list to add duration and collboration
    for(let i = 0; i < this.products.length;i++){
      
      this.eventtype[this.products[i]].map( item  => {
        this.eventtypewholelist.push({
          eventtypename : item,
         

        })
        
      })
      console.log(this.eventtypewholelist);
      console.log(this.eventtypewholelist[0].eventtypename);
      
      this.dataSource = new MatTableDataSource(this.eventtypewholelist)
      
    }
         
         
    })
    /////////getting eventtypefulllist updating with exiting eventtypewholelist 
    this.afs.collection("product").doc("eventtypefulllistid").get().toPromise().then ( doc => {
     
      let array = doc.data()['eventtypewholelist']
      console.log("array : ",array.length,array);
      for (let i = 0;i < array.length;i++){
        this.eventtypewholelist.map(item => {
          if (item.eventtypename === array[i].eventtypename){
            return item['duration'] = array[i].duration,item['collaboration'] = array[i].collaboration
          }
        })
        
      }
      console.log(this.eventtypewholelist);
      
    })

    
   }

///
    ngAfterViewInit(){
      
    }


////

  ngOnInit(): void {
  }

  //// callback function 
  onproductSelect(value){
  
    if(value.length !== 0){
      this.eventtypelist = []
      for(let j = 0; j < value.length ; j++){
             console.log(this.eventtype[value[j]]);
            const y = this.eventtype[value[j]].map ( item => {
              console.log(item);
              return this.eventtypelist.push(item)
          })
      }
    }else{
      console.log("No value");
      this.eventtypelist = [];
    }
  }
///form submit
onSubmit(value){
console.log(value);
console.log(value.eventType);


const id = this.afs.createId();
console.log(id);
this.afs.collection("assigneventtype").doc(id).set({
  eisname : value.name,
  product : value.product,
  eventtype : value.eventType

}).then( () => {
  console.log("document successfully submitted");
  this.assigneventtypeForm.reset()
  this.eventtypelist = [];
  
}).catch( err => {
  console.log(err);
  
})
}

////
ontableinputchange(value,value1){
console.log(value,value1);
this.eventtypewholelist.map(item => {
  if (item.eventtypename === value1){
    const i = this.eventtypewholelist.findIndex( item => {
     return item.eventtypename === value1
    })
    console.log(i);
    
    return this.eventtypewholelist[i]['duration'] = value

     
    
  }
 
  
})
console.log(this.eventtypewholelist);

}

///////
ontablecheckboxchange(event,value1){
console.log(event,value1);
if (event === true){
  const i = this.eventtypewholelist.findIndex( item => {
    return item.eventtypename === value1
   })
   console.log(i);
  return this.eventtypewholelist[i]['collaboration'] = "Required"
}else{
  const i = this.eventtypewholelist.findIndex( item => {
    return item.eventtypename === value1
   })
   console.log(i);
  return this.eventtypewholelist[i]['collaboration'] = "Not Required"
}
}

//////////
ontablesubmit(value){
  console.log(value);
  this.afs.collection("product").doc("eventtypefulllistid").set({
    eventtypewholelist : value
  }).then( () => {
    console.log("document sucessfully submitted");
  }).catch( (err) => {console.log(err);
  })
}
//////

}

