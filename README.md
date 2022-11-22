# NavKeys
 Make your website navigatable by arrow keys
 
## Table of Contents
 * [Installation](#installation)
    * [NodeJs](#nodejs)
    * [CDN](#cdn)
    * [Manual browser bundling](#manual-browser-bundling)
 * [Usage](#usage)
    * [Basic usage](#basic-usage)
    * [Options](#options)
       * [Default options](#default-options) 
    * [Modes](#modes)
       * [Auto mode](#auto-mode)
       * [Manual mode](#manual-mode)
       * [Mixed mode](#mixed-mode)
    * [Styling](#styling)
       * [:focus Styling](#focus-styling)
       * [useClass Styling](#useclass-styling)
 * [API](#api)
 * [Proudly sponsored by](#proudly-sponsored-by)

## Installation

### NodeJs
To install NavKeys into a NodeJs project, run the command `npm install navkeys`

### CDN
To include NavKeys directly in a HTML file, include `script` in your HTML file

### Manual browser bundling
If you wish to compile navkeys.js for browser manually, run the `compile_for_browser.bat` file, which will create a browser supported bundle in the `/dist` folder, which you can then include in your HTML using `<script>` tags. **You need *rollup.js* installed globally for the .bat file to work!**

## Usage

### Basic usage
To use this library, simply create a new instance of the NavKeys class, and pass options to it. If there are no options passed, or some options are omitted, then [default options](#default-options) will be used. *It is important that you create the instance after the DOM has been loaded*, otherwise the library won't be able to map the elements.
Example code:
```
 window.onload = () {
   const options = {
     mode: "auto"
   }
   
   const navKeys = new NavKeys(options);
 }
```

### Options

#### Default options

### Modes

#### Auto mode

#### Manual mode

#### Mixed mode

### Styling
There are two ways you can style focused elements, depending on which value you passed to the `useClass` option.

#### :focus Styling
If you set `useClass` option to `false`, then styling elements can be done by applying the `:focus` selector to target CSS classes.
For example, to apply focus style to all `<p>` elements, add the following code to your CSS:
```
p:focus{
  background-color: gray;
}
```
This will make your `<p>` elements have a gray background when they are focused.

#### useClass Styling
If you specified a string value to the `useClass` option, then you can create a CSS class that is the value of the `useClass` option, and styles from this class will apply to the focused elements.
For example, if you set the `useClass` value to `focused-class`, then in your CSS you can add the following code:
```
.focused-class{
  background-color: gray;
}
```
When an element gets focused, the specified class will be applied to it.

//## API

## Proudly sponsored by
*Empty...*
