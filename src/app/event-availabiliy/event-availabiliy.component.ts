import { Component, OnInit } from '@angular/core';
import {AuthService} from '../core/auth.service';
import {AngularFirestore} from '@angular/fire/firestore'
import {FormGroup,FormBuilder,Validators} from '@angular/forms'



@Component({
  selector: 'app-event-availabiliy',
  templateUrl: './event-availabiliy.component.html',
  styleUrls: ['./event-availabiliy.component.css']
})
export class EventAvailabiliyComponent implements OnInit {

///storing logged in username in below variable through authservice
  EIS_Specialist
/// below variable for form product select (got from assigneventtype collection )
selectProduct
/// below variable for form eventtype select (got from assigneventtype collection )
selectEventtype
///below variable is to store list of time with the interval of 15mins
timelist:string[] = []

///below array variable is for option repeat or doesnot repeat
option:string[]=["Repeat","Does Not Repeat"]


///below array variable is weekday selection
weekday:string[] = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

///below variable to disable to end date & weekday 
isDisabled:boolean = false

//creating variable to store form input data for analysing 
formdata

///
arrayoftime = []
eventtimeslot = []
arrayofdate = []
datesegregatedlist = []
segregatedlist = []

///creating formGroup
eventavailabilityForm:FormGroup = this.fb.group({
        eisname : [,],
        eventProduct:[,],
        eventType:[,],
        startdate:[,],
        starttime:[,],
        endtime:[,],
        option:[,],
        weekday:[,],
        enddate:[{value:"",disabled:this.isDisabled},Validators.required]

})

  constructor(private auth : AuthService,private afs: AngularFirestore,private fb : FormBuilder) {


  // let d = new Date()
  // let g = d.setDate(d.getDate()+12)
  // console.log(
  //   new Date(g)
  // );
  // console.log(d.getTime());

  // let f = new Date("06/25/2021")
  // console.log(f);
  // console.log(
  //   (f.getTime() - d.getTime())/(1000*3600*24)
  // );
  
  
  
  

    ///getting logged in username
    this.auth.user.subscribe( doc => {
      console.log(doc.displayName);
      this.EIS_Specialist = doc.displayName
      // console.log(this.EIS_Specialist);
      this.getUserAssignEventtype()
      this.getListOfTime()
      this.eventavailabilityForm.patchValue({
        eisname :this.EIS_Specialist
      })
    })

    

   }

