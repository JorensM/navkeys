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
Styling focused element is very simple, because the library adds tabindex attribute to all the nav elements, so you can use the `:focus` selector to apply focus styles. For example, to apply focus style to all `<p>` elements, use this selector in your CSS - `p:focus { }`.
