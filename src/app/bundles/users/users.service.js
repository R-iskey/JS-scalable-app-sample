import ApiBuilder from '../../core/apiBuilder';

/**
 * @class UserService
 * @author R.Keyan
 * @pattern Singleton
 */
class UsersService {
  constructor() {
    this.page = 1;
  }

  async getUsers(username) {
    const url = ApiBuilder.buildUrl('/search/users', {
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
