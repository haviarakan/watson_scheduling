import { Component, OnInit ,ViewChild,ElementRef } from '@angular/core';
import { Journey } from '../journey';
import { AuthService } from '../core/auth.service';
import { Router, ActivatedRoute, } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { AngularFireStorage,AngularFireStorageReference,AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, take} from 'rxjs/operators';
import { WindowRef } from '../WindowRef';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-journey-summary',
  templateUrl: './journey-summary.component.html',
  styleUrls: ['./journey-summary.component.css']
})
export class JourneySummaryComponent implements OnInit {
  displayedColumns: string[] = ['date','type','location','quicknotes','linkname','link','multiplelink','associatedmedia','people_involved','edit','button','sequence'];
  dataSource:MatTableDataSource<any>;
  db: AngularFirestore;
  windowref: WindowRef;
  journey:Journey;
  updatejourney:Journey;
  JourneyCollection:AngularFirestoreCollection;
  participantsCollection:AngularFirestoreCollection;
  defaults:Observable<any>;
  sort;
  participant:Observable<any>;
  participantDoc:AngularFirestoreDocument;
  participantid:string;
  data;
  ref:AngularFireStorageReference;
  task:AngularFireUploadTask;
  uploadProgress:Observable<number>;
  downloadURL:Observable<string>;
  getDownloadloadURL:Observable<string>;
  linkarray;
  file;
  consultation:number;
  totalconsultation:number;
  review;
  total;
  total_consultations:number;
  total_review:number;
  consultation_taken=0;
  consultationtaken=0;
  count=0;
  review_taken=0;
  reviewtaken:number;
  increase=0;
  validty;
  id;
  link;
  name;
  date;
  location;
  type;
  quicknotes;
  people_involved;
  sequence;
  selecttype;
  selectedtypes:Array<String>;
  people:Array<String>=[];
  peoples:Array<String>;
newlink:[{}];
linkarr:string;
linkfield:{};
dropdownSettings={};
editparticipantid;
editid;
edittype;

  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort){
       this.dataSource.sort = this.sort;
    }
  }

  @ViewChild('TABLE') table: ElementRef;

  constructor(db: AngularFirestore,public route: ActivatedRoute ,private router: Router,private afStorage:AngularFireStorage, private window: WindowRef) {
   
   /* this.types=[
      'Consultation',
      'Review',
      'uP!',
      'Change Work Fellowship', 
      'EIS Training', 
      'EIS Fellowship',
      'Life Update Video', 
      'Life Report', 
      'Watched Pre Post',
      'EIS Diagnostic List',
      'Change-Work',
      'A&H Review - Change work',
      'A&H Review - ATC list' 
    ];
    */
    //this.peoples=['ram','sam','kumar'];
    this.db = db;
    this.participantid = this.route.snapshot.paramMap.get('participant.id');
    this.participantDoc = this.db.doc('/Participants/'+this.participantid);
    this.participant = db.collection('Participants', ref => ref.orderBy('firstpurchasedate')).valueChanges();
    this.participantsCollection = db.collection('Participants', ref => ref.orderBy('firstpurchasedate', "desc"));
    this.participant=this.participantsCollection.valueChanges();
    console.log(this.participantid);
    this.participantsCollection = this.db.collection('Participants', ref => ref.where('id','==',this.participantid).orderBy('name'));
    this.participantsCollection.valueChanges().subscribe(snapshot=> {
        snapshot.forEach(data=>{
          this.name=data.name;
          console.log(this.name);
        })
       
      })
      this.JourneyCollection =this.db.collection('Journey', ref => ref.where('participantid', '==', this.participantid).orderBy('date'));
      this.JourneyCollection.valueChanges().subscribe(data=>{
        data.forEach(data=>{
          this.id=data.id;
       console.log(this.id);
        })
       
      })
      
    this.participantsCollection = db.collection('/Participants', ref => ref.orderBy('firstpurchasedate', "desc"));
    this.journey=new Journey;
    this.dataSource = new MatTableDataSource();
   //this.JourneyCollection =this.db.collection('Journey', ref => ref.where('participantid', '==', this.participantid).orderBy('date'));
    this.JourneyCollection =this.db.collection('Journey', ref => ref.where('participantid', '==', this.participantid).orderBy('date').orderBy('sequence'));
    this.JourneyCollection.valueChanges().subscribe(data=>{
      this.dataSource.data=data;

    })  
    this.db.doc('/defaults/type').valueChanges().subscribe(data=>{
    this.selectedtypes=data['types'];
    console.log(this.selectedtypes);
    })
    this.db.doc('/defaults/people').valueChanges().subscribe(data=>{
      this.peoples=data['people_involved'];
      console.log(this.peoples);
    });


   //this.journey.type="Consultation";
   this.windowref=window;
   this.linkarray=[];
   this.file={}; 
      
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

onSelectAll(people: any) {
  console.log(people);
}

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filteredData);
  }


  upload(event,id,linkname){
    this.db.doc('/Journey/'+id).valueChanges();
   const fileid = Math.random().toString(36).substring(2);
    this.ref= this.afStorage.ref(fileid);
    for(var i=0; i< event.target.files.length; i++){ 
      var fileupload=event.target.files[i];
    this.task=this.ref.put(fileupload);
    console.log(this.task);
    }
    
    console.log("upload completed");
    this.uploadProgress = this.task.percentageChanges();
    console.log(this.uploadProgress); 
    this.task.snapshotChanges().pipe(finalize(()=>{
      this.downloadURL = this.ref.getDownloadURL();
      this.downloadURL.subscribe(url => {
       this.file=url;
       this.updatelink(id);
       this.file='<a href="'+this.file+'"target="_blank"> '+linkname+'</a>';
       console.log(this.file);
      })
      }) 
    
    ).subscribe();
    
     }

     updatelink(id){
       console.log(id);
       var linkarray=[];
       
    console.log("this is new update function");
    this.db.doc('/Journey/'+id).valueChanges().subscribe(data => {
       linkarray=data['multiplelink'];
         console.log(linkarray);
      linkarray.push(this.file);
       console.log(linkarray);
      this.db.doc('/Journey/'+id).update({
          multiplelink:linkarray
        })
        })      
}

