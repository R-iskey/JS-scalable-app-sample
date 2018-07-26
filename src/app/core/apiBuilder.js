import ApiConstants from '../constants/api';

/**
 * @class ApiBuilder
 * @author R.Keyan
 * @description Build/sanitize url for the next requests
 */
class ApiBuilder {
  static API_ROOT = 'https://api.github.com';

  static buildQueryParams(params = {}) {
    if (!params) return false;

    if (!('per_page' in params)) {
      params.per_page = ApiConstants.DEFAULT_PER_PAGE;
    }

    return Object.keys(params).map((key) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    }).join('&');
  }

  static buildUrl(url, params) {
    /* eslint no-param-reassign: 0 */
    if (!url.startsWith('/')) url += `/${url}`;
    return `${this.API_ROOT}${url}?${this.buildQueryParams(params)}`;
  }
}

export default ApiBuilder;
