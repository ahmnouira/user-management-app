import { Component, OnInit } from '@angular/core';
import { User } from './model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseDBService } from './firebase-db.service';
import { Chart } from  "angular-highcharts";
import * as Highcharts from 'highcharts';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


// options for the chart
let chartOptions : Highcharts.Options  = {

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
    categories :  []   // to update later

   }, 
   yAxis : {
     title : {
       text : null}
     },

     series : [{
       name : 'Likes',
       data : [],     // to update later
       type : undefined
     }]
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  users$ : Observable<User[]>;
  users : Array<User> = new  Array<User>();
  chart : Chart = new Chart(chartOptions);
  addUserForm : FormGroup;

  constructor(private dbService: FirebaseDBService, private fb: FormBuilder) { }
   
  ngOnInit(): void {
    this.users$ = this.dbService.getUsers(); 
    this.createForm(); 
    this.users$.subscribe((users: User[]) => {
      this.users = users;
      let categoriesNames : string [] = users.sort((u1, u2) => u1.likes - u2.likes).map(user => user.username).reverse();
      let seriesData : number[] = users.sort((u1, u2) => u1.likes - u2.likes).map(user => user.likes).reverse();
      this.chart.ref$.subscribe((chart: Highcharts.Chart) => chart.update({
        xAxis : {
          categories: categoriesNames
        },
        series : [{
          data: seriesData,
          type: undefined
        }]
        })); 
      }); 
  }

  createForm() : void {
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

  // add likes for the user
  like(id: string, user: User) : void {
    user.likes +=1;
    this.updateUser(id,user);
  }

  // add user in the db
  addUser() : void {
    console.log('form data: ', this.addUserForm.value);
    // if data in the form is invalid return. 
    if (this.addUserForm.invalid) {
      alert('invalid form');
      return;
    }
    // add to firebase 
    this.dbService.addUser(this.addUserForm.value).then(() => alert('User Added')).catch((err) => console.error(err));
  }

  // delete the user
  deleteUser(id : string) : void {
    const deleteConfirm = confirm('Are Your Sure!');
    if(deleteConfirm) {
    this.dbService.deleteUser(id).then(() => alert('User Delated')).catch((err) => console.error(err));
  } else {
    return;
  }
}

  // update User
  updateUser(id: string, user: User) : void {
    this.dbService.udpateUser(id, user).catch((err) => console.error(err)); 
  }
 
}
