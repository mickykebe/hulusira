import nextCookie from 'next-cookies';
import api from '../api';
import redirect from '../utils/redirect';
import Layout from '../components/layout';

function Admin({ user }) {
  return (
    <Layout>
      
    </Layout>
  )
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