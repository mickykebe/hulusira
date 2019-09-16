import axios from "axios";

class Api ***REMOVED***
  constructor() ***REMOVED***
    this.request = axios.create(***REMOVED***
      baseURL: `$***REMOVED***process.env.serverUrl***REMOVED***/api`
    ***REMOVED***);
  ***REMOVED***

  configFromContext(ctx) ***REMOVED***
    const config = ***REMOVED***headers: ***REMOVED******REMOVED******REMOVED***;
    if(ctx && ctx.req && ctx.req.headers.cookie) ***REMOVED***
      config.headers.cookie = ctx.req.headers.cookie;
    ***REMOVED***
    return config;
  ***REMOVED***

  async createJob(data) ***REMOVED***
    const ***REMOVED*** data: jobData ***REMOVED*** = await this.request.post("/new", data);
    return jobData;
  ***REMOVED***

  async uploadImage(file) ***REMOVED***
    const formData = new FormData();
    formData.append("image", file);
    const ***REMOVED*** data ***REMOVED*** = await this.request.post(`/image-upload`, formData, ***REMOVED***
      headers: ***REMOVED***
        "content-type": "multipart/form-data"
      ***REMOVED***
    ***REMOVED***);
    return data.imageUrl;
  ***REMOVED***

  async getPrimaryTags() ***REMOVED***
    const ***REMOVED*** data ***REMOVED*** = await this.request.get(`/primary-tags`);
    return data;
  ***REMOVED***

  async getJobs(***REMOVED***ctx = null, cursor = ""***REMOVED*** = ***REMOVED******REMOVED***) ***REMOVED***
    const ***REMOVED*** data ***REMOVED*** = await this.request.get(`/jobs?cursor=$***REMOVED***cursor***REMOVED***`, this.configFromContext(ctx));
    return data;
  ***REMOVED***

  async getPendingJobs(ctx) ***REMOVED***
    const ***REMOVED*** data ***REMOVED*** = await this.request.get(`/pending-jobs`, this.configFromContext(ctx));
    return data;
  ***REMOVED***

  async getJob(jobId) ***REMOVED***
    const ***REMOVED*** data ***REMOVED*** = await this.request.get(`/jobs/$***REMOVED***jobId***REMOVED***`);
    return data;
  ***REMOVED***

  async login(data) ***REMOVED***
    const ***REMOVED*** data: user***REMOVED*** = await this.request.post(`/login`, data);
    return user;
  ***REMOVED***

  async activeUser(ctx) ***REMOVED***
    const ***REMOVED*** data: user ***REMOVED*** = await this.request.get(`/me`, this.configFromContext(ctx));
    return user;
  ***REMOVED***
***REMOVED***

export default new Api();
