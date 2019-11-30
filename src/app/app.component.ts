import { Component } from '@angular/core';
import { User } from './model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseDBService } from './firebase-db.service';
import {Chart} from  "angular-highcharts";
import * as Highcharts from 'highcharts';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'user-managment-app';

  users : Array<User> = new Array();
  dbUsers : Array<User> = new Array();
  addUserForm : FormGroup;
  chart : Chart;

  constructor(private dbService: FirebaseDBService, private fb: FormBuilder) {
     this.dbService.getUsers().subscribe((data : Array<User>) => {
       this.dbUsers;
       this.users = data;

      console.log("users form firebase:", this.users);
      // console.log(data.map((user) => user.username))
     
      // categries
      console.log("xAxis:", this.getUsers().sort((u1, u2) => u1.likes - u2.likes).map(user => user.username).reverse());


      // values 

     console.log("Values:", this.getUsers().sort((u1, u2) => u1.likes - u2.likes).map(user => user.likes).reverse());

     this.chart = new Chart({
       chart:{
         type: 'column',
         options3d : {
           enabled : true,
           alpha : 10, 
           beta: 25,
           depth : 10
         }
       },
       title : {
         text : 'Users Likes'
       }, 
     
       plotOptions : {
         column : {
           depth : 25
         }
       },
       xAxis : {              
         categories :  this.getUsers().sort((u1, u2) => u1.likes - u2.likes).map(user => user.username).reverse(),
       
        }, 
        yAxis : {
          title : {
            text : null}
          },

          series : [{
            name : 'Likes',
            data : this.getUsers().sort((u1, u2) => u1.likes - u2.likes).map(user => user.likes).reverse(),
            type : undefined
          }]
        
          });   
        });


          this.addUserForm = this.fb.group({
            'username' : ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.pattern('[a-z, ]*')])],
            'email' : ['', Validators.compose([Validators.required, Validators.email])],
            'age': [''],
            'profileImage' : [''],
            'married' : [''],
            'likes' : [0],
          });
  } 

  getClassEmail() : string {
    return this.addUserForm.controls.email.valid ? 'six wide field' : 'six wide field error';
  }

  getClassUsername() : string {
    return this.addUserForm.controls.username.valid ? 'six wide field' : 'six wide field error';
  }


  like(id: string | number, user: User) {
    user.likes +=1;
    this.updateUser(id,user);
  }


 



  getUsers() : User[] {
    return this.users;
  }


  addUser() : void {
    console.log(this.addUserForm.value);

    if (this.addUserForm.invalid) {
      alert('invalid form');
      return;
    }

    // add to firebase 
    this.dbService.addUser(this.addUserForm.value);
  }

  deleteUser(id : string | number) : void {
    this.dbService.deleteUser(id);
  }

  // update User

  updateUser(id: string | number, user: User) : void {
    this.dbService.udpateUser(id, user); 
  
  }
 


}
