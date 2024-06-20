import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Engine, Render, Bodies, World } from 'matter-js';

interface Props {
  numDrops: number;
}

export function PinkoBoard({ numDrops }: Props) {
  const scene = useRef() as React.LegacyRef<HTMLDivElement> | undefined;
  const engine = useRef(Engine.create());
  const rows = numDrops;

  useEffect(() => {
    const cw = document.body.clientWidth;
    const ch = document.body.clientHeight;
    const pinSpacing = cw / rows;

    if (scene) {
      const render = Render.create({
        element: scene.current,
        engine: engine.current,
        options: {
          width: cw,
          height: ch,
          wireframes: false,
          background: 'transparent',
        },
      });

      //Create world
      World.add(engine.current.world, [
        Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
        Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
        Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
        Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true }),
      ]);

      //Create plinko pins
      for (let row = 1; row <= rows; row++) {
        for (let col = 0; col < row; col++) {
          const x = cw / 2 - ((row - 1) * pinSpacing) / 2 + col * pinSpacing;
          const y = row * pinSpacing;

          if (row > 1) {
            const pin = Bodies.circle(x, y, 5, {
              isStatic: true,
              render: {
                fillStyle: 'black',
              },
            });
            World.add(engine.current.world, [pin]);
          }
        }
      }

      //Draw ball
      const ball = Bodies.circle(cw / 2, pinSpacing, pinSpacing / 2.17, {
        restitution: 1,
        friction: 0.5,
        render: { fillStyle: 'red' },
      });
      World.add(engine.current.world, [ball]);

      //Start runing and renderling
      Engine.run(engine.current);
      Render.run(render);

      return () => {
        Render.stop(render);
        World.clear(engine.current.world, true);
        Engine.clear(engine.current);
        render.canvas.remove();
      };
    }
  }, []);

  return <div ref={scene} style={{ width: '100vw', height: '100vh' }} />;
}
