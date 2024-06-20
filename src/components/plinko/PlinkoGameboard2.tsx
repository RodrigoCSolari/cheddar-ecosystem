import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Engine, Render, Bodies, World } from 'matter-js';

let engine, 
    world, 
    particles = [], 
    plinkos = [],
    bounds = [],
    cols = 11,
    rows = 9,
    particleSize = 10,
    plinkoSize = 14;

export function Setup() {
  createCanvas(600, 700);
  engine = Engine.create();
  world = engine.world;
  world.gravity.y = 2;
  
  newParticle();
  const spacing = width / cols;
  for (let j = 0; j < rows; j ++) {
    for (let i = 0; i < cols +1; i ++) {
      let x = i * spacing;
      if (j % 2 == 0) {
        x += spacing / 2;
      }
      const y = spacing + j * spacing;
      const p = new Plinko(x, y, plinkoSize);
      plinkos.push(p);
    }
  }
  
  b = new Boundary(width/2, height + 50, width, 100);
  
  bounds.push(b);
  for (let i = 0; i < cols +1; i ++) {
    const x = i * spacing;
    const h = 100;
    const w = 10;
    const y = height - h/2;
    let b = new Boundary(x, y, w, h);
    bounds.push(b);
  }

  
}

function newParticle() {
  const p = new Particle(random(100,600), 0, particleSize);
  particles.push(p);
}

function draw() {
  if (frameCount % 30 == 0) {
    newParticle();
  }
  background(51);
  Engine.update(engine);
  
  for (let i = 0; i < particles.length; i++) {
    particles[i].show();  
    if (particles[i].isOffScreen()) {
      World.remove(world, particles[i].body);
      particles.splice(i,1);
      i--;
    }
  }
  for (let i = 0; i < plinkos.length; i++) {
    plinkos[i].show();  
  }
  
  for (let i = 0; i < bounds.length; i++) {
    bounds[i].show();  
  }
}

// ======================================================
//           Particle.js
// ======================================================

function Particle(x,y,r) {
  
  this.r = random(255);
  this.g = random(255);
  this.b = random(255);
  const options = {
    isStatic : false,
    mass : 0,
    density : 1,
    restitution : 0.5,
    friction : 1
  }
  x += random(-1, 1);
  this.body = Bodies.circle(x, y, r, options);
  this.r = r;
  World.add(world, this.body);
}

Particle.prototype.isOffScreen = function() {
  const { x, y } = this.body.position;
  return (x < -50 || x > width + 50 || y > height + 50);
}

Particle.prototype.show = function() {
  noStroke();
  fill(this.r, this.g, this.b);
  const pos = this.body.position;
  push();
  translate(pos.x, pos.y);
  ellipse(0,0, this.r * 2); 
  pop();
}

// ======================================================
//           Plinko.js
// ======================================================

function Plinko(x,y,r) {
  const options = {
    isStatic : true,
    density : 1,
    restitution : 1,
    friction : 0
  }
  this.color = random(80,175);
  this.body = Bodies.circle(x,y,r, options);
  this.r = r;
  World.add(world, this.body);
}

Plinko.prototype.show = function() {
  fill(this.color);
  // stroke(255);
  noStroke();
  const {x, y } = this.body.position;
  push();
  translate(x, y);
  ellipse(0,0, this.r * 2);
  pop();
}


// ======================================================
//           Boundary.js
// ======================================================

function Boundary(x,y,w,h) {
  const options = {
    density : 1,
    friction: 1,
    isStatic : true
  };
  this.body = Bodies.rectangle(x,y,w,h, options);
  this.w = w;
  this.h = h;
  World.add(world, this.body);
}

Boundary.prototype.show = function() {
  fill(128);
  // stroke(255);
  noStroke();
  const {x, y} = this.body.position;
  push();
  translate(x, y);
  rectMode(CENTER);
  rect(0,0, this.w, this.h);
  pop();
}