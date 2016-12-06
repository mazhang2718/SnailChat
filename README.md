# SnailPost

SnailPost is a mobile communication app designed to bring back the sense of slow, thoughtful satisfaction of snail mail, in an era where most communication is built upon instant gratification. Using this app, you are able to send images and captions to your friends and contacts, which will be delivered to them after a certain delay.

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

Alternatively, you can deploy the app to the cloud. To do this, run `steroids connect` again. When the page with the QR code shows up, navigate to the "Cloud" tab, and click on the "Deploy to Cloud" button. Once you do so, a link with the cloud-deployed QR code should appear. Once again, you can use the AppGyver Scanner app to run the app from the QR code.

## Account Dependencies

SnailPost uses several other service providers to run the app.

The first is [Firebase](https://firebase.google.com/), a cloud-hosted database.

The second is Cloudinary, which we use for our image-uploading service.

TODO: State how to set up accounts and insert config keys.

## Other Issues

As our app currently stands, the delay between messages is hard-coded in as a random time between 2-5 minutes. In order to change this, navigate to line 70 of [the posting script](https://github.com/eecs394-f16/SnailChat/blob/master/app/Feed/scripts/PostController.js) and change the delay to a time that is suitable for your purposes.

## Team Members

1. James
2. Fahad
3. Lenny
4. Matthew


