import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from './model/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDBService {

  private usersCollection : AngularFirestoreCollection<User>;
  private users : Observable<User[]>;

  constructor(private afs : AngularFirestore) { 
     // select 'users' collection in alphabetic reverse order 
      this.usersCollection = this.afs.collection<User>('users', query => query.orderBy('username', 'asc')); 
      // in order to get the list of users + their ids
      this.users = this.usersCollection.snapshotChanges().pipe(
      map((actions : DocumentChangeAction<User>[])=> actions.map(a => {
        const data : User = a.payload.doc.data() as User;
        const id : string = a.payload.doc.id;
        return { id, ...data };
      }))
    );
   }
 
  // get users of the db
  getUsers() : Observable<User[]> {
    return this.users;
  }

  // add User in db 
  addUser(user : User) : Promise<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>> {
    return this.usersCollection.add(user);
  }

  //delete user form db
  deleteUser(id: string) : Promise<void> {
    return this.usersCollection.doc(`/${id}`).delete();
  }

  // update user from db 
  udpateUser(id: string, user : User) : Promise<void> {
    return this.usersCollection.doc(`/${id}`).update(user);
  }

}
