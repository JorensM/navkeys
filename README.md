# NavKeys
 Make your website navigatable by arrow keys

## Installation

### NodeJs
To install NavKeys into a NodeJs project, run the command `npm install navkeys`

### CDN
To include NavKeys directly in a HTML file, include `script` in your HTML file

### Manual browser bundling
If you wish to compile navkeys.js for browser manually, run the `compile_for_browser.bat` file, which will create a browser supported bundle in the `/dist` folder, which you can then include in your HTML using `<script>` tags. **You need *rollup.js* installed globally for .bat file to work!**

## Usage

### Basic usage
```
 window.onload = () {
   const options = {
     mode: "auto"
   }
   const navKeys = new NavKeys(options);
 }
```

### Options

### Auto mode

### Manual mode

### Mixed mode

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

## Proudly sponsored by
*Empty...*
