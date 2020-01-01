//import axios from 'axios';
import '../scss/_global.scss';

import DOMPurify from 'dompurify';
import Wikipedia from '../wikipedia/wikipedia';
import MerriamWebsterDictionary from '../merriam-webster-dictionary/merriam-webster-dictionary';
import PopoverContent from '../popover-content/popover-content';

const DEFAULT_APPROVED_TAGS = ['div','p','span','h1','h2','h3','h4','h5','h6','header','li','a','pre'];
const DEFAULT_DISABLED_TAGS = ['input', 'textarea','code'];

function TextRevealer(options = {}) {
  
  this.options = options = Object.assign({}, options);

  let defaults = {
    delay: 500,
    scrollIntoView: true,
    approvedTags: DEFAULT_APPROVED_TAGS,
    disabledTags: DEFAULT_DISABLED_TAGS,
    wikipedia: false,
    merriamWebsterDictionary: false
  }

  // Set default & user options
	for (let name in defaults) {
		!(name in options) && (options[name] = defaults[name]);
	}

  this.disabledTags = DEFAULT_DISABLED_TAGS
  this.text = null;
  this.targetTag = null;
  this.isActive = false;

  return {
    init: function() {
      window.addEventListener('load', () => {
        /**
         * Bail if the script is getting loaded in an iframe.
         */
        if (window.location !== window.parent.location) return;

        /**
         * Adding the on/off toggle to the end of the body tag.
         */
        this.addToggle();

        /**
         * Handling when on/off toggle is triggered.
         */
        document.querySelector('.trjs-toggle-inner input').addEventListener('change', this.handleToggleChange.bind(this));

        /**
         * Getting the target element type to eventually check it against approved and 
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

      })
    },

    addToggle: function() {
      const body = document.getElementsByTagName("body")[0];
      const newToggleEl = document.createElement('div');

      newToggleEl.classList.add('trjs-toggle-container')

      const cleanContent = DOMPurify.sanitize(`
      <div class="trjs-toggle-inner"><label class="switch">
        <input type="checkbox">
        <span class="slider round"></span>
      </label></div>`)

      newToggleEl.innerHTML = cleanContent;
      
      body.appendChild(newToggleEl);

      /**
       * Check if an on/off toggle setting already exists to assign previous toggle position.
       */
      const localStorage = window.localStorage;
      const isActiveLocalStorage = localStorage.getItem('trjs-active');

      if (isActiveLocalStorage) {
        this.isActive = true;
        newToggleEl.querySelector('input').checked = true;
      }
    },

    /**
     * Assigning the active state.
     * @param {Object} - The event fired when on/off is toggled.
     */
    handleToggleChange: function(event) {
      const localStorage = window.localStorage;

      if (event.target.checked) {
        this.isActive = true;
        localStorage.setItem('trjs-active', 'true');
      } else {
        this.isActive = false;
        localStorage.removeItem('trjs-active');
      }
    },

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
    },

    /**
     * Getting the selected text string, fetching the API results, and displaying the popover.
     */
    handleTextReveal: function(event) {
      /**
       * Only firing if there is a text selection or the selected text is not within a disabled tag type. ie. input field.
       */
      const isDisabledTag = options.disabledTags.find((tag) => tag == this.targetTag);
      if (this.text || isDisabledTag || !this.isActive) return;

      try {
        this.text = (document.all) ? document.selection.createRange().text : document.getSelection().toString();

        if (this.text) {
          this.handleFetch(this.text).then((results) => {
            console.log('results', results);
            this.displayPopover(results);
          }).catch((error) => console.log('myRevealer error', error));
        }

      } catch(error) {
        console.log('selection error: ', error);
      }
    },

    /**
     * Fetching data from various APIs with the selected string. Combining the routes into
     * a single Axios request.
     * @param {String}   searchText
     * @return {Object}  Data from axios get requests.
     */
    handleFetch: function(searchText) {
      return new Promise((resolve, reject) => {
        const promises = [];

        if (options.wikipedia) {
          const wikiRoute = Wikipedia().searchRoute(searchText);
          const wikiPromise = fetch(wikiRoute)
            .then(res => ({ res: res.json(), route: 'wiki' }));

          promises.push(wikiPromise);
        };

        if (options.merriamWebsterDictionary) {
          const dictionaryRoute = MerriamWebsterDictionary().searchRoute({
            searchText: searchText,
            key: options.merriamWebsterDictionary
          });

          const dictionaryPromise = fetch(dictionaryRoute)
            .then(res => ({ res: res.json(), route: 'dictionary' }));

          promises.push(dictionaryPromise);
        }

        Promise.all(promises).then((res)=> {
          resolve(res);
        })
        .catch((error) => reject(error));;
      })
    },

    /**
     * Construct the popover element and add it to the DOM.
     * @param {Object} - Results of the Wikipedia, Dictionary, etc. call.
     */
    displayPopover: function(results){
      const span = document.createElement("span");
      span.classList.add('trjs');
      span.tabIndex = '-1';

      const popover = document.createElement('dfn');
      popover.title = this.text;
      
      const cleanContent = DOMPurify.sanitize(new PopoverContent({ 
        text: this.text, 
        results 
      }).html());

      popover.innerHTML = cleanContent;

      if (window.getSelection) {
        const sel = window.getSelection();
        
        const parentTag = sel.anchorNode.parentElement.nodeName.toLowerCase();
        const isApprovedTag = options.approvedTags.find((tag) => tag === parentTag);

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
    },

    /**
     * Remove the popover element from the DOM and replace with the selected text.
     */
    closePopover: function(){
      const textRevealerEl = document.querySelector('.trjs');
      textRevealerEl.parentNode.replaceChild(document.createTextNode(this.text), textRevealerEl);
      
      this.text = null;
      this.targetTag = null;
    }

  }
};

export default TextRevealer;