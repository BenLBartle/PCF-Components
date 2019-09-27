# PCF-Components

Here is a collection of components I have created using the [PowerApps Component Framework](https://docs.microsoft.com/en-us/powerapps/developer/component-framework/overview). These are just examples of what can be done usig the currently available tools. Big thanks to Andrew Ly ([@365lyf](https://twitter.com/365lyf)) for the sample code and [Josh Hetherington](https://www.linkedin.com/in/josh-hetherington-95837382/) for the inspiration.

## Pre-requisites 

In order to build and deploy these to your CDS instance you'll need the following:

- [NodeJS & npm](https://nodejs.org/en/)
- [The PCF CLI](https://docs.microsoft.com/en-us/powerapps/developer/component-framework/create-custom-controls-using-pcf)
- Either:
    - [Visual Studio Code](https://code.visualstudio.com/) (with [.NET Core SDK](https://dotnet.microsoft.com/download))
    - [Visual Studio](https://visualstudio.microsoft.com/) (2017 or later)

If you want to deploy this and test it you'll obviously need some sort of PowerApps/Dynamics 365 license and instance. Grab a trial from [here](https://trials.dynamics.com/).

## Building & Debugging

Once you've grabbed the code, navigate to the correct folder for the component you want, and run the following command from the terminal:

```shell
npm install
```

This will install all the dependencies (and make take a minute or two). Then run:

```shell
npm run start
```

This should bootstrap the component and run the harness to allow you to see the component running and debug if required.

# Components

## SpeechToText

![alt text](https://raw.githubusercontent.com/BenLBartle/PCF-Components/master/SpeechToText.png "Speech To Text Screenshot")

This is a component that uses the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API) to allow real-time text recognition to a CDS text field. This control supports the following CDS Field types:

- SingleLine.Text
- SingleLine.TextArea
- Multiple

It has no parameters.

> **Note**: Due to the delay of the Web Speech API being implemented in browsers, only Chrome supports this control OOTB. I believe Firefox can be configured to turn this on, but YMMV.

> ***More Important Note***: Currently Chrome will submit your audio for regognition to a server side API. This is abstracted from you and I have no idea where it is or whether it could change without notice. This also means it won't work offline.

### Usage
Once you've added this control to your field, it will appear as a standard multi-line text field but with the addition of a button above the `textarea`. If you click this button you will be prompted for permission to use your microphone, and once you've clicked 'Allow' it will start automatically recording what you say. After a period of time it will stop listening and the button will change back to its original state.

## D365 Presence

This is a control that uses a ASP.NET Core SignalR service to provide real-time communication to allow the presence of other users on records you're viewing to be shown using an [Office UI Fabric Facepile](https://developer.microsoft.com/en-us/fabric#/controls/web/facepile).

This contains two folders, `Client`; which contains the PCF control and `Server` which contains a very *very* basic example of a SignalR service that could be used. This is very very beta and is basically there to act as a starter for ten as to how people would want to use it. It doesn't cover things such as secure authentication, as everyones requirements may be different.

The SignalR service is a single `Hub` class which acts on connections and disconnections only and routes notifications out to the clients. At the moment it is persisting the current state of connected clients to a record as a static property of the class, this is obviously not optimal but is just there to illustrate the principle. Luckily this hub doesn't need to persist anything other than guids, so no personal data is stored outside of CDS.

The control is currently bound to a single line of text field, but obviously this could be anything, and has a single parameter to take the SignalR Hub Url. From my experience the best place to include this is in the header.

The maximum number of personas in the facepile can be configured, as well as the background colour of the initials icon (if the user has no photo).

Currently the control will **not** show the current user in the connected users control, this behaviour can obviously be changed if required.

### Todo

- Investigate how to secure communication between client and server using Azure Functions.
- Come up with some ideas of how to better handle the situation where one user connects to the same record multiple times (although this is likely a very edge case)
- Investigate whether an event can be bound to the IsDirty property (do we get this in the PCF context?) to see if we can see who is actively editing and not just viewing
- Better packaging, tests, documentation