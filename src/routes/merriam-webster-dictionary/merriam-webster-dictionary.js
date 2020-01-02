function MerriamWebsterDictionary() {

  const baseUrl = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/';

  return {
    /**
     * Construct the Merriam-Webster Dictionary route.
     * @return {String}
     */
    searchRoute: (options = {}) => {
      const params = {
        key: options.key
      };

      let dictionaryRoute = `${baseUrl}/${options.searchText}?`;

      Object.keys(params).forEach((key) => {dictionaryRoute += "&" + key + "=" + params[key];});

      return dictionaryRoute;
    }
  }

}

export default MerriamWebsterDictionary;