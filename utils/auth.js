import nextCookie from 'next-cookies';
import redirect from './redirect';

export function enforceNotAuth(ctx) ***REMOVED***
  const ***REMOVED*** qid: sessionId ***REMOVED*** = nextCookie(ctx);
  if(sessionId) ***REMOVED***
    redirect(ctx, '/');
  ***REMOVED***
***REMOVED***