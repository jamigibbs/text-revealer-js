const Wikipedia = {

  baseUrl: 'https://en.wikipedia.org/w/api.php?origin=*',
  /**
   * Construct the Wikipedia route.
   * @return {String}
   */
  searchRoute: function(search) {
    const wikiParams = {
      action: 'opensearch',
      search,
      limit: '5',
      namespace: '0',
      format: 'json'
    };

    let wikiRoute = this.baseUrl;

    Object.keys(wikiParams).forEach((key) => {wikiRoute += "&" + key + "=" + wikiParams[key];});

    return wikiRoute;
  },

  formattedData: function(res) {
    let wikiArr = [];
    for (let i = 0; i < res.data[1].length; i++) {
      wikiArr.push({
        match: res.data[1][i],
        link: res.data[3][i]
      });
    }
    return wikiArr;
  }

}

export default Wikipedia;