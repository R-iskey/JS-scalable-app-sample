const findEl = (selector, parent = document) => {
  if (!selector) return false;
  return parent.querySelector(selector);
};

export default findEl;
