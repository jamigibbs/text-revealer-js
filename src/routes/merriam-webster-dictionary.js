const MerriamWebsterDictionary = {

  baseUrl: 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/',
  /**
   * Construct the Merriam-Webster Dictionary route.
   * @return {String}
   */
  searchRoute: function (options = {}) {
    const params = {
      key: options.key
    };

    let dictionaryRoute = `${this.baseUrl}/${options.searchText}?`;

    Object.keys(params).forEach((key) => {dictionaryRoute += "&" + key + "=" + params[key];});

    return dictionaryRoute;
  },

  formattedData: function(res, text){
    return {
      shortdef: res.data[0].shortdef,
      date: res.data[0].date,
      fl: res.data[0].fl,
      link: `https://www.merriam-webster.com/dictionary/${text}`
    };
  }

}

export default MerriamWebsterDictionary;