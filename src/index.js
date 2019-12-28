import TextRevealer from './client/client';

;(function(){

  const myRevealer = new TextRevealer({
    wikipedia: true,
    merriamWebsterDictionary: false
    //merriamWebsterDictionary: '7a12d8b9-952e-4b4b-a768-de6e423ebb25'
  });
  
  myRevealer.init();

})();