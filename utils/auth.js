import Router from 'next/router';
import nextCookie from 'next-cookies';

export function enforceNotAuth(ctx) {
  const { qid: sessionId } = nextCookie(ctx);
  if(ctx.req && sessionId) {
    ctx.res.writeHead(302, { Location: '/' });
    ctx.res.end();
  }

  if(sessionId) {
    Router.push('/');
  }
}