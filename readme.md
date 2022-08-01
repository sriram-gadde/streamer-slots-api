# Install dependencies.

Clone the project and install the libraries with the command below.
```
npm install
```

# Create the database.
Open mysql workbench on your system. And execute the following commands.
```
create database streamer_slots
```

# Creating the tables in the database.
In order to create the tables required in the database open the table-generation-commands folder and execute the database.sql file in mysql workbench.

It contais all the necessary sql code to create the tables required for the app to function. 

# Set Environment Variable
When using the app in dev-mode then put the mysql root password in the .env file otherwise while hosting put the mysql root password in the env/config variables of your hosting provider.

# Run the application
After following the previous steps, run the following command to start the application 

### For Dev Mode 
```
npm run dev
```
### For Production Mode
```
npm start
```
