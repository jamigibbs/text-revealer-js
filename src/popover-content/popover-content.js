function PopoverContent(options = {}) {

  this.text = options.text;
  this.results = options.results;

  return {
    /**
     * Construct the popover element HTML structure.
     * @return {Text} Returns the popover content HTML.
     */
    html: () => {
      return `
        <button disabled class="dfn-popover">
          <div id="trjs-close">X</div>
          <h4 class="trjs__header">${this.text}</h4>
          <p>Laboris minus velit, blanditiis malesuada curabitur consequat aliqua mollit ipsam! Tortor debitis, earum, augue ipsam cupiditate maecenas dictum diam viverra aliquip facere dolores platea, blandit, mi auctor quasi anim laudantium.</p>
        </div>
      `
    }
  }

}

export default PopoverContent;