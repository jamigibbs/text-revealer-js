function Wikipedia() {

  const baseUrl = 'https://en.wikipedia.org/w/api.php?origin=*';

  return {
    /**
     * Construct the Wikipedia route.
     * @return {String}
     */
    searchRoute: (search) => {
      const wikiParams = {
        action: 'opensearch',
        search,
        limit: '5',
        namespace: '0',
        format: 'json'
      };

      let wikiRoute = baseUrl;

      Object.keys(wikiParams).forEach((key) => {wikiRoute += "&" + key + "=" + wikiParams[key];});

      return wikiRoute;
    }
  }

}

export default Wikipedia;