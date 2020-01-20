# Text Revealer JS

Reveal deeper information about highlighted text on a web page. When text is selected, a popover displays useful details about the text such as:

- Wikipedia entries
- Dictionary definition
- ...and more to come.

[https://jamigibbs.github.io/text-revealer-js/](https://jamigibbs.github.io/text-revealer-js/)

<img src="preview.gif" alt="Preview" width="700"/>

## Getting Started

Install dependencies:

`npm install`

Generate compiled script and style:

`npm run build`

Load script and stylesheet:

```html
  <link href="text-revealer.css" rel="stylesheet">
  <script src="text-revealer.js"></script>
```

Assign options and initialize the script:

```js
  const myTextRevealer = new TextRevealer({ 
    wikipedia: true,
    merriamWebsterDictionary: false,
    delay: 500,
    scrollIntoView: true
  });

  myTextRevealer.init();
```

## Usage with Witchcraft 

[Witchcraft](https://luciopaiva.com/witchcraft/) is a Google Chrome extension for loading custom Javascript and CSS directly from a folder in your file system and injecting them into pages.

You can use Witchcraft to load this script across all sites while you're browsing the web. To do that, install the Witchcraft extension, follow their [installation instructions](https://luciopaiva.com/witchcraft/how-to-install.html), and rename the following file:

`text-revealer.css` to `_global.css`

Then create a file called `_global.js` and add to it the following (where you can customize the settings however you'd like):

```js
  // @include text-revealer.min.js

  const myTextRevealer = new TextRevealer({ 
    wikipedia: true,
    merriamWebsterDictionary: false,
    delay: 500,
    scrollIntoView: true
  });

  myTextRevealer.init();
```
