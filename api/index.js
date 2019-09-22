import axios from "axios";

class Api {
  constructor() {
    this.request = axios.create({
      baseURL: `${process.env.serverUrl}/api`
    });
  }

  configFromContext(ctx) {
    const config = { headers: {} };
    if (ctx && ctx.req && ctx.req.headers.cookie) {
      config.headers.cookie = ctx.req.headers.cookie;
    }
    return config;
  }

  async createJob(data) {
    const { data: jobData } = await this.request.post("/new", data);
    return jobData;
  }

  async uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await this.request.post(`/image-upload`, formData, {
      headers: {
        "content-type": "multipart/form-data"
      }
    });
    return data.imageUrl;
  }

  async getPrimaryTags() {
    const { data } = await this.request.get(`/primary-tags`);
    return data;
  }

  async getJobs({ ctx = null, cursor = "", tags = "" } = {}) {
    const { data } = await this.request.get(
      `/jobs?cursor=${cursor}&tags=${tags}`,
      this.configFromContext(ctx)
    );
    return data;
  }

  async getPendingJobs(ctx) {
    const { data } = await this.request.get(
      `/pending-jobs`,
      this.configFromContext(ctx)
    );
    return data;
  }

  async getJob(slug, adminToken) {
    const { data } = await this.request.get(
      `/jobs/${slug}?${!!adminToken ? `adminToken=${adminToken}` : ""}`
    );
    return data;
  }

  async login(data) {
    const { data: user } = await this.request.post(`/login`, data);
    return user;
  }

  async activeUser(ctx) {
    const { data: user } = await this.request.get(
      `/me`,
      this.configFromContext(ctx)
    );
    return user;
  }

  async approveJob(jobId) {
    const { data } = await this.request.put("/approve-job", { jobId });
    return data;
  }

  async removeJob(jobId) {
    const { data } = await this.request.delete(`/jobs/${jobId}`);
    return data;
  }

  async verifyJobToken(id, adminToken) {
    const { data } = await this.request.post(`/jobs/${id}/verify-token`, {
      adminToken
    });
    return data;
  }

  async closeJob(id, adminToken) {
    const { data } = await this.request.patch(`/jobs/${id}/close-job`, {
      adminToken
    });
    return data;
  }

  async getTags(tagIds = "") {
    const { data } = await this.request.get(`/tags?ids=${tagIds}`);
    return data;
  }
}

export default new Api();
