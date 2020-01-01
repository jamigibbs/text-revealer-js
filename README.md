# Text Revealer JS

Reveal deeper information about highlighted text on a web page. When text is highlighted, a popover displays useful details about the text such as:

- Wikipedia entries
- Dictionary definition
- ...and more to come.

## Getting Started

Install dependencies:

`npm install`

Generate compiled script and style:

`npm run build:rollup`

Load script and stylesheet:

```html
    <link href="text-revealer.css" rel="stylesheet">
    <script src="text-revealer.js"></script>
```

Assign options and initalize the script:

```js
  const myTextRevealer = new TextRevealer({ 
    wikipedia: true,
    merriamWebsterDictionary: false,
    delay: 500,
    scrollIntoView: true
  });

  myTextRevealer.init();
```