addlink(id,link,linkname){
  console.log(id);
  console.log(linkname);
  var links=[];
  link = '<a href="'+link+'"target="_blank"> '+linkname+'</a>';
  console.log(link);
  console.log("input field for link");
  this.db.doc('/Journey/'+id).valueChanges().subscribe(data => {
    links=data['multiplelink'];
      console.log(links);
   links.push(link);
    console.log(links);
   this.db.doc('/Journey/'+id).update({
       multiplelink:links
     })
     })
     this.linkarr=id.multiplelink;    
    console.log(this.linkarr);
}
test(journey){
  this.linkarr=journey.multiplelink;
  this.newlink=journey.multiplelink;
  console.log(this.newlink);
}


selected(){
  console.log(this.selecttype);
  
}  



onItemSelect(people){
  
  console.log(people);
}

addconsultation(participantid){
  var consultation;
 this.totalconsultation = this.total_consultations;
    console.log("totalconsultation :",this.totalconsultation);
    console.log("Participantid in addtotal button :",this.participantid);
this.db.doc('/Participants/'+participantid).valueChanges().subscribe(data => {
  if(!data['total_consultations'])
  {
    console.log("count value");
    data['total_consultations'] = 0;
  }
  consultation=data['total_consultations']+this.totalconsultation;  
    console.log(consultation);
    console.log(participantid);  
     console.log("updated");
      
      this.db.doc('/Participants/'+this.participantid).update({
        total_consultations:consultation,
    })
  
})
}

