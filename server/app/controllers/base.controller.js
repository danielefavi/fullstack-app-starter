import HttpException from '../libs/exceptions/http.exception.js';

export default class BaseController {

  successResponse(res, message = null, data = null) {
    return res.status(200).json({
      message,
      data
    });
  }
  
  exception(message = null, errors = {}) {
    throw new HttpException(500, message, errors);
  }

  notFoundException() {
    throw new HttpException(404);
  }

  badRequestException() {
    throw new HttpException(400);
  }

  unauthorizedException() {
    throw new HttpException(401);
  }

  forbiddenException() {
    throw new HttpException(403);
  }

  validationException(errors) {
    throw new HttpException(422, null, errors);
  }

  validate(data, rules) {
    const errors = {};

    for (const field in rules) {
      const fieldRules = rules[field].split('|');

      if (fieldRules.includes('required') && !data[field]) {
        errors[field] = 'The field is required';
        continue;
      }

      if (fieldRules.includes('array') && data[field]) {
        if (!Array.isArray(data[field])) {
          errors[field] = 'The field must be an array';
          continue;
        }

        if (fieldRules.includes('integer')) {
          for (const value of data[field]) {
            if (!Number.isInteger(value) && !/^\d+$/.test(value)) {
              errors[field] = 'The field must be an array of integers';
              break;
            }
          }
        } else if (fieldRules.includes('string')) {
          for (const value of data[field]) {
            if (typeof value !== 'string') {
              errors[field] = 'The field must be an array of strings';
              break;
            }
          }
        }
      }

      if (!fieldRules.includes('array')) {
        if (fieldRules.includes('string') && data[field] && typeof data[field] !== 'string') {
          errors[field] = 'The field must be a string';
        }
  
        if (fieldRules.includes('email') && data[field] && !data[field].match(/^.+@.+\..+$/)) {
          errors[field] = 'The field must be a valid email';
        }
  
        if (fieldRules.includes('integer') && data[field] && !Number.isInteger(data[field]) && !/^\d+$/.test(data[field])) {
          errors[field] = 'The field must be an integer';
        }
  
        if (fieldRules.includes('date') && data[field] && !data[field].match(/^\d{4}-\d{2}-\d{2}$/)) {
          errors[field] = 'The field must be a date in the format of YYYY-MM-DD';
        }
      }
    }

    if (Object.keys(errors).length) {
      this.validationException(errors);
    }
  }

}

