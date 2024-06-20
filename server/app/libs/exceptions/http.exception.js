export default class HttpException extends Error {

  constructor(statusCode, message = null, errors = {}) {
    super(message);

    this.message = this.getMessage(statusCode, message);

    this.name = 'HttpException';
    this.errors = errors;
    this.statusCode = statusCode;
  }

  getMessage(statusCode, message) {
    if (message) {
      return message;
    }

    if (statusCode === 400) {
      return 'Bad Request';
    }

    if (statusCode === 401) {
      return 'Unauthorized';
    }

    if (statusCode === 403) {
      return 'Forbidden';
    }

    if (statusCode === 404) {
      return 'Not Found';
    }

    if (statusCode === 422) {
      return 'Validation Error';
    }

    if (statusCode === 500) {
      return 'Internal Server Error';
    }

    return 'Unknown Error';
  }

}