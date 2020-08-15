import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.interface';
import { map, first, switchMap, tap } from 'rxjs/operators';
import { of, from, BehaviorSubject, Subscription, Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';

interface RegisterValues {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

interface LoginValues {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User>(null);
  private userSub: Subscription;

  constructor(
    private fAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.userSub = this.getUserObservable().subscribe((user) => {
      this._user.next(user);
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  getUserById(userId: string): Observable<User> {
    return from(this.firestore.doc<User>(`users/${userId}`).get()).pipe(
      map(x => {
        const data = x.data();
        const id = x.id;
        return {
          ...data,
          id
        } as User;
      })
    );
  }

  getCurrentUser() {
    return this._user.asObservable();
  }

  getUsersByUsername(username: string): Observable<User> {
    return from(
      this.firestore
        .collection<User>('users', (ref) =>
          ref.where('username', '==', username)
        )
        .snapshotChanges()
        .pipe(
          map((actions) =>
            actions.map((a) => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return { id, ...data };
            })
          ),
          map((users) => users[0])
        )
    );
  }

  getUserObservable() {
    let userEmail: string;
    let userId: string;
    return this.fAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          userId = user.uid;
          userEmail = user.email;
          return this.firestore
            .doc<User>(`users/${user.uid}`)
            .snapshotChanges();
        } else {
          return of(null);
        }
      }),
      map((doc) => {
        if (doc) {
          return {
            ...doc.payload.data(),
            email: userEmail,
            id: userId,
          } as User;
        }
      })
    );
  }

  registerWithEmailAndPass(values: RegisterValues) {
    return from(
      this.fAuth.createUserWithEmailAndPassword(values.email, values.password)
    ).pipe(
      switchMap(async (res) => {
        const userId = res.user.uid;
        if (userId) {
          const userDoc = this.firestore.doc<User>('users/' + userId);
          return userDoc.set({
            ...values,
            chats: [],
          });
        }
        return of(null);
      })
    );
  }

  loginWithEmailAndPass(values: LoginValues) {
    return from(
      this.fAuth.signInWithEmailAndPassword(values.email, values.password)
    ).pipe(first());
  }

  logoutUser() {
    return from(this.fAuth.signOut()).pipe(first());
  }
}
