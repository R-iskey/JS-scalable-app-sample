import Service from '../../core/service';

/**
 * @class ReposService
 * @author R.Keyan
 * @pattern Singleton
 */
class ReposService extends Service {
  constructor() {
    super();
    this.page = 1;
  }

  async getUsers(username) {
    const url = this.buildUrl('/search/repositories', {
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
