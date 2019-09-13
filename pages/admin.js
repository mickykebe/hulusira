import nextCookie from 'next-cookies';
import api from '../api';
import redirect from '../utils/redirect';

function Admin({ user }) {
  return <div>{user.firstName}</div>
}

Admin.getInitialProps = async function(ctx) {
  if(ctx.req) {
    const { qid: sessionId } = nextCookie(ctx);
    if(!sessionId) {
      redirect(ctx, '/');
      return {};
    }
  }

  let user;

  try {
    user = await api.activeUser(ctx);
    if(user.role !== "admin") {
      throw new Error("Not permitted");
    }
  } catch(err){
    redirect(ctx, '/');
    return {};
  }

  return { user };
}

export default Admin;