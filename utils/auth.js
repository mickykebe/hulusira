import Router from 'next/router';
import nextCookie from 'next-cookies';

export function enforceNotAuth(ctx) ***REMOVED***
  const ***REMOVED*** qid: sessionId ***REMOVED*** = nextCookie(ctx);
  if(ctx.req && sessionId) ***REMOVED***
    ctx.res.writeHead(302, ***REMOVED*** Location: '/' ***REMOVED***);
    ctx.res.end();
  ***REMOVED***

  if(sessionId) ***REMOVED***
    Router.push('/');
  ***REMOVED***
***REMOVED***