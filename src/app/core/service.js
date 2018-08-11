import { DEFAULT_PER_PAGE } from '../constants/api';
import buildQueryParams from '../helpers/buildQueryParams';

/**
 * @class Service
 * @author R.Keyan
 * @description Service Base class, build full url with params
 */
class Service {
  /**
   * Base url of requests
   * @type {string}
   */
  static BASE_URL = '';

  static setBaseUrl = (rootUrl) => {
    if (!rootUrl || typeof rootUrl !== 'string') {
      throw new Error('API url must be a defined as a string in constants');
    }
    Service.BASE_URL = rootUrl;
  }
}

Service.prototype.buildUrl = (url, params) => {
  /* eslint no-param-reassign: 0 */
  if (!('per_page' in params)) {
    params.per_page = DEFAULT_PER_PAGE;
  }
  if (!url.startsWith('/')) url += `/${url}`;
  return `${Service.BASE_URL}${url}?${buildQueryParams(params)}`;
};

export default Service;
