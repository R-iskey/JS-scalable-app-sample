import reposService from './repos.service';
import dispatcher from '../../core/dispatcher';
import {
  PAGINATION_UPDATED,
  RECALCULATE_AVAILABLE_PAGES,
  REPOS_RECEIVED,
} from '../../constants/events';
import repoItem from './reposItem';
import noop from '../../helpers/noop';

import './repos.scss';
import findEl from '../../helpers/findElement';

/**
 * Module Users
 */
const reposModule = (() => {
  const SEARCH_FORM_ID = 'js-search-repos';
  const REPOS_LIST_ID = 'repos-list';

  const subscriptions = new Map();
  let initialized = false;

  const getForm = () => {
    return findEl(`#${SEARCH_FORM_ID}`);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const input = findEl('input', e.target);
    if (input) {
      const needRepo = input.value;
      reposService.getUsers(needRepo)
        .then((data) => {
          dispatcher.publish(REPOS_RECEIVED, [...data.items]);
          dispatcher.publish(RECALCULATE_AVAILABLE_PAGES, {
            total: data.total_count,
            current: reposService.page,
          });
        })
        .catch((error) => {
          throw new Error(error);
        });

    }
    return false;
  };

  const onReposReceived = (repos) => {
    const rootContainer = findEl(`#${REPOS_LIST_ID}`);
    rootContainer.innerHTML = '';
    repos.forEach((repo) => {
      rootContainer.insertAdjacentHTML('afterbegin', repoItem(repo));
    });
  };

  const onPaginationUpdated = (page) => {
    reposService.setPage(page);
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
    form.addEventListener('submit', onSubmit);

    const sub1 = dispatcher.subscribe(REPOS_RECEIVED, onReposReceived);
    const sub2 = dispatcher.subscribe(PAGINATION_UPDATED, onPaginationUpdated);

    subscriptions.set(REPOS_RECEIVED, sub1);
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
    reposService.resetPage();

    initialized = false;

    return true;
  };

  const render = () => {
    return `
        <div class="repos-list">
          <form id=${SEARCH_FORM_ID} class="form-inline my-2 my-lg-0">
           <input class="form-control mr-sm-2" type="search" placeholder="Search for repos" aria-label="Search">
           <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
          <ul id="${REPOS_LIST_ID}" class="list-unstyled">
            <!-- REPOS MUST BE THERE -->
          </ul>
        </div>
     `;
  };

  return { render, afterViewInit, destroy };

})();

export default reposModule;
