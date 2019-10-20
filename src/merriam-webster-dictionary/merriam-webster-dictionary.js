class MerriamWebsterDictionary {

  static baseUrl = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/';

  static searchRoute(options = {}){
    const params = {
      key: options.key
    };

    let route = `${this.baseUrl}/${options.searchText}?`;

    Object.keys(params).forEach((key) => {route += "&" + key + "=" + params[key];});

    return route;
  }

}

export default MerriamWebsterDictionary;