import ApiException from "./ApiException";

export default class Api {

  baseUrl = null;

  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async post(partialUrl, body = null, extraHeaders = null,  queryUrl = null) {
    return await this.call(partialUrl, 'POST', body, extraHeaders);
  }

  async get(partialUrl, body = null, extraHeaders = null,  queryUrl = null) {
    return await this.call(partialUrl, 'GET', body, extraHeaders);
  }

  async call(partialUrl, method, body = null, extraHeaders = null,  queryUrl = null) {
    const response = await this.callRaw(partialUrl, method, body, extraHeaders, queryUrl);
    
    if (!response.ok) {
      const body = await response.json();
      console.log('response', response);
      console.log('body', body);
      throw new ApiException(`Error on API call`, response.status, body);
    }

    return await response.json();
  }

  async callRaw(partialUrl, method, body = null, extraHeaders = null,  queryUrl = null) {
    let url = `${this.baseUrl}/${partialUrl}`;

    if (queryUrl) {
      url += '?' + new URLSearchParams(queryUrl);
    }

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (extraHeaders) {
      for (let key in extraHeaders) {
        headers.append(key, extraHeaders[key]);
      }
    }

    const options = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    };

    return fetch(url, options);
  }


}