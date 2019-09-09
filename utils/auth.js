import nextCookie from 'next-cookies';
import redirect from './redirect';

export function enforceNotAuth(ctx) {
  const { qid: sessionId } = nextCookie(ctx);
  if(sessionId) {
    redirect(ctx, '/');
  }
}