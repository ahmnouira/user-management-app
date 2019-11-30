import { Injectable } from '@angular/core';
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
  constructor(afs : AngularFirestore) { 
  this.usersCollection = afs.collection<User>('users'); // select 'users' collection
  // in order to get the list of users + id 
  this.users = this.usersCollection.snapshotChanges().pipe(
      map((actions : DocumentChangeAction<User>[])=> actions.map(a => {
        const data = a.payload.doc.data() as User;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  
  // get users of the db
  getUsers() : Observable<User[]> {
  console.log(this.users);
   return  this.users;

  }

  // add User in db 
  addUser(user : User) : void {
    this.usersCollection.add(user);
  }

  //delete user form db
   deleteUser(id: string | number) : void  {
    this.usersCollection.doc(`/${id}`).delete();
  }

  // update user from db 
  udpateUser (id: string | number, user : User) {
    this.usersCollection.doc(`/${id}`).update(user);
  }

}
