import usersService from './users.service';
import dispatcher from '../../core/dispatcher';
import EVENT_TYPES from '../../constants/events';
import usersItem from './usersItem';
import UIHelper from '../../util/helpers';
import './users.scss';


/**
 * @module Users
 * @author R.Keyan
 */
const usersModule = (() => {
  const SEARCH_FORM_ID = 'js-search-users';
  const USERS_LIST_ID = 'users-list';

  const subscriptions = new Map();
  let initialized = false;

  const getForm = () => {
    return UIHelper.findEl(`#${SEARCH_FORM_ID}`);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const input = UIHelper.findEl('input', e.target);
    if (input) {
      const needUser = input.value;
      usersService.getUsers(needUser)
        .then((data) => {
          dispatcher.publish(EVENT_TYPES.USERS_RECEIVED, [...data.items]);
          dispatcher.publish(EVENT_TYPES.RECALCULATE_AVAILABLE_PAGES, {
            total: data.total_count,
            current: usersService.page,
          });
        })
        .catch((error) => {
          throw new Error(error);
        });

    }
    return false;
  };

  const onUsersReceived = (users) => {
    const rootContainer = UIHelper.findEl(`#${USERS_LIST_ID}`);
    rootContainer.innerHTML = '';

    users.forEach((user) => {
      rootContainer.insertAdjacentHTML('afterbegin', usersItem(user));
    });
  };

  const onPaginationUpdated = (page) => {
    usersService.setPage(page);
    onSubmit({
      preventDefault: UIHelper.noop,
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
    const sub1 = dispatcher.subscribe(EVENT_TYPES.USERS_RECEIVED, onUsersReceived);
    const sub2 = dispatcher.subscribe(EVENT_TYPES.PAGINATION_UPDATED, onPaginationUpdated);

    subscriptions.set(EVENT_TYPES.USERS_RECEIVED, sub1);
    subscriptions.set(EVENT_TYPES.PAGINATION_UPDATED, sub2);

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
          <form id=${SEARCH_FORM_ID} class="form-inline my-2 my-lg-0">
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
