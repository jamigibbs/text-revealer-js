# Text Revealer JS

Reveal deeper information about highlighted text on a web page. When text is highlighted, a popover displays useful details about the text such as:

- Wikipedia entries
- Dictionary definition
- ...and more to come.

## Getting Started

Install dependencies:

`npm install`

Assign Options in `src/index.js`:

```js
  const myRevealer = new TextRevealer({
    wikipedia: true,
    merriamWebsterDictionary: false
  });
```

Generate compiled script and style:

`npm run build`

Load script and stylesheet:

```html
<script type="text/javascript" src="/text-revealer-js/_global.js"></script>
<link rel="stylesheet" type="text/css" href="/text-revealer-js/_global.css">
```
