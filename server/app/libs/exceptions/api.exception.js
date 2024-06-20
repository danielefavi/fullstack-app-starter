export default class ApiException extends Error {

  /**
   * ApiException
   *
   * @param   {Response}  response
   */
  constructor(response) {
    super('API Exception');

    this.name = 'ApiException';
    this.response = response;
    this.data = null;
  }

  async getBodyResponse() {
    if (this.data) {
      return this.data;
    }
    
    let data = await this.response.text();

    try {
      data = JSON.parse(data);
    } catch (e) {}

    this.data = data;

    return data;
  }

  async getBodyMessage() {
    const body = await this.getBodyResponse();

    if (typeof body === 'object') {
      if (body.message) {
        return body.message;
      }
      if (typeof body.error === 'string') {
        return body.error;
      }
    }

    if (typeof body === 'string') {
      return body;
    }

    return this.message;
  }
}