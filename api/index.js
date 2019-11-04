import axios from "axios";

class Api {
  request(ctx = {}) {
    return axios.create({
      baseURL: `${
        ctx.req ? `${ctx.req.protocol}://localhost:${process.env.PORT}` : ""
      }/api`,
      headers: {
        ...(ctx.req &&
          ctx.req.headers.cookie && {
            cookie: ctx.req.headers.cookie
          })
      }
    });
  }

  async createJob(data) {
    const { data: jobData } = await this.request().post("/new", data);
    return jobData;
  }

  async updateJob(id, data) {
    const { data: jobData } = await this.request().put(`/jobs/${id}`, data);
    return jobData;
  }

  async createCompany(data) {
    const { data: company } = await this.request().post("/company", data);
    return company;
  }

  async updateCompany(companyId, data) {
    const { data: company } = await this.request().put(
      `/company/${companyId}`,
      data
    );
    return company;
  }

  deleteCompany(companyId) {
    return this.request().delete(`/company/${companyId}`);
  }

  async uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await this.request().post(`/image-upload`, formData, {
      headers: {
        "content-type": "multipart/form-data"
      }
    });
    return data.imageUrl;
  }

  async getPrimaryTags(ctx) {
    const { data } = await this.request(ctx).get(`/primary-tags`);
    return data;
  }

  async getJobs({ ctx = {}, cursor = "", tags = "" } = {}) {
    const { data } = await this.request(ctx).get(
      `/jobs?cursor=${cursor}&tags=${tags}`
    );
    return data;
  }

  async getMyJobs(ctx) {
    const { data: jobs } = await this.request(ctx).get(`/myjobs`);
    return jobs;
  }

  async getCompanies(ctx) {
    const { data: companies } = await this.request(ctx).get(`/company`);
    return companies;
  }

  async getCompany(ctx, companyId) {
    const { data: company } = await this.request(ctx).get(
      `/company/${companyId}`
    );
    return company;
  }

  async getPendingJobs(ctx) {
    const { data } = await this.request(ctx).get(`/pending-jobs`);
    return data;
  }

  async getJob(ctx, slug, adminToken) {
    const { data } = await this.request(ctx).get(
      `/jobs/${slug}?${!!adminToken ? `adminToken=${adminToken}` : ""}`
    );
    return data;
  }

  async login(data) {
    const { data: user } = await this.request().post(`/login`, data);
    return user;
  }

  register(data) {
    return this.request().post("/register", data);
  }

  confirmUser(confirmationKey) {
    return this.request().get(`/confirm-user/${confirmationKey}`);
  }

  logout() {
    return this.request().get("/logout");
  }

  async activeUser(ctx) {
    const { data: user } = await this.request(ctx).get(`/me`);
    return user;
  }

  async approveJob(jobId) {
    const { data } = await this.request().put("/approve-job", { jobId });
    return data;
  }

  async removeJob(jobId) {
    const { data } = await this.request().delete(`/jobs/${jobId}`);
    return data;
  }

  async verifyJobToken(id, adminToken) {
    const { data } = await this.request().post(`/jobs/${id}/verify-token`, {
      adminToken
    });
    return data;
  }

  async closeJob(id, adminToken) {
    const { data } = await this.request().patch(`/jobs/${id}/close-job`, {
      adminToken
    });
    return data;
  }

  async getTags(tagIds = "", ctx) {
    const { data } = await this.request(ctx).get(`/tags?ids=${tagIds}`);
    return data;
  }
}

export default new Api();
