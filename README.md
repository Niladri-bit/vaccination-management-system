# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `Build & Run the Frontend`
Using VSCode
•	Open vaccination-management-system in VSCode.
•	Open terminal
•	Please ensure you have nodejs installed in your system
•	Open the terminal and type npm start and hit enter
 
•	It should open the browser and open the login page for vaccination management system
 
•	Open postman and hit the register api as mentioned earlier by creating a proper payload .
Currently this option is not available in UI so you have to do it in postman.
This is only for admins and hence registering will give you admin priviledges which means you can access everything in UI.
 
 API - http://localhost:8080/auth/register
 {
	"userName": "chayan",
	"email":"chayan@gmail.com",
	"password" : "1234",
	"firstName" : "chayan",
	"lastName":"mathur",
	"address":"kolkata joka"
}

Before hitting the api ,ensure you have started the user service backend in eclipse.
 
•	Use the same username and password to login in the system. Once you enter the correct username and password and press login it should open the dashboard.
 


