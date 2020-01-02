# user-management-app 

* User Management App using Angular and [Cloud Firestore](https://firebase.google.com/docs/firestore) database.

* This app allows you to display likes in graphic using [Highcharts](https://www.highcharts.com/).

# Overview 

![index](/img/index.png)

![data](/img/data.png)

### Deploy the App to Firebase Hosting 

1. Build the project using `ng build --prod`.
2. Install firebase CLI `npm install -g firebase-tools`. 
3. Login to your firebase acccount `firebase login`.
4. Run `firebase init` to initialize the project.<br>
Upon the  initializing the project you'll be asked a few questions like 
* Firebase CLI features.
* Databse rules file.
* Public directory. `dist/<your-project-name>` in this case `dist/user-management-app`.
* Configure as Single-Page-App: `y`.
* Overwite `index.html`: `n`.

5. `firebase deploy` to deploy the application 

This application is available at: <a href="https://linuxtest-b6316.web.app/" target="_blank"></a>.