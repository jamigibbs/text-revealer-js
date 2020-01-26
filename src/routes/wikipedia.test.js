import Wikipedia from './wikipedia';

describe('wikipedia route tests', () => {

  describe('searchRoute', () => {
    test('Generates a valid search route with single word', () => {
      const expectedRoute = `${Wikipedia.baseUrl}&action=opensearch&search=Chicago&limit=5&namespace=0&format=json`;
  
      expect(Wikipedia.searchRoute('Chicago')).toBe(expectedRoute);
    })
  
    test('Generates a valid search route with multiple words (encodeURIComponent)', () => {
      const expectedRoute = `${Wikipedia.baseUrl}&action=opensearch&search=Chicago%20Heights&limit=5&namespace=0&format=json`;
  
      expect(Wikipedia.searchRoute('Chicago Heights')).toBe(expectedRoute);
    })
  })

});