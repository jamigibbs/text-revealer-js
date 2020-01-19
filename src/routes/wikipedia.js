const Wikipedia = {

  baseUrl: 'https://en.wikipedia.org/w/api.php?origin=*',
  baseRestApiUrl: 'https://en.wikipedia.org/api/rest_v1/page/summary/Stack_Overflow',
  /**
   * Construct the Wikipedia route.
   * @return {String}
   */
  searchRoute: function(search) {
    const params = {
      action: 'opensearch',
      search: encodeURIComponent(search),
      limit: '5',
      namespace: '0',
      format: 'json'
    };

    let route = this.baseUrl;
    Object.keys(params).forEach((key) => {route += "&" + key + "=" + params[key];});
    return route;
  },

  queryRoute: function(text) {
    const params = {
      action: 'query',
      prop: 'extracts',
      exsentences: 2,
      format: 'json',
      titles: text
    }

    let route = this.baseUrl + '&exintro&explaintext';

    Object.keys(params).forEach((key) => {route += "&" + key + "=" + params[key];});

    return route;
  },

  summaryRoute: function(articleTitle){
    return `https://en.wikipedia.org/api/rest_v1/page/summary/${articleTitle}`
  },

  formattedSearchData: function(res) {
    let arr = [];
    for (let i = 0; i < res.data[1].length; i++) {
      arr.push({
        title: res.data[1][i],
        link: res.data[3][i]
      });
    }
    return arr;
  }

}

export default Wikipedia;