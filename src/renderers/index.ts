import { debounce } from '../helpers';

const req = require.context('./items', true, /\.ts$/);
const keys = req.keys().filter((key) =>  key !== './index.ts');

const renderers = keys.reduce((items:any, filePath) => {
  const regexResult:any = /^\.\/(?<fileName>\w+)\.ts$/.exec(filePath);
  if (regexResult === null) throw new Error(`Couldn't import ${filePath} properly`);
  const key = regexResult.groups.fileName;
  items[key] = req(filePath).default;
  return items;
}, {});

export default (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');

  if (ctx === null) throw new Error('ctx is null');

  const { innerWidth, innerHeight, devicePixelRatio } = window;

  let width = innerWidth;
  let height = innerHeight;

  const getWidth = () => width;
  const getHeight = () => height;
  
  let activeRenderer: any = null;

  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;

  ctx.scale(devicePixelRatio, devicePixelRatio);

  window.addEventListener('resize', debounce(() => {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    if (activeRenderer !== null) {
      activeRenderer.draw(true);
    }
  }, 100));

  return {
    listRenderers() {
      return Object.keys(renderers);
    },
    async changeActive(name: string) {
      if (! renderers.hasOwnProperty(name)) {
        throw new Error(`No renderer ${name}`);
      }

      if (activeRenderer !== null) {
        activeRenderer.destroy();
      }

      activeRenderer = new renderers[name]({
        canvas,
        ctx,
        getWidth,
        getHeight,
      });

      await activeRenderer.awaitSetup();

      activeRenderer.draw();
    },
  };

}