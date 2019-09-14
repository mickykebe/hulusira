import nextCookie from 'next-cookies';
import api from '../api';
import redirect from '../utils/redirect';
import Layout from '../components/layout';

function Admin(***REMOVED*** user ***REMOVED***) ***REMOVED***
  return (
    <Layout>
      
    </Layout>
  )
***REMOVED***

Admin.getInitialProps = async function(ctx) ***REMOVED***
  if(ctx.req) ***REMOVED***
    const ***REMOVED*** qid: sessionId ***REMOVED*** = nextCookie(ctx);
    if(!sessionId) ***REMOVED***
      redirect(ctx, '/');
      return ***REMOVED******REMOVED***;
    ***REMOVED***
  ***REMOVED***

  let user;

  try ***REMOVED***
    user = await api.activeUser(ctx);
    if(user.role !== "admin") ***REMOVED***
      throw new Error("Not permitted");
    ***REMOVED***
  ***REMOVED*** catch(err)***REMOVED***
    redirect(ctx, '/');
    return ***REMOVED******REMOVED***;
  ***REMOVED***

  return ***REMOVED*** user ***REMOVED***;
***REMOVED***

export default Admin;