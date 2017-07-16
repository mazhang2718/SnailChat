# SnailPost

SnailPost is a mobile communication app designed to bring back the sense of slow, thoughtful satisfaction of snail mail, in an era where most communication is built upon instant gratification. Using this app, you are able to send images and captions to your friends and contacts, which will be delivered to them after a certain delay.

## Basic UI

![](https://github.com/mazhang2718/SnailChat/blob/master/Screen%20Shot%202017-07-16%20at%2012.31.30%20AM.png)

![](https://github.com/mazhang2718/SnailChat/blob/master/Screen%20Shot%202017-07-16%20at%2012.31.38%20AM.png)

## Project Setup

SnailPost is primarily built upon AppGyver Supersonic, which is a hybrid web-mobile framework. In order to use this app, you should first follow the instructions on the [AppGyver website](http://www.appgyver.io/steroids/getting_started) to install the Steroids Command-Line interface, as well as set up an account. Once you have done so, you can run the following instructions in the Terminal to get the project up and running:

```
git clone https://github.com/eecs394-f16/SnailChat.git
```

```
npm install
```

```
steroids update
```

```
steroids connect
```

## Usage

There are two main ways to use the app through the Supersonic framework. The first is to run the app locally by entering the following instruction: `steroids connect`. From there, a page with a QR code will show up. You will need to download the AppGyver Supersonic app from your App Store - then, once you have the app, you can scan the QR code, and the app will run.

Alternatively, you can deploy the app to my cloud. To do this, run `steroids connect` again. When the page with the QR code shows up, navigate to the "Cloud" tab, and click on the "Deploy to Cloud" button. Once you do so, a link with my cloud-deployed QR code should appear. Once again, you can use the AppGyver Scanner app to run the app from the QR code.

## Account Dependencies

SnailPost uses several other service providers to run the app.

The first is [Firebase](https://firebase.google.com/), a cloud-hosted database.
To access the Firebase cloud-hosted database through the app, the configuration needs to be set up in each script file that connects to the database. The following is a list of all scripts where this is required:
[PostController.js](https://github.com/eecs394-f16/SnailChat/blob/master/app/Feed/scripts/PostController.js)
[RegisterController.js](https://github.com/eecs394-f16/SnailChat/blob/master/app/Feed/scripts/RegisterController.js)
[MessagesController.js](https://github.com/eecs394-f16/SnailChat/blob/master/app/Feed/scripts/MessagesController.js)
[LoginController.js](https://github.com/eecs394-f16/SnailChat/blob/master/app/Feed/scripts/LoginController.js)
[IndexController.js](https://github.com/eecs394-f16/SnailChat/blob/master/app/Feed/scripts/IndexController.js)
[ContactsController.js](https://github.com/eecs394-f16/SnailChat/blob/master/app/Feed/scripts/ContactsController.js)

In each of the above mentioned scripts, the config variable needs to contain the following information. [The Firebase setup guide](https://firebase.google.com/docs/web/setup) contains more information about where to acquire the information and how to set it up.

```
var config =
  {
    apiKey: "<API_KEY>",
    authDomain: "<PROJECT_ID>.firebaseapp.com",
    databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
    storageBucket: "<BUCKET>.appspot.com",
    messagingSenderId: "<SENDER_ID>"
  }
```

The second is Cloudinary (http://cloudinary.com/), which we use for our image-uploading service. You have to sign up at Cloudinary to enable photo uploading. After signing up, you should be able to see the cloud name and enable unsigned uploading (or anything else preferred) under Settings > Upload > Upload presets. For more information, please visit http://cloudinary.com/blog/direct_upload_made_easy_from_browser_or_mobile_app_to_the_cloud

```
$.cloudinary.config({
  cloud_name: <CLOUD_NAME>
});


$('.upload_form').append($.cloudinary.unsigned_upload_tag(<UPLOAD_PRESET_NAME>, {
  cloud_name: <CLOUD_NAME>,
  tags: "browser_uploads"
}));

$scope.image = "http://res.cloudinary.com/<CLOUD_NAME>/image/upload/v1478125497/"
```

<TODO add information about cloudinary>

## Other Issues

As our app currently stands, the delay between messages is hard-coded in as a random time between 2-5 minutes. In order to change this, navigate to line 70 of [the posting script](https://github.com/eecs394-f16/SnailChat/blob/master/app/Feed/scripts/PostController.js) and change the delay to a time that is suitable for your purposes.

Currently accounts are not fully functional. They work in the sense that when you log in, information for a specific account can be seen. However, there are no controls stopping a user from editing or viewing the accounts of others. Proper account security through firebase and proper authentication still need to be set up.

For purposes of demos, the app currently contains an instant mode which ignores message delays. This should be removed for the final app.

## Team Members

1. James
2. Fahad
3. Lenny
4. Matthew


