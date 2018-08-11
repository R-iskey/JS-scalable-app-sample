import dispatcher from './dispatcher';
import { ROUTER_CHANGED } from '../constants/events';

/**
 * @module Router
 * @license Absurd.js [https://github.com/krasimir/absurd]
 * @modified R.Keyan
 */
const router = {
  routes: [],

  /**
   * Routing mode
   * @type {string}
   * @default 'history'
   */
  mode: '',

  /**
   * root url
   * @default '/'
   * @type {string}
   */
  root: '/',

  /**
   * @type {Element|null}
   */
  outletRoot: null,

  defaultOptions: {
    mode: 'history',
    root: '',
    routerOutlet: '',
  },

  config(options = this.defaultOptions) {
    this.mode = (options.mode === 'history' && !!(window.history.pushState)) ? 'history' : 'hash';
    this.root = options.root ? `/${this.clearSlashes(options.root)}/` : '/';
    this.outletRoot = options.routerOutlet || document.getElementById('router-outlet');
    return this;
  },

  /**
   * @description Get url Fragment
   * @returns {*}
   */
  getFragment() {
    let fragment = '';
    const { location } = window;

    if (this.mode === 'history') {
      fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
      fragment = fragment.replace(/\?(.*)$/, '');
      fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;
    } else {
      const match = window.location.href.match(/#(.*)$/);
      fragment = match ? match[1] : '';
    }
    return this.clearSlashes(fragment);
  },

  clearSlashes(path) {
    return path.toString()
      .replace(/\/$/, '')
      .replace(/^\//, '');
  },

  /**
   * Register route
   * @param re
   * @param module
   * @returns Self{Object}
   */
  add(re, module) {
    /* eslint no-param-reassign: 0 */
    if (typeof re === 'function') {
      module = re;
      re = '';
    }
    this.routes.push({ re, module });
    return this;
  },

  remove(param) {
    let r;
    for (let i = 0; i < this.routes.length; i++) {
      r = this.routes[i];
      if (r.module === param || r.re.toString() === param.toString()) {
        this.routes.splice(i, 1);
        return this;
      }
    }
    return this;
  },

  flush() {
    this.routes = [];
    this.mode = '';
    this.root = '/';
    return this;
  },

  /**
   * @description check url and run module with component lifecycles
   * component's available lifecycles: afterViewInit, destroy
   * component's 'render' method call every time when we change route
   * @param fragment
   * @returns Self{Object}
   */
  check(fragment = this.getFragment()) {
    this.routes.forEach((route) => {
      const match = fragment.match(route.re);
      const { module } = route;

      if (match) {
        match.shift();
        this.outletRoot.innerHTML = '';

        const htmlTemplate = module.render ? module.render() : '';
        if (!htmlTemplate || typeof htmlTemplate !== 'string') {
          throw new Error('Modules render method should return HTML string');
        }
        this.outletRoot.innerHTML = htmlTemplate;

        if (module.afterViewInit) {
          module.afterViewInit();
        }
        dispatcher.publish(ROUTER_CHANGED, fragment);
      } else if (module.destroy) {
        module.destroy();
      }
    });
    return this;
  },

  /**
   * Keep updates from route changes
   * @returns {router}
   */
  listen() {
    const that = this;
    let current = that.getFragment();
    const fn = function () {
      if (current !== that.getFragment()) {
        current = that.getFragment();
        that.check(current);
      }
    };
    clearInterval(this.interval);
    this.interval = setInterval(fn, 50);
    return this;
  },

  navigate(path = '') {
    if (this.mode === 'history') {
      window.history.pushState(null, null, this.root + this.clearSlashes(path));
    } else {
      window.location.href = `${window.location.href.replace(/#(.*)$/, '')}#${path}`;
    }
    return this;
  },
};

export default router;
