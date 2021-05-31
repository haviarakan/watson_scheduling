import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModule } from '@angular/core';
import firebase from 'firebase/app';
import "firebase/auth";
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, map} from 'rxjs/operators';

export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
}


@Injectable()
export class AuthService {

  user;
  returnUrl: string;


  constructor(
    public auth:AngularFireAuth,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,
    
  ) {

      //// Get auth data, then get firestore user document || null
      this.user = this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            console.log(user.uid)

            return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
          } else {
            return of(null);
          }
        })
      )


      console.log(this.user)
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

  async googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    await this.oAuthLogin(provider);
    this.router.navigateByUrl(this.returnUrl);

    console.log(this.returnUrl)
  }

  private oAuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider).then((credential) => {
      console.log(credential.user.uid)
      this.updateUserData(credential.user)
    })
  }

  private updateUserData(user) {
    // Sets user data to firestore on login

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }

    return userRef.set(data, { merge: true })

  }


  signOut() {
    console.log("signing out...");
    this.afAuth.signOut().then(() => {
        console.log("Redirecting");
        this.router.navigate(['/login']).then(nav => {
    console.log(nav); // true if navigation is successful
  }, err => {
    console.log(err) // when there's an error
  });;
    });
  }
}
