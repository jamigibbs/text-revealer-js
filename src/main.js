import './scss/_global.scss';
import PopoverTemplate from './views/popover.hbs';
import DOMPurify from 'dompurify';
import Wikipedia from './routes/wikipedia';
import MerriamWebsterDictionary from './routes/merriam-webster-dictionary';

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

  this.disabledTags = DEFAULT_DISABLED_TAGS;
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
         * Watching for clicks on the document body. 
         * 
         * If the click happened outside an active text revealer popover, 
         * we close the active popover. Otherwise, set the targeted tag for
         * eventually displaying a new popover.
         */
        document.body.addEventListener('click', (event) => {
          const textRevealerEl = document.querySelector('.trjs');
          if (textRevealerEl && this.text && !textRevealerEl.contains(event.target)) {
            this.closePopover();
          } else {
            this.targetTag = event.target.localName;
          }
        });

        /**
         * Binding the mouseup event to capture selected or highlighted text.
         */
        document.onmouseup = this.debounced(options.delay, this.handleTextReveal.bind(this));
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
    debounced: function(delay, fn) {
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
          this.handleFetch(this.text)
            .then((results) => {
              this.routePromises = [];

              const formattedResults = results.reduce((acc, curr) => {
                if (curr.route === 'wikiSearch') {
                  acc[curr.route] = Wikipedia.formattedSearchData(curr);
                } else if (curr.route === 'wikiQuery'){
                  acc[curr.route] = curr.data;
                } else if (curr.route === 'dictionary') {
                  acc[curr.route] = MerriamWebsterDictionary.formattedData(curr, this.text);
                }
                return acc;
              }, {})

              return formattedResults;
            })
            .then((formattedResults) => {
              const isWikiResults = formattedResults.wikiSearch.length > 0;

              if (!isWikiResults) {
                formattedResults.wikiSearch = null;
              }
              
              if (isWikiResults) {
                // Getting the excerpt for the first returned wiki article.
                const wikiArticleTitle = formattedResults.wikiSearch[0].title;

                /**
                 * We have to first get the wiki search results list before we can get a summary for the
                 * first returned article (done below). The search endpoint does not return wiki page summary info.
                 * We have to use the REST API summary route instead.
                 */
                if (wikiArticleTitle) {
                  fetch(Wikipedia.summaryRoute(wikiArticleTitle))
                    .then((res) => res.json())
                    .then((data) => {
                      formattedResults.wikiSummary = {
                        title: formattedResults.wikiSearch[0].title,
                        summary: data.extract,
                        link: formattedResults.wikiSearch[0].link
                      }
                      /**
                       * Remove the first result item because we're using it for the wikiSummary item.
                       */
                      formattedResults.wikiSearch.shift();
                      
                      console.log('formattedResults', formattedResults)
                      this.displayPopover(formattedResults);
                    });
                } else {
                  this.displayPopover(formattedResults);
                }
              } else {
                this.displayPopover(formattedResults);
              }
            })
            .catch((error) => console.log('wiki summaryRoute error', error));
        }

      } catch(error) {
        console.error('handleTextReveal error: ', error);
      }
    },

    /**
     * Utility function using Fetch API to request route data.
     * @param {String} name 
     * @param {String} route 
     */
    fetchRoute: function(name, route) {
      const routePromise = fetch(route)
        .then((res) => res.json())
        .then((data) => {
          return { data, route: name }
        })
      return routePromise;
    },

    /**
     * Fetching data from various APIs with the selected string. Combining the routes into
     * a single fetch request.
     * @param {String}   searchText
     * @return {Object}  Data from fetch requests.
     */
    handleFetch: function(searchText) {
      let routePromises = [];

      return new Promise((resolve, reject) => {

        /**
         * Wikipedia Route.
         */
        if (options.wikipedia) {
          const wikiSearchRoute = Wikipedia.searchRoute(searchText);
          const wikiRoutePromise = this.fetchRoute('wikiSearch', wikiSearchRoute);
          routePromises.push(wikiRoutePromise);
        };

        /**
         * Dictionary Route.
         */
        if (options.merriamWebsterDictionary) {
          const dictionaryRoute = MerriamWebsterDictionary.searchRoute({
            searchText: searchText,
            key: options.merriamWebsterDictionary
          });
          const dictionaryRoutePromise = this.fetchRoute('dictionary', dictionaryRoute);
          routePromises.push(dictionaryRoutePromise);
        }

        Promise.all(routePromises).then((res)=> {
          resolve(res);
        })
        .catch((error) => reject(error));;
      })
    },

    /**
     * Construct the popover element and add it to the DOM.
     * @param {Object} - Results of the Wikipedia, Dictionary, etc. call.
     */
    displayPopover: function(data){
      const span = document.createElement("span");
      span.classList.add('trjs');
      span.tabIndex = '-1';

      const popover = document.createElement('dfn');
      popover.title = this.text;
      popover.innerHTML = PopoverTemplate({ selected: this.text, data });

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

          if (options.scrollIntoView) {
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