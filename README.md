# OTP Inbox

OTP Inbox extracts and shows your recent email verificaiton codes directly in Raycast.

I've tested OTP Inbox with quite a few of login verification emails, but it is very likely that some emails may not be detected correctly. If you encounter any issues, please open an issue or submit a pull request.

## Features

- Automatically detects the OTP code from the email
- Shows your recent email verification codes
- Copy the code to your clipboard or paste directly into the active application
- View recent emails - incase detection fails

## Configuration

> **Note:** OTP Inbox requires you to bring your own Google client ID due to limitations within Raycast. You can create a new Google Cloud project and OAuth 2.0 client ID by following the steps below.

### Create a new Google Cloud project

1. Head over to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project by clicking on the `Select a project` dropdown in the top navigation bar and then clicking on `New Project`
3. Name your project and click `Create`

_This might take a few seconds to create the project_

### Enable the Gmail API

1. Head over to the [Gmail API](https://console.cloud.google.com/apis/library/gmail.googleapis.com) page
2. Click on `Enable` to enable the Gmail API for your project

### Create OAuth 2.0 client ID

#### Set up OAuth consent screen

1. Click on the `APIs & Services` dropdown in the left navigation bar and then click on `OAuth consent screen`
2. Select `External` and click `Create`
3. Fill in the required fields (Application name, User support email, Developer contact information, etc.) and click `Save and Continue`
4. Click on `Add or Remove Scopes` and add the following scopes:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/gmail.metadata`
5. Click `Save and Continue`
6. Click on `Add users` and add your email address you want to use with OTP Inbox
7. Click `Save and Continue` one more time
8. Click `Back to Dashboard`

#### Create OAuth 2.0 client ID

1. Click on `Credentials` in the left navigation bar
2. Click on `Create Credentials` and then `OAuth client ID`
3. Select `iOS` as the application type
4. Name your client ID and set the bundle ID to `com.raycast`
5. Click `Create`

### Add the client ID to OTP Inbox

1. Copy the client ID from the OAuth 2.0 client ID page
2. Open Raycast and run the `OTP Inbox` command
3. Input the client ID when prompted

## Contributing

Feel free to contribute to this Raycast extension. If you encounter any issues or have suggestions, please open an issue or submit a pull request.

## Credits

Icon created by Aswell Studio from Noun Project
