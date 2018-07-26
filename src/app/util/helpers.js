/**
 * @module UIHelper
 * @author R.Keyan
 */
const UIHelper = {
  findEl: (selector, parent = document) => {
    if (!selector) return false;
    return parent.querySelector(selector);
  },
  // oh no
  noop: () => {}
};

export default UIHelper;
