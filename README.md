# OH Business Apps Node Starter

## Getting Started

### Step 1

Clone the repo

### Step 2

Register an app via https://apps.dev.microsoft.com.  Add User.Read Graph permisions.

### Step 3

Edit config/default.json and set ```microsoftAppId```, ```microsoftAppPassword``` to the App Id and App Password from Step 2.

### Step 4

From the command line call ```npm run ngrok```.  This will start ngrok and modify the manifest to include the ngrok uri.  Copy the printed ngrok uri.

### Step 5

Register a bot via https://dev.botframework.com/bots/new.  For messaging endpoint use:  ```<NGROKURI>/api/messages```  Replace ```<NGROKURI>``` with the ngrok uri from step 4 and the app id from step 2.

### Step 6

From the command line call ```npm run start```.  This will start the app.

### Step 7

Create a new team via https://teams.microsoft.com

### Step 8

Add the app to teams by uploading the package.zip in the build directory via the custom app function via the steps found in https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/apps/apps-upload

### Step 9

Invoke the bot in a channel by starting a thread with the text @ followed by the sort name of the bot you configured in step 5.

## Step 10

Add the custom tab by adding the app from the add tab dialog in a channel.

## Step 11

If you make a code change or have restarted ngrok, kill the process from Step 6.  Call ```npm run start``` from a command prompt to run again.

## Step 12

If you need to restart ngrok, call ```npm run ngrok``` from a command prompt.  Copy the printed ngrok uri.  Modify your bot registration via https://dev.botframework.com/bots, setting the messaging endpoint to:  ```<NGROKURI>/api/messages``` replacing ```<NGROKURI>``` with the ngrok uri.  Save your changes.  Restart the app, follow step 11.
