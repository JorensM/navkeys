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
       * [mode](#mode)
       * [useClass](#useclass)
       * [keys](#keys)
       * [autoElements](#autoelements)
       * [comboKey](#combokey)
       * [unfocusKey](#unfocuskey)
       * [Default options](#default-options) 
    * [Modes](#modes)
       * [Auto mode](#auto-mode)
       * [Manual mode](#manual-mode)
       * [Mixed mode](#mixed-mode)
    * [Styling](#styling)
       * [:focus Styling](#focus-styling)
       * [useClass Styling](#useclass-styling)
 * [Proudly sponsored by](#proudly-sponsored-by)

## Installation

### NodeJs
To install NavKeys into a NodeJs project, run the command `npm install navkeys`

### CDN
To include NavKeys directly in a HTML file, include `script` in your HTML file

### Manual browser bundling
If you wish to compile navkeys.js for browser manually, run the `compile_for_browser.bat` file, which will create a browser supported bundle in the `/dist` folder, which you can then include in your HTML using `<script>` tags. **You need [rollup.js](rollupjs.org) installed globally for the .bat file to work!**

## Usage

### Basic usage
To use this library, simply create a new instance of the NavKeys class, and optionally(pun intended) pass options to it. **It is important that you create the instance after the DOM has been loaded**, otherwise the library won't be able to map the navigatable elements.
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
Optionally, an options object can be passed to the NavKeys constructor. If no options are specified, or some are omitted, then the [default options](#default-options) will be used. Below is a list of all options

##### mode
This option is used to select which [mode](#modes) to run the library in. Possible values are - `"auto"`, `"manual"`, `"mixed"`

##### useClass
This option is used to select which type of styling the library will use.If you pass `false` to it, `:focus` styling will be used. If you pass a string value, then the class with the name of that value will be applied to focused elements. See the [Styling section](#styling) for more info.

##### keys
This option lets you set custom keys for navigation. Should be an object containing the following properties - `up`, `down`, `left`, `right`. Each of the properties should be a number representing the keycode for the respective nav direction.

##### autoElements
In auto/mixed modes, specifies the selectors that will be added as navigatable elements. Should be an array of strings, each of the strings being a CSS selector.

##### comboKey
If this key is set, navigation will only work when it is held down. Should be a number representing a keycode. Set to `false` to disable.

##### unfocusKey
If this key is set, currently focused element will blur on press. Should be a number representing a keycode. Set to `false` to disable

#### Default options
These are the default options. If an option is not specified when creating a NavKeys instance, default option will be used.
```
default_options = {
        mode: this.constants.mode.auto,
        autoElements: ["a", "button", "p", "li"],
        keys: {
            up: 38,
            down: 40,
            left: 37,
            right: 39
        },
        useClass: false,
        comboKey: false,
        unfocusKey: false
    }
```

### Modes
There are 3 possible modes for NavKeys - **Auto** mode, **Manual** mode, and **Mixed** mode. Each one has their own advantages and disadvantages, and should be used depending on how your website is structured.

#### Auto mode
In this mode, navigatable elements will be determined based on the CSS selectors passed to the `autoElements` option. This mode is best suited if your website has a repetitive structure and if the navigatable elements can be easily defined with CSS selectors

#### Manual mode
In this mode, navigatable elements will be those elements that have the attribute `navkeys` set to them. This mode is best suited if your website has unique, complex elements that are difficult to define using CSS selectors.

#### Mixed mode
This mode will have both manual and auto modes enabled. This mode is best suited if your website has a mix of repetitive structure as well as unique elements.

### Styling
There are two ways you can style focused elements, depending on which value the `useClass` option is set to.

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
For example, if you set the `useClass` value to `"focused-class"`, then in your CSS you can add the following code:
```
.focused-class{
  background-color: gray;
}
```
When an element gets focused, the specified class will be applied to it.

## Proudly sponsored by
*Empty...*

<sup>To become a sponsor, kindly contact me at [jorensmerenjanu@gmail.com](mailto:jorensmerenjanu@gmail.com)</sup>
