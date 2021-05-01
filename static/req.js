
function getRequest( url ) {
  return new Promise(( resolve, reject ) => {
    let req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open( 'GET', url, true );
    req.onload = r => {
      if( r.target.status >= 400 ) {
        reject( r.target.response );
      }
      else {
        resolve( req.response );
      }
    }
    req.onerror = e => {
      reject( e );
    }
    req.send();
  });
}

function genericRequest( type, url, data = {} ) {
  let send = JSON.stringify( data );
  return new Promise(( resolve, reject ) => {
    let req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open( type, url, true );
    req.setRequestHeader( 'Content-Type', 'application/json;charset=UTF-8' );
    req.setRequestHeader( 'Accept', 'application/json' );
    req.onload = r => {
      if( r.target.status >= 400 ) {
        reject( r.target.response );
      }
      else {
        resolve( req.response );
      }
    }
    req.onerror = e => {
      reject( e );
    }
    req.send( send );
  });
}

function postRequest( url, data = {} ) {
  return genericRequest( 'POST', url, data );
}

function deleteRequest( url, data = {}) {
  return genericRequest( 'DELETE', url, data );
}

function patchRequest( url, data = {} ) {
  return genericRequest( 'PATCH', url, data );
}