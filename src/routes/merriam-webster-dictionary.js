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
    if (res.data.length > 0 ) {
      const firstResult = res.data[0];
      const middleDot = String.fromCharCode(0x00B7);
      const cons = firstResult.hwi.hw.replace(/\*/g, middleDot);
      return {
        date: firstResult.date,
        fl: firstResult.fl,
        link: `https://www.merriam-webster.com/dictionary/${text}`,
        pronunciation: firstResult.hwi.prs[0].mw,
        cons,
        shortdef: firstResult.shortdef
      };
    }
    return {
      shortdef: null,
      date: null,
      fl: null,
      link: null
    };
  }

}

export default MerriamWebsterDictionary;