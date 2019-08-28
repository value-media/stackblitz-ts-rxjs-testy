import { of } from 'rxjs'; 
import { map } from 'rxjs/operators';
import * as soap from 'soap';

// const source = of('World').pipe(map(x => `Hello ${x}!`));
// source.subscribe(x => console.log(x));

let div = document.createElement('div');
div.textContent = JSON.stringify(getQueryParams());
document.body.appendChild(div);

let div2 = document.createElement('div');

getNbpRate().then(rates => {
  div2.textContent = JSON.stringify(rates);
  document.body.appendChild(div2);
});

wypiszDoKonsoli();

///
///   ----  funkcje ----
///

async function wypiszDoKonsoli(){
  const resp = await asyncGetNpbRates2(); //.catch(err => "error (wypisz): " + err.message);
  if(resp.ok) { 
    console.log('sync rates2', {...(await resp.body), status: 'ok', ok: true });
  }
  else {
    console.log(resp);
  }  
}

function getQueryParams() {
  const params = { wersja: 'alfa' };
  const queries = window.location.search.slice(1).split("&");
  queries.forEach((indexQuery: string) => {
      const indexPair = indexQuery.split("=");
      const queryKey = decodeURIComponent(indexPair[0]);
      const queryValue = decodeURIComponent(indexPair.length > 1 ? indexPair[1] : "");
      params[queryKey] = queryValue;
  });
  return params;
}

async function asyncGetNpbRates2() {
  let apiUrl = 'https://api.nbp.pl/api/exchangerates/rates/A/USD/2019-08-26/?format=json';
  let resp: any;
  try {
    resp = await fetch(apiUrl); 
    if(resp.ok === true) {
      return { status: 'ok', ok: true, body: resp.json()};
    }
    else {
      return { status: 'error', ok: false, body: resp.statusText };
    }

  }
  catch(err){
    return { status: 'error', ok: false, body: err.message };
  }
}

async function getNbpRate() {
  let apiUrl = 'https://api.nbp.pl/api/exchangerates/rates/A/USD/2019-08-26/?format=json';
  const response = await fetch(apiUrl);
  const data = await response.json();

  if (response && response.status >= 200 && response.status < 400) {      
    return data;
  } else {
    return response;
  } 
}

interface NbpRate {
  table: string,
  currency: string,
  code: string,
  rates: [
    {
      no: string,
      effectiveDate: Date,
      mid: number
    }
  ]
}