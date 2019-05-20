# PCF-Components

Here is a collection of components I have created using the [PowerApps Component Framework](https://docs.microsoft.com/en-us/powerapps/developer/component-framework/overview). These are just examples of what can be done usig the currently available tools. Big thanks to Andrew Ly ([@365lyf](https://twitter.com/365lyf)) for the sample code.

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