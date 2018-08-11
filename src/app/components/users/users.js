import usersService from './users.service';
import dispatcher from '../../core/dispatcher';
import {
  PAGINATION_UPDATED,
  RECALCULATE_AVAILABLE_PAGES,
  USERS_RECEIVED,
} from '../../constants/events';
import usersItem from './usersItem';
import noop from '../../helpers/noop';
import './users.scss';
import findEl from '../../helpers/findElement';


/**
 * @module Users
 * @author R.Keyan
 */
const usersModule = (() => {
  const SEARCH_FORM_ID = 'js-search-users';
  const USERS_LIST_ID = 'users-list';

  let subscriptions = new Map();
  let initialized = false;

  const getForm = () => {
    return findEl(`#${SEARCH_FORM_ID}`);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const input = findEl('input', e.target);
    if (input) {
      const needUser = input.value;
      usersService.getUsers(needUser)
        .then((data) => {
          dispatcher.publish(USERS_RECEIVED, [...data.items]);
          dispatcher.publish(RECALCULATE_AVAILABLE_PAGES, {
            total: data.total_count,
            current: usersService.page,
          });
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  };

  const onUsersReceived = (users) => {
    const rootContainer = findEl(`#${USERS_LIST_ID}`);
    rootContainer.innerHTML = '';

    users.forEach((user) => {
      rootContainer.insertAdjacentHTML('afterbegin', usersItem(user));
    });
  };

  const onPaginationUpdated = (page) => {
    usersService.setPage(page);
    onSubmit({
      preventDefault: noop,
      target: getForm(),
    });
  };

  /**
   * Run after render function
   * @returns {boolean}
   */
  const afterViewInit = () => {
    const form = getForm();
    if (!form) return false;

    form.addEventListener('submit', onSubmit);
    const sub1 = dispatcher.subscribe(USERS_RECEIVED, onUsersReceived);
    const sub2 = dispatcher.subscribe(PAGINATION_UPDATED, onPaginationUpdated);

    subscriptions.set(USERS_RECEIVED, sub1);
    subscriptions.set(PAGINATION_UPDATED, sub2);

    initialized = true;

    return true;
  };

  const destroy = () => {
    if (!initialized) return false;
    subscriptions.forEach(dispatcher.unsubscribe);

    const form = getForm();
    if (form) {
      form.removeEventListener('submit', onSubmit);
    }

    subscriptions.clear();
    initialized = false;

    return true;
  };

  const render = () => {
    return `
        <div class="users-list">
          <form id='${SEARCH_FORM_ID}' class="form-inline my-2 my-lg-0">
           <input class="form-control mr-sm-2" type="search" placeholder="Search for users" aria-label="Search">
           <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
          <div id="${USERS_LIST_ID}" class="row">
          <!-- ITEMS MUST BE THERE -->
          </div>
        </div>
     `;
  };

  return { render, afterViewInit, destroy };

})();

export default usersModule;
