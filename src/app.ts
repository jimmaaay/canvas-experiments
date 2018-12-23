import { init } from './router';
import renderer from './renderers';

let activeRenderer: any = null;

const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const { changeActive, listRenderers } = renderer(canvas);

const renderers = listRenderers();
const routerArray = renderers.map((renderer) => {
  const niceURL = renderer
    .replace(/([A-Z])/g, (char) => ` ${char.toLowerCase()}`)
    .trim()
    .replace(/ /g, '-');

  return {
    name: renderer,
    path: `/${niceURL}/`,
    callback: changeActive,
  };
});

const router = init(routerArray);

const nav = document.createElement('nav');
routerArray.forEach((route) => {
  const a = document.createElement('a');
  a.href = `#${route.path}`;
  a.textContent = route.name;
  nav.appendChild(a);
});

document.body.appendChild(nav);