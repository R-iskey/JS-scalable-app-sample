import ApiBuilder from '../../core/apiBuilder';

/**
 * @class ReposService
 * @author R.Keyan
 * @pattern Singleton
 */
class ReposService {
  constructor() {
    this.page = 1;
  }

  async getUsers(username) {
    const url = ApiBuilder.buildUrl('/search/repositories', {
      q: `${username} in`,
      type: 'Repositories',
      page: this.page
    });
    const response = await fetch(url);
    return response.json();
  }

  setPage(page) {
    this.page = page;
  }

  resetPage() {
    this.page = 1;
  }
}

export default new ReposService();
