import './index.css';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

window.addEventListener('load', () => {

  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;

  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  ctx.fillStyle = 'green';

  // const radius = 50;

  // ctx.arc(200, 200, radius, 0, Math.PI * 2 * radius);
  // ctx.fill();

  window.ctx = ctx;

  const animatedCircle = ({
    x,
    y,
    ctx,
    color,
    startingRadius,
    endingRadius,
    duration,
  }) => {
    const radiusDifference = endingRadius - startingRadius;

    const animate = () => {
      const currentTime = performance.now();
      if (startTime === null) startTime = currentTime;

      const difference = currentTime - startTime; // how many ms through the animation it is
      const percentageComplete = difference / duration;

      const radius = (percentageComplete >= 1)
        ? endingRadius
        : (percentageComplete === 0)
        ? startingRadius
        : startingRadius + percentageComplete * radiusDifference;

      if (percentageComplete >= 1) {
        finished = true;
      }


      // console.log('setting color', color);
      ctx.fillStyle = 'red'
      ctx.arc(x, y, radius, 0, Math.PI * radius * 2);
      ctx.fill();
      ctx.closePath();
    }

    const end = () => {

    }


    let startTime = null;
    let finished = false;

    return {
      animate,
      end,
      isFinished: _ => finished,
    };

  }

  let circles = [];

  let isLoopRunning = false;

  const loop = () => {
    isLoopRunning = true;
    hasStartingLoopBeenQueued = false;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    circles = circles.filter((circle) => {
      circle.animate();
      return !circle.isFinished();
    });

    // ctx.fill();

    if (circles.length === 0) {
      isLoopRunning = false;
      return;
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
  let hasStartingLoopBeenQueued = true;

  const colorHandler = () => {
    const availableColors = ['red', 'green', 'yellow'];
    let index = -1;

    const getColor = () => {
      index++;
      if (index > availableColors.length - 1) index = 0;
      return availableColors[index];
    }

    return { getColor };
  }

  const { getColor } = colorHandler();

  canvas.addEventListener('click', (e) => {
    const x = e.pageX;
    const y = e.pageY;


    const circle = animatedCircle({
      ctx,
      x,
      y,
      color: getColor(),
      startingRadius: 10,
      endingRadius: window.innerWidth,
      duration: 5000,
    });

    circles.push(circle);

    if (isLoopRunning || hasStartingLoopBeenQueued) return;
    hasStartingLoopBeenQueued = true;
    requestAnimationFrame(loop);
  });

});