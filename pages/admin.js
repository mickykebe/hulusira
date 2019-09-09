import nextCookie from 'next-cookies';
import api from '../api';
import redirect from '../utils/redirect';

function Admin(***REMOVED*** user ***REMOVED***) ***REMOVED***
  return <div>***REMOVED***user.firstName***REMOVED***</div>
***REMOVED***

Admin.getInitialProps = async function(ctx) ***REMOVED***
  const ***REMOVED*** qid: sessionId ***REMOVED*** = nextCookie(ctx);
  if(sessionId) ***REMOVED***
    const user = await api.activeUser(ctx);
    if(user.role === 'admin') ***REMOVED***
      return ***REMOVED*** user ***REMOVED***;
    ***REMOVED***
  ***REMOVED***

  redirect(ctx, '/');
***REMOVED***

export default Admin;