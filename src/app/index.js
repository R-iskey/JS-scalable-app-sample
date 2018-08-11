import './index.scss';

import headerModule from './components/common/header';
import footerModule from './components/common/footer';
import router from './core/router';
import usersModule from './components/users/users';
import reposModule from './components/repos/repos';
import dispatcher from './core/dispatcher';
import { ROUTER_CHANGED } from './constants/events';
import Service from './core/service';
import { API_HOST } from './constants/api';


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

  Service.setBaseUrl(API_HOST);

  // add urls
  router.config({ mode: 'history' });
  routes.forEach((route) => {
    router.add(route.url, route.module);
  });

  const fragment = router.getFragment() || routes[0].url;
  router.navigate(fragment);

  // Install static contents
  dispatcher.subscribe(ROUTER_CHANGED, (newPath) => {
    routes = routes.map((route) => {
      const currentRoute = Object.assign({}, route);
      currentRoute.isActive = newPath === currentRoute.url;
      return currentRoute;
    });
    headerModule.render(routes);
  });
  footerModule.render();

  router
    .check()
    .listen();
}());
