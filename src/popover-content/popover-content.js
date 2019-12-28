class PopoverContent {

  constructor(options = {}) {
    this.text = options.text;
    this.results = options.results;
  }

  /**
   * Construct the popover element HTML structure.
   * @return {Text} Returns the popover content HTML.
   */
  html(){
    return `
      <button disabled class="dfn-tooltip">
        <div id="trjs-close">X</div>
        <h4>${this.text}</h4>
        <p>Another word for <strong>thesaurus</strong></p>
        <p><img src="http://i.imgur.com/G0bl4k7.png" /></p>
      </button>
    `
  }

}

export default PopoverContent;