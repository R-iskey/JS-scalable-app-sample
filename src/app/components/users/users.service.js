import Service from '../../core/service';

/**
 * @class UserService
 * @author R.Keyan
 * @pattern Singleton
 */
class UsersService extends Service {
  constructor() {
    super();
    this.page = 1;
  }

  async getUsers(username) {
    const url = this.buildUrl('/search/users', {
      q: `${username} in:login`,
      type: 'Users',
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

export default new UsersService();
