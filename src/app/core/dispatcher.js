/**
 * @name: Dispatcher
 * @description: Mediator pattern, Pub/Sub functionality
 * @autor R.Keyan
 */
function dispatcher() {
  const channels = {};

  /**
   * Channels for subscription
   * @param channel
   * @param subscription
   * @returns {number}
   */
  const subscribe = (channel, subscription) => {
    if (!channels[channel]) {
      channels[channel] = [];
    }
    channels[channel].push(subscription);
    return channels[channel].length - 1;
  };

  /**
   * Publish channel subscriber
   * @param channel
   * @param args
   */
  const publish = (channel, ...args) => {
    if (!channels[channel]) return;

    channels[channel].forEach((subscription) => {
      if (typeof subscription === 'function') {
        /* eslint prefer-spread: 0 */
        subscription.apply(null, args);
      }
    });
  };

  /** unsubscribe
   * Unsubscribe from channel
   * @param channel
   * @param subscriptionNumber
   */
  const unsubscribe = (subscriptionNumber, channel) => {
    channels[channel][subscriptionNumber] = null;
  };

  return {
    subscribe,
    publish,
    unsubscribe
  };
}

export default dispatcher();
