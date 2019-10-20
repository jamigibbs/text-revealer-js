import RevealerClient from './client/client';

;(function(){

  const myRevealer = new RevealerClient({
    wikipedia: true,
    merriamWebsterDictionary: false,
    //merriamWebsterDictionary: '7a12d8b9-952e-4b4b-a768-de6e423ebb25',
  });

  function debounced(delay, fn) {
    let timerId;
    return function (...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn(...args);
        timerId = null;
      }, delay);
    }
  }

  function handleTextReveal() {
    const text = (document.all) ? document.selection.createRange().text : document.getSelection().toString();

    if (text) {
      myRevealer.init({ 
        searchText: text
      }).then((results) => {
        console.log('results', results);
      }).catch((error) => console.log('myRevealer error', error));
    }
  };

  document.onmouseup = debounced(1000, handleTextReveal);

  if (!document.all) document.captureEvents(Event.MOUSEUP);
})();