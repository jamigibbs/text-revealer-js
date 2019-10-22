import axios from 'axios';

import Wikipedia from '../wikipedia/wikipedia';
import MerriamWebsterDictionary from '../merriam-webster-dictionary/merriam-webster-dictionary';
import PopoverContent from '../popover-content/popover-content';

const DEFAULT_APPROVED_TAGS = ['div','p','span','h1','h2','h3','h4','h5','h6','header','li','a','pre'];
const DEFAULT_DISABLED_TAGS = ['input', 'textarea','code'];

class TextRevealer {

  constructor(options = {}) {
    this.delay = options.delay || 500;
    this.scrollIntoView = options.scrollIntoView || true;
    this.approvedTags = options.approvedTags || DEFAULT_APPROVED_TAGS;
    this.wikipedia = options.wikipedia || false;
    this.merriamWebsterDictionary = options.merriamWebsterDictionary || false;

    this.disabledTags = DEFAULT_DISABLED_TAGS
    this.text = null;
    this.targetTag = null;
  }

  init() {
    window.addEventListener('load', () => {
      /**
       * Getting the target element type to check it against approved and 
       * disabled tags. ie. input
       */
      document.body.addEventListener('click', (event) => {
        this.targetTag = event.target.localName;
      });
      /**
       * Binding the mouseup event to capture selected or highlighted text.
       */
      document.onmouseup = this.debounced(this.delay, this.handleTextReveal.bind(this));
      if (!document.all) document.captureEvents(Event.MOUSEUP);

    });
  }

  /**
   *  Delay execution of provided function.
   * @param {number}    Timeout value.
   * @param {function}  Callback after timout has completed.
   * @return {function} Returns callback.
   */
  debounced(delay, fn) {
    let timerId;
    return function (...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn(...args);
        timerId = null;
      }, delay);
    }
  }

  /**
   * Fetching data from various APIs with the selected string. Combining the routes into
   * a single Axios request.
   * @param {Object}     options.searchText
   * @return {Object}  Data from axios get requests.
   */
  handleFetch(options = {}) {
    return new Promise((resolve, reject) => {
      const routes = [];

      if (this.wikipedia) {
        const wikiRoute = Wikipedia.searchRoute(options.searchText);
        routes.push(axios.get(wikiRoute));
      };

      if (this.merriamWebsterDictionary) {
        const dictionaryRoute = MerriamWebsterDictionary.searchRoute({
          searchText: options.searchText,
          key: this.merriamWebsterDictionary
        });
        routes.push(axios.get(dictionaryRoute));
      }

      return axios.all(routes)
        .then((data) => {
          const content = {};
          /**
           * Constructing returned data into an object with the API domain name as the key.
           * ie. { 'en.wikipedia.org': [], 'www.dictionaryapi.com': [] }
           */
          data.forEach((api) => {
            const key = (new URL(api.config.url)).hostname;
            content[key] = api.data;
          });
          
          resolve(content);
        })
        .catch((error) => reject(error));
    })
  }

  /**
   * Getting the selected text string, fetching the API results, and displaying the popover.
   */
  handleTextReveal() {
    /**
     * Only firing if there is a text selection or the selected text is not within a disabled tag type. ie. input field.
     */
    const isDisabledTag = this.disabledTags.find((tag) => tag == this.targetTag);
    if (this.text || isDisabledTag) return;

    try {
      this.text = (document.all) ? document.selection.createRange().text : document.getSelection().toString();

      if (this.text) {
        this.handleFetch({ 
          searchText: this.text
        }).then((results) => {
          console.log('results', results);
          this.displayPopover();
        }).catch((error) => console.log('myRevealer error', error));
      }

    } catch(error) {
      console.log('selection error: ', error);
    }

  };

  /**
   * Construct the popover element and add it to the DOM.
   */
  displayPopover(){
    const span = document.createElement("span");
    span.classList.add('trjs');
    span.tabIndex = '-1';

    const popover = document.createElement('dfn');
    popover.title = this.text;
    popover.innerHTML = new PopoverContent({ text: this.text }).html();

    if (window.getSelection) {
      const sel = window.getSelection();
      
      const parentTag = sel.anchorNode.parentElement.nodeName.toLowerCase();
      const isApprovedTag = this.approvedTags.find((tag) => tag === parentTag);

      if (isApprovedTag && sel.rangeCount) {

        const range = sel.getRangeAt(0).cloneRange();
        range.surroundContents(span);

        sel.removeAllRanges();
        sel.addRange(range);

        span.innerHTML = '';
        span.appendChild(popover);

        if (this.scrollIntoView) {
          span.scrollIntoView({ behavior: "smooth" });
        }

        document.getElementById('trjs-close').addEventListener('click', this.closePopover.bind(this));
        
      }
    }

  }

  /**
   * Remove the popover element from the DOM and replace with the selected text.
   */
  closePopover(){
    const textRevealerEl = document.querySelector('.trjs');
    textRevealerEl.parentNode.replaceChild(document.createTextNode(this.text), textRevealerEl);
    
    this.text = null;
    this.targetTag = null;
  };

}

export default TextRevealer;