addreview(participantid){
  var review;
  var totalreview = this.total_review;
    console.log("totalreview :",totalreview);
    this.db.doc('/Participants/'+participantid).valueChanges().subscribe(data => {
      if(!data['total_review'])
        {
          console.log("count value");
          data['total_review'] = 0;
        }
      review=data['total_review']+totalreview;  
      console.log(review);
      this.db.doc('/Participants/'+this.participantid).update({
        total_review:review,
      }) 
    }) 
      
}

addvalidty(participantid){
  console.log(participantid)
  this.db.doc('/Participants/'+participantid).update({
    validty:this.validty,
  })
  console.log(this.validty);
}
/*
addsequence(id,sequence){
  console.log(sequence);
  this.db.doc('/Journey/'+id).update({
    sequence:sequence, 
  })
  console.log("sequence",sequence);
}
*/
editjourney(journey,participantid){
  console.log(journey);
  this.editid=journey.id;
  this.date=journey.date;
  this.location=journey.location;
  this.edittype=journey.type;
  this.quicknotes=journey.quicknotes;
  this.people_involved=journey.people_involved;
  this.sequence=journey.sequence;
  this.editparticipantid = participantid;
  this.type=journey.type;
  console.log(this.date);
  console.log(journey.type);
}

  updatedjourney(){
    
  //  this.db.doc('/Journey/'+journey.id).valueChanges().subscribe(data=>{
    this.db.doc('/Journey/'+this.editid).update({
    date:this.date,
    location:this.location,
    type:this.type,
    quicknotes:this.quicknotes,
    people_involved:this.people_involved,   
    sequence:this.sequence
  })
  .then(res=>{
    if(this.edittype!='Consultation' && this.type=='Consultation')
    {
         console.log("this is to incrementconsultation +1");
              this.db.doc('/Participants/'+this.editparticipantid).valueChanges().subscribe(data => {
                this.consultationtaken = data['consultation_taken']+1;
                console.log(this.consultationtaken);
                this.db.doc('/Participants/'+this.editparticipantid).update({
                  consultation_taken:this.consultationtaken,
                })
              })
            } 
         if(this.edittype!='Review' && this.type=='Review'){
          console.log("this is to incrementreview +1")
          this.db.doc('/Participants/'+this.editparticipantid).valueChanges().subscribe(data => {
            this.reviewtaken = data['review_taken']+1;
            console.log(this.reviewtaken);
            this.db.doc('/Participants/'+this.editparticipantid).update({
              review_taken:this.reviewtaken,
            })
          }) 
         }
         if(this.edittype=='Consultation' && this.type!='Consultation')
         {
             console.log("this is to decrement consultation -1")
            this.db.doc('/Participants/'+this.editparticipantid).valueChanges().subscribe(data => {
              this.consultationtaken = data['consultation_taken']-1;
              console.log(this.consultationtaken);
              this.db.doc('/Participants/'+this.editparticipantid).update({
                consultation_taken:this.consultationtaken,
              })
            })
          }
         if(this.edittype=='Review' && this.type!='Review'){
          console.log("this is decrement review -1")
          this.db.doc('/Participants/'+this.editparticipantid).valueChanges().subscribe(data => {
            this.reviewtaken = data['review_taken']-1;
            console.log(this.reviewtaken);
            this.db.doc('/Participants/'+this.editparticipantid).update({
              review_taken:this.reviewtaken,
            })
          }) 
        }
  })
  /*
  console.log(this.date);
  console.log(this.location);
  console.log(this.type);
  console.log(this.quicknotes);
  console.log(this.people_involved);
  */
}

  /*
  this.JourneyCollection =this.db.collection('Journey', ref => ref.where('participantid', '==', this.participantid).orderBy('date'));
  this.JourneyCollection.valueChanges().subscribe(data=>{
      this.journeydetails=data;
      console.log(this.journeydetails);
  })
*/  



