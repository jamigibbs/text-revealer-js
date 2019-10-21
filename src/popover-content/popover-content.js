class PopoverContent {

  constructor(options = {}) {
    this.text = options.text;
  }

  html(){
    return `
      <button disabled class="dfn-tooltip">
        <h4>${this.text}</h4>
        <p>Another word for <strong>thesaurus</strong></p>
        <p><img src="http://i.imgur.com/G0bl4k7.png" /></p>
      </button>
    `
  }

}

export default PopoverContent;