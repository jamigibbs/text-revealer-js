import axios from 'axios';

import Wikipedia from '../wikipedia/wikipedia';
import MerriamWebsterDictionary from '../merriam-webster-dictionary/merriam-webster-dictionary';

class TextRevealer {
  constructor(options = {}) {
    this.delay = options. delay;
    this.wikipedia = options.wikipedia;
    this.merriamWebsterDictionary = options.merriamWebsterDictionary;
  }

  /**
   * Get the selected text and then iniate a concurrent request for  all approved APIs.
   * On resolve, the request will return an object of results.
   * @param {string} options.searchText
   * @return {object}
   */
  init() {
    document.onmouseup = this.debounced(this.delay, this.handleTextReveal.bind(this));
    if (!document.all) document.captureEvents(Event.MOUSEUP);
  }

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

          data.forEach((api) => {
            const key = (new URL(api.config.url)).hostname;
            content[key] = api.data;
          });
          
          resolve(content);
        })
        .catch((error) => reject(error));
    })
  }

  handleTextReveal() {
    const text = (document.all) ? document.selection.createRange().text : document.getSelection().toString();

    if (text) {
      this.handleFetch({ 
        searchText: text
      }).then((results) => {
        console.log('results', results);
      }).catch((error) => console.log('myRevealer error', error));
    }
  };

}

export default TextRevealer;