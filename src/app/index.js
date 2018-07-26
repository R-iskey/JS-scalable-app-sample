import './index.scss';

import headerModule from './bundles/common/header';
import footerModule from './bundles/common/footer';
import router from './core/router';
import usersModule from './bundles/users/users';
import reposModule from './bundles/repos/repos';
import dispatcher from './core/dispatcher';
import EVENT_TYPES from './constants/events';


(function () {

  let routes = [
    {
      display: 'Users',
      module: usersModule,
      url: 'users',
      isActive: false
    },
    {
      display: 'Repos',
      module: reposModule,
      url: 'repos',
      isActive: false
    }
  ];

  // add urls
  router.config({ mode: 'history' });
  routes.forEach((route) => {
    router.add(route.url, route.module);
  });

  const fragment = router.getFragment() || routes[0].url;
  router.navigate(fragment);

  // Install static contents
  dispatcher.subscribe(EVENT_TYPES.ROUTER_CHANGED, (newPath) => {
    routes = routes.map((route) => {
      const r = Object.assign({}, route);
      r.isActive = newPath === r.url;
      return r;
    });
    headerModule.render(routes);
  });
  footerModule.render();

  router
    .check()
    .listen();
}());
