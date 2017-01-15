# MCAD Web Audio Library 

The MCAD Web Audio Library provides a number of classes for performing common audio operations for web and mobile application development. Currently, the library includes the following classes:

  - [MCAD Pattern Scheduler](http://drjferraris.github.io/mcad.library/doc/Scheduler.html)
  - [MCAD Buffer Loader](http://drjferraris.github.io/mcad.library/doc/BufferLoader.html)
  - [MCAD Utility Functions](http://drjferraris.github.io/mcad.library/doc/mcad.html)
  - [MCAD Rotary Widget](http://drjferraris.github.io/mcad.library/doc/Rotary.html)
  - [MCAD Multi-Stage Envelope](http://drjferraris.github.io/mcad.library/doc/Mseg.html)
  
For further information, please read the [documentation](http://drjferraris.github.io/mcad.library/doc/index.html).

## **Debug & Release Builds**

There are two builds of this library in the `dist` folder that you can use in the development of your apps: **Debug** and **Release**. Both builds contain concatenated and compressed versions of the individual source files that make up this library so are not easily human readable. However the `src` folder contains the fully commentated source files for each module in this library.

##### **Debug Build**

The classes and functions in the Debug build make use of the different `console` outputting methods to give you real-time information and feedback about the configuration and operations. Use this build for development to help you track down bugs and errors in your code.

###### *Debug Levels*

You can set the amount of log calls the libary outputs to the console by declaring a variable called `MCAD_DEBUG` at the top of your script and assigning it a number from `0` to `2`. If you don't explicitly specify the debug level like this, the default is `0`.

The different debug levels are as follows:

* `0`: Output basic information such as constructors and certain method calls
* `1`: Output more detailed information including supplied function arguments, etc.
* `2`: Output very detailed information including low-level operations

##### **Release Build**

The Release build has all `console` commands stripped out for performance reasons so will give you no feedback on the configuration and operations of the library. It is reccomended that you switch to the Release build when you are ready to distribute your app. 

## **Usage**

There are two ways to include the MCAD library files in your projects: from the online CDN or from a local copy.

#### **Including from the online CDN**

This method includes the library files from the online content delivery network. This is the easiest way to include the library files as the source file paths are always the same regardless of your app folder structure and you are guaranteed to be using the latest version of the library. However, as the CDN is online, you must be connected to the internet. This is ideal for developing your web apps but when developing mobile or on an offline web apps you will need to use a local copy otherwise your app will require an internet connection to function.

Copy and paste the appropriate `script` tag below into your HTML document's `head` section for the build you wish to use:

##### **Debug Build**

```html
<script src="https://drjferraris.github.io/mcad.library/dist/mcad.library.v1-0.min-d.js"></script>
```

##### **Release Build**

```html
<script src="https://drjferraris.github.io/mcad.library/dist/mcad.library.v1-0.min.js"></script>
```

#### **Including from a local copy**

Including the library files from a local copy of the MCAD library files is marginally more difficult than via the CDN but if you follow the steps carefully you shouldn't have any problems. 

First of all, you will need to:

1. [Download](https://github.com/drjferraris/mcad.library/zipball/master) the .zip archive
2. Extract the archive to somewhere convenient on your hard drive
3. Copy the javascript files from the MCAD library's `dist` folder to somewhere in your app's folder

Below is an example of a fairly typical web/Cordova app folder structure:

<pre>
D:\MYAPP
|   index.html
|
+---css
|       style.css
|
+---js
    |   script.js
    |
    +---lib
        +---jquery
        |       jquery.js
        |
        +---mcad
                mcad.library.v1-0.min.js
				mcad.library.v1-0.min-d.js
</pre>

Here, we can see that the app is in a folder called "MyApp" and the `index.html` resides in the root of this folder. The stylesheet for this app is called `style.css` and is located in a subfolder called `css`. Likewise, the javascript file `script.js` is located in a subfolder called `js`. The library files for this app are further located in a subfolder called `lib`. Specifically, the MCAD library files are located in a folder called `mcad` inside the `lib` folder.

With this in mind, the `script` tags to include the appropriate MCAD library files for this example's `index.html` are as follows (**note:** your app's folder may be different):

##### **Debug Build**

```html
<script src="js/lib/mcad/mcad.library.v1-0.min-d.js"></script>
```

##### **Release Build**

```html
<script src="js/lib/mcad/mcad.library.v1-0.min.js"></script>
```