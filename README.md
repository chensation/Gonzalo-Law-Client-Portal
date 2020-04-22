# Gonzalo Law Client Portal #
The website is a client portal designed to host infromation for the clients and employees. The webiste has a user facing side designed for clients to recieve information and an administrative side controlled by the company that is used to transfer information to the client.

## Features ##

### User System ###
* Able to register for a user
* Able to reset password via email
* Admin able to remove a client
### Projects ###
* Admin able to create new project for clients
* Admin able to update the phase of a project
* Admin able to remove projects from a client
### File (google cloud storage) ###
* Able to upload files to specific projects
* Able to download files.
* Admin can delete files.Calendar (google calendar)
* Admin able to add events 
### Payment ###
* Client able to navigate to payment system from menu

## How to run locally

* Follow the structure in example.config.js (client), example.config.js (server), and client_secret_test_example.json (server) to set up the configuration variables in each file.<br/>
  * Rename these files to config.js, config.js, and client_secret_test.json, respectively.<br/>
* Run `npm install` from the root and client directory. <br/>
* Finally, run `npm run dev` from the root directory, which will launch both the frontend and backend.<br/>
