# ShopScrap
Don't let the name fool you, I'm not shopping for scrap, I'm rather scraping shops here 😉

This is a side project of mine, written entirely in Javascript, which explores the possibility of creating a small product search engine (which just searches for one product across multiple sites) using web scraping.

It consists of an app, written in React Native, and a node server, which parses sites. The user will be required to enter a search query in the app, and the search results will be displayed in the app as well. 
ShopScrap, is in no way, intended to be deployed at scale anywhere. This is just a fun side project.

I am currently only using shopping websites from the UAE since I've found them to change their source code rarely (which favours scraping). But do note that this project can be easily modified to include almost any website that has a search option.

## Problem

You might already know that search engines use tricks like crawling and indexing to display search results. It might also include the use of trackers and the results might be contaminated due to various marketing and promotional agents working behind the scenes. For instance, if you search for a product on Google, you might see a bunch of ads along with the results. Even Amazon's own search results promote various products.

ShopScrap aims to deliver a clean search result just by scraping the results off of various seller websites, sorting them and giving them to you.

## Challenges
These are the main challenges ShopScrap faces:
* Web scraping in itself, is extremely slow
* Javascript as a language is slow too
* Seller websites might change their source code frequently, and since web scraping relies on the HTML source of the webpage, it is hard to maintain the functionality as time passes
* The results being displayed on seller websites will surely include thousands of irrelevant ones too. It is hard to sort out the relevant ones the user wants

This project aims to solve these challenges gradually, if possible in the first place 😅

## Installation (server)
Regardless of your method of choice to use the app, you have to install and run the node server, as this is the actual web scraper.
### Prerequisites
* A computer with [NodeJS](https://nodejs.org) installed. On Linux, it would be enough to run `apt install nodejs npm`.
* Basic knowledge to use [git](https://git-scm.com)
* [ADB](https://www.xda-developers.com/install-adb-windows-macos-linux/) (Optional), in case you're having connection issues
### Steps
1. Clone this repo to your machine

    ```
    git clone https://github.com/vishalkrishnads/ShopScrap.git
    ```
2. Go to the `server` directory, `cd ShopScrap/server`
3. Install dependencies

    ```
    npm install
    ```
4. Start the server

    ```
    node server.js
    ```
5. If your android device or emulator fails to connect to the server and throws an error, try reversing its port 3000 before opening any issues

    ```
    adb reverse tcp:3000 tcp:3000
    ```

**TIP**: The server uses Chromium by default. If you want to use Firefox, modify the start command like so:

```
node server.js firefox
```

## Installation (app)
If you don't plan on editing the app's code and playing around with it, then you would be better off with installing the apk of the latest release from the [releases page](https://github.com/vishalkrishnads/ShopScrap/releases).

Instead, if you're that geek who wants to play with the app, install it by following the steps.
### Prerequisites
* A PC with [React Native](https://reactnative.dev) development environment set up. Follow the steps listed under the **React Native CLI Quickstart** tab [here](https://reactnative.dev/docs/environment-setup) to setup.
* [ADB](https://www.xda-developers.com/install-adb-windows-macos-linux/) installed and running.
* Knowledge in JS is recommended if you wanna edit the app. Take [this tutorial](https://www.w3schools.com/js/js_intro.asp) if you need a quick recap.
* A cup of coffee (I mean, patience😁)
### Steps
1. Create a new React Native project ShopScrap with `react-native` version 0.63.4

    ```
    npx react-native init ShopScrap --version 0.63.4
    ```
2. Change the working directory like so `cd ShopScrap`
3. With a physical device or emulator connected via adb, verify that the sample app runs first

    ```
    npx react-native run-android
    ```
    If it does and you see the *Welcome to React Native* greeting, proceed to get the source code.
4. Intialize an empty Git repository

    ```
    git init
    ```
5. Add this repository as origin

    ```
    git remote add origin https://github.com/vishalkrishnads/ShopScrap.git
    ```
6. Delete the conflicting files

    ```
    # Linux
    $ rm App.js index.js README.md package.json package-lock.json .eslintrc.js .gitignore .gitattributes app.json

    # Windows
    del App.js index.js README.md package.json package-lock.json .eslintrc.js .gitignore .gitattributes app.json
    ```
7. Pull the source

    ```
    git remote pull origin main
    ```
8. Install dependencies

    ```
    npm install
    ```
9. Link the icons module

    ```
    npx react-native link react-native-vector-icons
    ```
10. Build and run the app

    ```
    npx react-native run-android
    ```
Happy coding!!

## Wrapping up
ShopScrap tries to address and solve the challenges mentioned earlier in this documentation. But this is currently riddled with bugs everywhere. Hence, any PR's to improve the existing scraping, searching & sorting algorithms are welcome. 

I am also thinking about migrating the project entirely to Kotlin, eventually eliminating the need for a separate server and making it a standalone app. Any developments regarding this will be made in a separate branch in the future. So, if you're well versed in making Android apps with Kotlin, hit me up if you're ready to help.