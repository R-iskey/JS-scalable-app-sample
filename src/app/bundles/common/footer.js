import UIHelper from '../../util/helpers';
import dispatcher from '../../core/dispatcher';
import EVENT_TYPES from '../../constants/events';
import ApiConstants from '../../constants/api';

const footerModule = (() => {
  const perPage = ApiConstants.DEFAULT_PER_PAGE;

  let totalItems = 0;
  let currentPage = 1;

  let render;
  let prevPage;
  let nextPage;

  const onRecalculate = ({ total, current }) => {
    currentPage = current;
    totalItems = total;

    render();
  };

  const resetPagination = () => {
    onRecalculate({ total: 0, current: 1 });
  };

  dispatcher.subscribe(EVENT_TYPES.RECALCULATE_AVAILABLE_PAGES, onRecalculate);
  dispatcher.subscribe(EVENT_TYPES.ROUTER_CHANGED, resetPagination);

  const afterViewInit = () => {
    const container = UIHelper.findEl('.pagination');
    if (!container) return false;

    const btnNext = UIHelper.findEl('.next');
    if (btnNext) {
      btnNext.addEventListener('click', nextPage);
    }

    const btnPrev = UIHelper.findEl('.prev');
    if (btnPrev) {
      btnPrev.addEventListener('click', prevPage);
    }
    return true;
  };

  const numPages = () => {
    return Math.ceil(+totalItems / +perPage);
  };

  const changePage = (page) => {
    /* eslint no-param-reassign: 0 */
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    dispatcher.publish(EVENT_TYPES.PAGINATION_UPDATED, page);
  };

  prevPage = () => {
    if (currentPage > 1) {
      currentPage--;
      changePage(currentPage);
    }
  };

  nextPage = () => {
    if (currentPage < numPages()) {
      currentPage++;
      changePage(currentPage);
    }
  };

  render = () => {
    const footer = UIHelper.findEl('footer');
    if (!footer) {
      throw new Error('Please specify <footer>');
    }

    let template = '';
    if (totalItems) {
      template = `
        <nav aria-label="Page navigation">
          <ul class="pagination mt-2">
            ${currentPage > 1 ? '<li class="page-item prev"><a class="page-link" href="javascript:;">Previous</a></li>' : ''}
            ${currentPage !== numPages() ? '<li class="page-item next"><a class="page-link" href="javascript:;">Next</a></li>' : ''}
          </ul>
        </nav>
      `;
    }
    footer.innerHTML = template;

    afterViewInit();
    return true;
  };

  return { render };
})();

export default footerModule;
