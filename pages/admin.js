import nextCookie from 'next-cookies';
import api from '../api';
import redirect from '../utils/redirect';

function Admin({ user }) {
  return <div>{user.firstName}</div>
}

Admin.getInitialProps = async function(ctx) {
  const { qid: sessionId } = nextCookie(ctx);
  if(sessionId) {
    const user = await api.activeUser(ctx);
    if(user.role === 'admin') {
      return { user };
    }
  }

  redirect(ctx, '/');
}

export default Admin;