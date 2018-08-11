import router from '../../core/router';
import findEl from '../../helpers/findElement';

const headerModule = (() => {

  const NAVBAR_MENU_LIST_ID = 'navbar-menu-list';

  const getNavLinkItems = (links) => {
    const els = [];
    links.forEach((nav) => {
      const li = `
        <li class="nav-item ${nav.isActive ? 'active' : ''}">
            <a class="nav-link" href="javascript:;" data-path="${nav.url}">${nav.display}</a>
        </li>`;

      els.push(li);
    });

    return els;
  };

  const onClick = (e) => {
    const { target } = e;
    if (!target) return false;

    const { path } = target.dataset;
    return router.navigate(path);
  };


  const render = (routes) => {
    const header = findEl('header');
    if (!header) {
      throw Error('Please set <header> tag');
    }

    const template = `
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul id='${NAVBAR_MENU_LIST_ID}' class="navbar-nav mr-auto">
            <!-- LINKS MUST BE THERE -->
           ${getNavLinkItems(routes).join('')}
          </ul>
        </div>
      </nav>
    `;
    header.innerHTML = template;

    const ul = findEl(`#${NAVBAR_MENU_LIST_ID}`);
    if (ul) {
      ul.addEventListener('click', onClick);
    }
    return template;
  };

  return { render };
})();

export default headerModule;