addjourney(participantid){
   console.log(this.journey);
   console.log(participantid);
    const journeyid = this.db.createId();
  this.db.doc('/Journey/'+journeyid).set({
     date:this.journey.date,
     type:this.selecttype,
     location:this.journey.location,
     participantid:participantid,
     quicknotes:this.journey.quicknotes,
     multiplelink:this.linkarray,
     people_involved:this.people,
     sequence:this.journey.sequence,
     id:journeyid,
  }).then(res=>{
    if(this.selecttype == "Consultation"){
      this.incrementconsultation(participantid);
         }
    if(this.selecttype == "Review"){
      this.incrementreview(participantid);
    }
  })

}
  
incrementconsultation(participantid){
  console.log("incrementcon");
 if(this.selecttype == "Consultation"){
      this.db.doc('/Participants/'+participantid).valueChanges().subscribe(data => {
        if(!data['consultation_taken'])
        {
          console.log("count value");
          data['consultation_taken'] = 0;
        }
        this.consultationtaken = data['consultation_taken'] +1;
        console.log(this.consultationtaken);
        this.db.doc('/Participants/'+participantid).update({
          consultation_taken:this.consultationtaken,
        })
      })
    }
    
  
}

  incrementreview(participantid){
    console.log("reviewincrem");
  if(this.selecttype == "Review"){
  this.db.doc('/Participants/'+participantid).valueChanges().subscribe(data => {
    if(!data['review_taken'])
    {
      console.log("count value");
      data['review_taken'] = 0;
    }
    this.reviewtaken = data['review_taken']+ 1;
    console.log(this.reviewtaken);
    this.db.doc('/Participants/'+participantid).update({
      review_taken:this.reviewtaken,
    })
  })
}
  }

  updateconsultation(participantid){
    console.log("incrementcon");
   if(this.type == "Consultation"){
        this.db.doc('/Participants/'+participantid).valueChanges().subscribe(data => {
          if(!data['consultation_taken'])
          {
            console.log("count value");
            data['consultation_taken'] = 0;
          }
          this.consultationtaken = data['consultation_taken'] +1;
          console.log(this.consultationtaken);
          this.db.doc('/Participants/'+participantid).update({
            consultation_taken:this.consultationtaken,
          })
        })
      } 
  }

  updatereview(participantid){
    console.log("reviewincrem");
  if(this.type == "Review"){
  this.db.doc('/Participants/'+participantid).valueChanges().subscribe(data => {
    if(!data['review_taken'])
    {
      console.log("count value");
      data['review_taken'] = 0;
    }
    this.reviewtaken = data['review_taken']+ 1;
    console.log(this.reviewtaken);
    this.db.doc('/Participants/'+participantid).update({
      review_taken:this.reviewtaken,
    })
  })
}
  }
 
  deletejourney(id,participantid,type)
  {
    console.log(type);
    if(confirm("Are you sure want to delete journey")){
    console.log("Deleting journey:"+id);
     if(type=="Consultation"){
      this.decrementconsultation(participantid,type);
    }
    if(type=="Review"){
      this.decrementreview(participantid,type);
      }
    this.db.doc('/Journey/'+id).delete().catch(error => console.log(error));
    }
  }

  decrementconsultation(participantid,type){
    console.log("decrementcon"); 
    console.log(type);
    if(type == "Consultation"){
      console.log("this is inside the function");
      this.db.doc('/Participants/'+participantid).valueChanges().subscribe(data => {
        this.consultationtaken = data['consultation_taken'] -1;
        console.log(this.consultationtaken);
        this.db.doc('/Participants/'+participantid).update({
          consultation_taken:this.consultationtaken,
        })
      })
    }
  
  }

 decrementreview(participantid,type){
console.log("reviewdecrement");
console.log(type);
if(type == "Review"){
  console.log("this is inside reviewdelete");
  this.db.doc('/Participants/'+participantid).valueChanges().subscribe(data => {
    this.reviewtaken = data['review_taken']-1;
    console.log(this.reviewtaken);
    this.db.doc('/Participants/'+participantid).update({
      review_taken:this.reviewtaken,
    })
  })
}
 }
   

}


