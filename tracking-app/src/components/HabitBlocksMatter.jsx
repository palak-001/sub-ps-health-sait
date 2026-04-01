import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

export function HabitBlocksMatter() {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const [bodies, setBodies] = useState([]);

  useEffect(() => {
    if (!sceneRef.current) return;

    // 1. Setup Matter Engine and World
    const engine = Matter.Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    // Dimensions
    const width = sceneRef.current.clientWidth;
    const height = 600;

    // 2. Static Boundaries
    const wallOptions = { isStatic: true, render: { visible: false } };
    const ground = Matter.Bodies.rectangle(width / 2, height + 50, width + 100, 100, wallOptions);
    const leftWall = Matter.Bodies.rectangle(-50, height / 2, 100, height * 2, wallOptions);
    const rightWall = Matter.Bodies.rectangle(width + 50, height / 2, 100, height * 2, wallOptions);
    const ceiling = Matter.Bodies.rectangle(width / 2, -500, width + 100, 100, wallOptions); // High ceiling to drop from

    // 3. Create 5 Distinct Shapes
    // Hydration: Rectangle
    const hydration = Matter.Bodies.rectangle(width * 0.2, -100, 240, 120, {
      restitution: 0.5,
      friction: 0.1,
      label: 'Hydration'
    });

    // Sleep Quality: Pill (Rectangle with chamfer)
    const sleep = Matter.Bodies.rectangle(width * 0.4, -200, 270, 90, {
      chamfer: { radius: 45 },
      restitution: 0.6,
      label: 'Sleep Quality'
    });

    // Daily Steps: Square/Rectangle
    const steps = Matter.Bodies.rectangle(width * 0.6, -150, 180, 180, {
      restitution: 0.4,
      friction: 0.2,
      label: 'Daily Steps'
    });

    // Mindfulness: Hexagon (Polygon) or Small Circle? User asked for rectangles, circles, pills.
    // Let's make this a pill but oriented vertically or just a small circle
    const mindfulness = Matter.Bodies.rectangle(width * 0.8, -250, 210, 105, {
      restitution: 0.7,
      label: 'Mindfulness'
    });

    // Daily Wellness Score: Large Circle
    const wellness = Matter.Bodies.circle(width / 2, -400, 120, {
      restitution: 0.8,
      friction: 0.05,
      label: 'Daily Wellness Score'
    });

    const shapeBodies = [hydration, sleep, steps, mindfulness, wellness];
    Matter.World.add(world, [ground, leftWall, rightWall, ceiling, ...shapeBodies]);

    // 4. Mouse Constraint for dragging
    const mouse = Matter.Mouse.create(sceneRef.current);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    Matter.World.add(world, mouseConstraint);

    // 5. Setup Runner
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Save bodies to state for React to render DOM elements
    setBodies(shapeBodies);

    // 6. Animation loop to update React state (or direct DOM manipulation for performance)
    let animationFrameId;
    const updateDOM = () => {
      // We do direct DOM manipulation for performance instead of React state
      shapeBodies.forEach((body) => {
        const el = document.getElementById(`matter-body-${body.id}`);
        if (el) {
          el.style.transform = `translate(calc(${body.position.x}px - 50%), calc(${body.position.y}px - 50%)) rotate(${body.angle}rad)`;
        }
      });
      animationFrameId = requestAnimationFrame(updateDOM);
    };
    updateDOM();

    return () => {
      cancelAnimationFrame(animationFrameId);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      Matter.World.clear(world);
      // Removed Matter.Mouse.clear(mouse) because it doesn't exist
    };
  }, []);

  const getBodyStyle = (body) => {
    const isPill = body.label === 'Sleep Quality';
    const isCircle = body.label === 'Daily Wellness Score';
    const isSteps = body.label === 'Daily Steps';
    const isHydration = body.label === 'Hydration';
    
    // Base styles (Neobrutalist)
    const style = {
      position: 'absolute',
      top: 0,
      left: 0,
      border: '4px solid black',
      boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '900',
      textAlign: 'center',
      padding: '10px',
      userSelect: 'none',
      cursor: 'grab',
      willChange: 'transform',
      // Dynamic dimensions based on the physics bodies created above
    };

    if (isCircle) {
      style.width = '240px'; // r=120
      style.height = '240px';
      style.borderRadius = '50%';
      style.backgroundColor = '#fde047'; // yellow
      style.fontSize = '2rem';
    } else if (isPill) {
      style.width = '270px';
      style.height = '90px';
      style.borderRadius = '45px';
      style.backgroundColor = '#ec4899'; // pink
      style.fontSize = '1.5rem';
    } else if (isSteps) {
      style.width = '180px';
      style.height = '180px';
      style.backgroundColor = '#3b82f6'; // blue
      style.fontSize = '1.5rem';
    } else if (isHydration) {
      style.width = '240px';
      style.height = '120px';
      style.backgroundColor = '#10b981'; // green
      style.fontSize = '1.5rem';
    } else { // Mindfulness
      style.width = '210px';
      style.height = '105px';
      style.backgroundColor = '#a855f7'; // purple
      style.fontSize = '1.5rem';
    }

    return style;
  };

  return (
    <div 
      ref={sceneRef} 
      className="relative w-full overflow-hidden bg-white border-4 border-black mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      style={{ height: '600px' }}
    >
      {/* Background hint */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <h2 className="text-8xl font-black uppercase">Play!</h2>
      </div>

      {bodies.map((body) => {
        return (
          <div
            key={body.id}
            id={`matter-body-${body.id}`}
            style={getBodyStyle(body)}
            className="text-black transition-colors"
          >
            {body.label}
          </div>
        );
      })}
    </div>
  );
}
