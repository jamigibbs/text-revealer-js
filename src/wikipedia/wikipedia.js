class Wikipedia {

  static baseUrl = 'https://en.wikipedia.org/w/api.php?origin=*';

  static searchRoute(search){
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
  }

}

export default Wikipedia;