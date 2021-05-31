import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.css']
})
export class ParticipantComponent implements OnInit {

  participantid: string;
  participant: Observable<any>;
  participantDoc: AngularFirestoreDocument;
  eventsDoc: AngularFirestoreCollection;
  events: Observable<any[]>;
  db: AngularFirestore;
  attendedeventsDoc: AngularFirestoreCollection;
  attendedevents: Observable<any[]>;
  attendedeventpopulated: Observable<any[]>;
  tests: any[];
  constructor( private route: ActivatedRoute, private router: Router, db: AngularFirestore)
  {
    this.db = db;
    this.participantid = this.route.snapshot.paramMap.get('id');
    this.participantDoc = this.db.doc('/Participants/'+this.participantid);
    this.participant = this.participantDoc.valueChanges();
    this.eventsDoc = this.db.collection('Events', ref => ref.where('eventtype', '==', 'installation').orderBy('startdate', "desc"));
    this.events = this.eventsDoc.valueChanges();
    console.log(this.participantid);
    this.attendedeventsDoc = this.db.collection('EventParticipants', ref => ref.where('participantid', '==', this.participantid).orderBy('startdate', "desc"));
    this.attendedevents = this.attendedeventsDoc.valueChanges();
    this.attendedeventpopulated = new Observable();
    this.tests = [{name: 'alex', age:20}, {name:'george', age:32}];
    this.attendedevents.subscribe(data =>
      {
          var ae = [];
          for(let each of data)
          { var eventdata = {
                participant: this.db.doc('/Participants/'+each.participantid).valueChanges(),
                event: this.db.doc('/Events/'+each.eventsid).valueChanges()
                }
            ae.push(eventdata);
          }
          console.log("Whats cooked");
          console.log(ae);
          this.attendedeventpopulated = of(ae);
      });

  }

  ngOnInit() {
  }

}
