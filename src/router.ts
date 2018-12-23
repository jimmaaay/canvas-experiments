import { EventEmitter } from 'events';

interface Route {
  /**
   * The url path to match
   */
  path: string;
  /**
   * The callback to call when the path is hit
   */
  callback: Function; 
  /**
   * The name of the route
   */
  name?: string;
}

export const init = (routes: Route[]) => {

  const events = new EventEmitter();

  const run = () => {
    const pathFromHash = window.location.hash.replace('#', '');

    const matchingRoute = routes.find((route) => {
      return route.path === pathFromHash;
    });

    if (matchingRoute == null) {
      return console.warn(`No matching route for ${pathFromHash}`);
    }

    events.emit('BEFORE_ROUTE_CHANGE');
    matchingRoute.callback(matchingRoute.name);
  };

  if (window.location.hash === '') {
    window.location.hash = `#${routes[0].path}`;
  }

  run();
  window.addEventListener('hashchange', run);

  return {
    on: events.on,
    removeListener: events.removeListener,
  };

}