import axios from "axios";

class Api ***REMOVED***
  request(ctx = ***REMOVED******REMOVED***) ***REMOVED***
    return axios.create(***REMOVED***
      baseURL: `$***REMOVED***
        ctx.req ? `$***REMOVED***ctx.req.protocol***REMOVED***://localhost:$***REMOVED***process.env.PORT***REMOVED***` : ""
      ***REMOVED***/api`,
      headers: ***REMOVED***
        ...(ctx.req &&
          ctx.req.headers.cookie && ***REMOVED***
            cookie: ctx.req.headers.cookie
          ***REMOVED***)
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***

  async createJob(data) ***REMOVED***
    const ***REMOVED*** data: jobData ***REMOVED*** = await this.request().post("/new", data);
    return jobData;
  ***REMOVED***

  async uploadImage(file) ***REMOVED***
    const formData = new FormData();
    formData.append("image", file);
    const ***REMOVED*** data ***REMOVED*** = await this.request().post(`/image-upload`, formData, ***REMOVED***
      headers: ***REMOVED***
        "content-type": "multipart/form-data"
      ***REMOVED***
    ***REMOVED***);
    return data.imageUrl;
  ***REMOVED***

  async getPrimaryTags(ctx) ***REMOVED***
    const ***REMOVED*** data ***REMOVED*** = await this.request(ctx).get(`/primary-tags`);
    return data;
  ***REMOVED***

  async getJobs(***REMOVED*** ctx = ***REMOVED******REMOVED***, cursor = "", tags = "" ***REMOVED*** = ***REMOVED******REMOVED***) ***REMOVED***
    const ***REMOVED*** data ***REMOVED*** = await this.request(ctx).get(
      `/jobs?cursor=$***REMOVED***cursor***REMOVED***&tags=$***REMOVED***tags***REMOVED***`
    );
    return data;
  ***REMOVED***

  async getPendingJobs(ctx) ***REMOVED***
    const ***REMOVED*** data ***REMOVED*** = await this.request(ctx).get(`/pending-jobs`);
    return data;
  ***REMOVED***

  async getJob(slug, adminToken, ctx) ***REMOVED***
    const ***REMOVED*** data ***REMOVED*** = await this.request(ctx).get(
      `/jobs/$***REMOVED***slug***REMOVED***?$***REMOVED***!!adminToken ? `adminToken=$***REMOVED***adminToken***REMOVED***` : ""***REMOVED***`
    );
    return data;
  ***REMOVED***

  async login(data) ***REMOVED***
    const ***REMOVED*** data: user ***REMOVED*** = await this.request().post(`/login`, data);
    return user;
  ***REMOVED***

  register(data) ***REMOVED***
    return this.request().post("/register", data);
  ***REMOVED***

  confirmUser(confirmationKey) ***REMOVED***
    return this.request().get(`/confirm-user/$***REMOVED***confirmationKey***REMOVED***`);
  ***REMOVED***

  logout() ***REMOVED***
    return this.request().get("/logout");
  ***REMOVED***

  async activeUser(ctx) ***REMOVED***
    const ***REMOVED*** data: user ***REMOVED*** = await this.request(ctx).get(`/me`);
    return user;
  ***REMOVED***

  async approveJob(jobId) ***REMOVED***
    const ***REMOVED*** data ***REMOVED*** = await this.request().put("/approve-job", ***REMOVED*** jobId ***REMOVED***);
    return data;
  ***REMOVED***

  async removeJob(jobId) ***REMOVED***
    const ***REMOVED*** data ***REMOVED*** = await this.request().delete(`/jobs/$***REMOVED***jobId***REMOVED***`);
    return data;
  ***REMOVED***

  async verifyJobToken(id, adminToken) ***REMOVED***
    const ***REMOVED*** data ***REMOVED*** = await this.request().post(`/jobs/$***REMOVED***id***REMOVED***/verify-token`, ***REMOVED***
      adminToken
    ***REMOVED***);
    return data;
  ***REMOVED***

  async closeJob(id, adminToken) ***REMOVED***
    const ***REMOVED*** data ***REMOVED*** = await this.request().patch(`/jobs/$***REMOVED***id***REMOVED***/close-job`, ***REMOVED***
      adminToken
    ***REMOVED***);
    return data;
  ***REMOVED***

  async getTags(tagIds = "", ctx) ***REMOVED***
    const ***REMOVED*** data ***REMOVED*** = await this.request(ctx).get(`/tags?ids=$***REMOVED***tagIds***REMOVED***`);
    return data;
  ***REMOVED***
***REMOVED***

export default new Api();
