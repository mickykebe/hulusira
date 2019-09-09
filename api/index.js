import axios from "axios";

class Api {
  constructor() {
    this.request = axios.create({
      baseURL: `${process.env.serverUrl}/api`
    });
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

  async getJobs(cursor = "") {
    const { data } = await this.request.get(`/jobs?cursor=${cursor}`);
    return data;
  }

  async getJob(jobId) {
    const { data } = await this.request.get(`/jobs/${jobId}`);
    return data;
  }

  async login(data) {
    const { data: user} = await this.request.post(`/login`, data);
    return user;
  }

  async activeUser(ctx) {
    const { data: user } = await this.request.get(`/me`, {
      headers: {
        cookie: ctx.req ? ctx.req.headers.cookie : null,
      }
    });
    return user;
  }
}

export default new Api();
