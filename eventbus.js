/**
 * Event emitter and receiver class.
 */
export default class Eventbus {
  static events = {};
  /**
   * Executes all events added to given event name with details as parameter.
   * @param eventName {string} Name of the event
   * @param [details] {object} Contains more information about the event
   */
  static emit(eventName, details = {}) {
    if (!eventName)
      throw TypeError(
        `Parameter eventName is not correctly filled. Expected: string with length > 0, got ${eventName}`
      );
    const eventCopy = [...Eventbus.events[eventName]];
    eventCopy?.forEach((entry) => {
      entry.cb(details);
      if (entry.once)
        Eventbus.events[eventName].splice(
          Eventbus.events[eventName].indexOf(entry),
          1
        );
    });
  }
  /**
   * Adds callback to given event name.
   * More event names can be triggered by dividing event names with space.
   * @param eventName {string} Name of the event
   * @param cb {Function} Callback to execute on emitting the event
   * @param [once] {boolean} The callback should only be fired once
   */
  static on(eventName, cb, once = false) {
    if (!eventName)
      throw TypeError(
        `Parameter eventName is not correctly filled. Expected: string with length > 0, got ${eventName}`
      );
    const allEvents = eventName.split(' ');
    allEvents.forEach((event) => {
      if (!Eventbus.events[event]) Eventbus.events[event] = [];
      Eventbus.events[event].push({ cb, once });
    });
  }
  /**
   * Removes given callback from event.
   * @param eventName {string} Event to remove the callback from
   * @param cb {Function} Callback to be removed
   */
  static remove(eventName, cb) {
    if (!eventName)
      throw TypeError(
        `Parameter eventName is not correctly filled. Expected: string with length > 0, got ${eventName}`
      );
    if (!cb)
      throw TypeError(
        `Parameter cb is not correctly filled. Expected: Function, got ${typeof cb}`
      );
    if (!Eventbus.events[eventName])
      throw ReferenceError(`Could not find event with name ${eventName}`);
    Eventbus.events[eventName].splice(
      Eventbus.events[eventName].findIndex((entry) => entry.cb === cb),
      1
    );
  }
  /**
   * Removes all callbacks from event.
   * @param eventName {string} Event to remove all callbacks from
   */
  static removeAll(eventName) {
    if (!eventName)
      throw TypeError(
        `Parameter eventName is not correctly filled. Expected: string with length > 0, got ${eventName}`
      );
    if (!Eventbus.events[eventName])
      throw ReferenceError(`Could not find event with name ${eventName}`);
    Eventbus.events[eventName] = [];
  }
}