  ngOnInit(): void {
  }
///function called from constructor to get data
  getUserAssignEventtype(){
           /// query EIS_Specialist name  equal to  eis_specialist name saved in collection assign_eventtype to get document product and eventtype
       this.afs.collection("assigneventtype",ref => ref.where("eisname","==",this.EIS_Specialist)).get().toPromise().then( snapshot => {
         snapshot.docs.forEach(doc => {
           console.log(doc.data());
           this.selectProduct = doc.data()['product']
           console.log(this.selectProduct);
           this.selectEventtype = doc.data()['eventtype'] 
         })
      })
  }

///function called from constructor to create list of time string to store in a array
getListOfTime(){
  let x = 15; //minutes interval
  let tt = 0; //start time
  let ap = ["AM","PM"] // AM-PM

  //loop to increment the array and push result in a timelist array
  for (let i = 0; tt < 24*60 ; i++){
     let hh = Math.floor(tt/60);//getting hours of day in 0-24 format
     let mm = (tt % 60); //getting minutes of the hour in 0-55 format
     this.timelist[i] = ("0" + (hh % 24)).slice(-2) + ":" + ("0"+ mm).slice(-2) + ap[Math.floor(hh/12)]
     tt = tt + x
  }
  console.log(this.timelist);
  
}

/////
onoptionselect(value){
  console.log(value);
  if(value === "Does Not Repeat"){
    return this.isDisabled = true,this.eventavailabilityForm.get("enddate").disable()
  }else { 
    return this.isDisabled = false,this.eventavailabilityForm.get("enddate").enable()
  }
  
}

/// form submission 
onSubmit(value){
this.formdata = value
console.log(value);
//for creating id
const id = this.afs.createId();
///form data submitting to collection 
// this.afs.collection("eventavailability").doc(id).set({
//   eisname : value.eisname,
//   product : value.eventProduct,
//   eventtype : value.eventType,  let myobj = []
//   startdate : value.startdate,
//   enddate : value.enddate,
//   starttime : value.starttime,
//   endtime : value.endtime
// }).then( () => {
//   console.log("document successfully submitted");
//   this.eventavailabilityForm.reset()
//   this.afterformsubmission()
  
// }).catch( err => {console.log("document submission failed due to :",err);})

this.afterformsubmission()

}

///
afterformsubmission(){
console.log("afterformsubmission logged");
console.log(this.formdata);

// start point for creating arrayofdateimport;
let st_date = new Date(this.formdata.startdate)
console.log(st_date);

let end_date = new Date(this.formdata.enddate)
console.log(end_date);



const noofdays = Math.floor( (end_date.getTime() - st_date.getTime()) / (1000*3600*24) )
console.log(noofdays);

for(let k = 0; k < noofdays;k++){
  // console.log("k : ", k);
  
  let nextdate = st_date.setDate(st_date.getDate() + 1)
  // console.log(nextdate);
  
  let nextdate_ = new Date(nextdate)
  // console.log(nextdate_);
   
  let day = nextdate_.getDay()

  // console.log("day : ",day);
  

  this.formdata.weekday.map(item => {
    if(this.arrayofdate.length === 0){
      this.arrayofdate.push({
        date: this.formdata.startdate,
        day:this.weekday[new Date(this.formdata.startdate).getDay()]
      })
  }if (item === day){
    // console.log("item,day",item,day);
    

      const dateobj = {
        date : nextdate_.toISOString().substring(0,10),
        day : this.weekday[day]
      }
      this.arrayofdate.push(dateobj)
  }
    
  })
  console.log("date array : ",this.arrayofdate);
}

////endpoint

if (this.formdata.startdate){
  //////
  let st = this.formdata.starttime.slice(0,2)*60  
  let et = this.formdata.endtime.slice(0,2)*60 
  console.log(st,et);   
  let mt = 90; //minutes interval
  let tt = st; //start time
  let ap = ["AM","PM"] // AM-PM
  //loop to increment the array and push result in a timelist array
  for (let j = 0; tt < et; j++){
     let hh = Math.floor(tt/60);//getting hours of day in 0-24 format
     let mm = (tt % 60); //getting minutes of the hour in 0-55 format
     this.arrayoftime[j] = ("0" + (hh % 24)).slice(-2) + ":" + ("0"+ mm).slice(-2) + ap[Math.floor(hh/12)]
     tt = tt + mt
  }
  ////
  console.log(this.arrayoftime);
  /////
for (let l = 0;l < this.arrayofdate.length;l++){

  for(let i = 0 ; i < this.formdata.eventType.length;i++){
    // console.log(this.eventtimeslot);
    // console.log(this.formdata.eventType[i]);

    if (this.formdata.eventType[i] !== "WiSH Diagnostics"){
     

        for (let j = 0; j < this.arrayoftime.length;j++){
          let myobj = {
            duration: "",
            date : this.arrayofdate[l].date,
            day:this.arrayofdate[l].day,
            EIS_Specialist: this.EIS_Specialist,
            eventtype :this.formdata.eventType[i],
            timeslot : this.arrayoftime[j],
            appointed : false
          } 
          
          this.eventtimeslot.push(myobj)   
        }
       
    }
  }
}
    
////
}
console.log(this.eventtimeslot);

for(let m = 0;m < this.formdata.eventType.length; m++){
  console.log(this.formdata.eventType[m]);
  
  for(let n =0; n < this.arrayofdate.length;n++){
              console.log(this.arrayofdate[n].date);
              

   const result =  this.eventtimeslot.filter( item => {
         return  item.eventtype === this.formdata.eventType[m] && item.date === this.arrayofdate[n].date
          
        
      })
      console.log(result);

      // const obj = {}
      // obj[this.arrayofdate[n].date] = result


      //  this.datesegregatedlist.push(obj)

      this.datesegregatedlist[this.arrayofdate[n].date] = result
      


      // this.eventtimeslot.map( item => {
      //      if (item.eventtype === this.formdata.eventType[m] && item.date === this.arrayofdate[n].date){
      //       console.log(item);
      //       const obj = []
      //       obj.push(item)
      //       this.datesegregatedlist.push(obj)
      //       return this.segregatedlist[this.formdata.eventType[m]]= this.datesegregatedlist
            
           
      //     }
      // })
 
  }
  this.segregatedlist[this.formdata.eventType[m]] = this.datesegregatedlist
}
console.log(this.datesegregatedlist);
console.log(this.segregatedlist);


}
///
}

