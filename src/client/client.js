import axios from 'axios';

import Wikipedia from '../wikipedia/wikipedia';
import MerriamWebsterDictionary from '../merriam-webster-dictionary/merriam-webster-dictionary';

class RevealerClient {
  constructor(options = {}) {
    this.isWikipedia = options.wikipedia;
    this.merriamWebsterDictionary = options.merriamWebsterDictionary;
  }

  /**
   * Get the selected text and then iniate a concurrent request for  all approved APIs.
   * On resolve, the request will return an object of results.
   * @param {string} options.searchText
   * @return {object}
   */
  init(options = {}) {
    return new Promise((resolve, reject) => {
      const routes = [];

      if (this.isWikipedia) {
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

}

export default RevealerClient;
