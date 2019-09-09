import Router from 'next/router';

export default (ctx, target) => ***REMOVED***
  if(ctx.res) ***REMOVED***
    ctx.res.writeHead(303, ***REMOVED*** Location: target ***REMOVED***);
    ctx.res.end();
  ***REMOVED*** else ***REMOVED***
    Router.replace(target);
  ***REMOVED***
***REMOVED***