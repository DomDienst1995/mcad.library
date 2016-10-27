# MCAD Web Audio Library 

The MCAD Web Audio Library provides a number of classes for performing common audio operations for web and mobile application development. Currently, the library includes the following classes:

  - [MCAD Pattern Scheduler](http://drjferraris.github.io/mcad.library/doc/Scheduler.html)
  - [MCAD Buffer Loader](http://drjferraris.github.io/mcad.library/doc/BufferLoader.html)
  - [MCAD Utility Functions](http://drjferraris.github.io/mcad.library/doc/mcad.html)
  - [MCAD Rotary Widget](http://drjferraris.github.io/mcad.library/doc/Rotary.html)
  - [MCAD Multi-Stage Envelope](http://drjferraris.github.io/mcad.library/doc/mseg.html)
  
For further information, please read the [documentation](http://drjferraris.github.io/mcad.library/doc/index.html).

## **Usage**

There are two ways to include the MCAD library files in your projects: from the online CDN or from a local copy.

#### **Including from the online CDN**

This method includes the library files from the online content delivery network. This is the easiest way to include the library files as the source file paths are always the same regardless of your app folder structure and you are guaranteed to be using the latest version of the library. However, as the CDN is online, you must be connected to the internet. This is ideal for developing your web apps but when developing mobile or on an offline web apps you will need to use a local copy otherwise your app will require an internet connection to function.

Copy and paste the appropriate `script` tag(s) below into your HTML document's `head` section for the library component(s) you wish to use:

##### **Pattern Scheduler**

```html
<script src="http://drjferraris.github.io/mcad.library/src/mcad.pattern.scheduler.v1-0.js"></script>
```

##### **Buffer Loader**

```html
<script src="http://drjferraris.github.io/mcad.library/src/mcad.buffer.loader.v1-0.js"></script>
```

##### **Utility Functions**

```html
<script src="http://drjferraris.github.io/mcad.library/src/mcad.utility.v1-0.js"></script>
```

##### **Rotary Widget**

```html
<script src="http://drjferraris.github.io/mcad.library/src/mcad.rotary.v1-0.js"></script>
```

##### **Multi-Stage Envelope**

```html
<script src="http://drjferraris.github.io/mcad.library/src/mcad.mseg.v1-0.js"></script>
```

#### **Including from a local copy**

Including the library files from a local copy of the MCAD library files is marginally more difficult than via the CDN but if you follow the steps carefully you shouldn't have any problems. 

First of all, you will need to:

1. [Download](https://github.com/drjferraris/mcad.library/zipball/master) the .zip archive
2. Extract the archive to somehwere convenient on your hard drive
3. Copy the javascript files from the MCAD library's `src` folder to somewhere in your app's folder

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
                mcad.buffer.loader.v1-0.js
                mcad.mseg.v1-0.js
                mcad.pattern.scheduler.v1-0.js
                mcad.rotary.v1-0.js
                mcad.utils.v1-0.js
</pre>

Here, we can see that the app is in a folder called "MyApp" and the `index.html` resides in the root of this folder. The stylesheet for this app is called `style.css` and is located in a subfolder called `css`. Likewise, the javascript file `script.js` is located in a subfolder called `js`. The library files for this app are further located in a subfolder called `lib`. Specifically, the MCAD library files are located in a folder called `mcad` inside the `lib` folder.

With this in mind, the `script` tags to include the appropriate MCAD library components for this example's `index.html` are as follows (**note:** your app's folder may be different):

##### **Pattern Scheduler**

```html
<script src="js/lib/mcad/mcad.pattern.scheduler.v1-0.js"></script>
```

##### **Buffer Loader**

```html
<script src="js/lib/mcad/mcad.buffer.loader.v1-0.js"></script>
```

##### **Utility Functions**

```html
<script src="js/lib/mcad/mcad.utility.v1-0.js"></script>
```

##### **Rotary Widget**

```html
<script src="js/lib/mcad/mcad.rotary.v1-0.js"></script>
```

##### **Multi-Stage Envelope**

```html
<script src="js/lib/mcad/mcad.mseg.v1-0.js"></script>
```