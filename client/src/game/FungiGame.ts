import * as THREE from 'three';

export interface FungiNode {
  id: string;
  position: THREE.Vector3;
  parentId: string | null;
  age: number;
}

export interface Link {
  source: THREE.Vector3;
  target: THREE.Vector3;
  id: string;
}

export class FungiGame {
  nodes: FungiNode[] = [];
  links: Link[] = [];
  
  resources = {
    water: 50,
    nutrients: 50,
    darkness: 50
  };

  wants = ['Water', 'Nutrients', 'Darkness'];
  currentWant = 'Water';
  wantTimer = 0;
  WANT_CYCLE_TIME = 20; // seconds

  growthRate = 0.05;
  lastUpdate = 0;

  constructor() {
    this.reset();
  }

  reset() {
    this.nodes = [];
    this.links = [];
    // Initial Seed
    const rootId = crypto.randomUUID();
    this.nodes.push({
      id: rootId,
      position: new THREE.Vector3(0, 0, 0),
      parentId: null,
      age: 0
    });
    
    // Add initial branches
    for(let i=0; i<3; i++) {
      this.growNode(rootId);
    }
  }

  update(delta: number) {
    this.wantTimer += delta;
    if (this.wantTimer > this.WANT_CYCLE_TIME) {
      this.wantTimer = 0;
      this.currentWant = this.wants[Math.floor(Math.random() * this.wants.length)];
    }

    // Resource Consumption (simulated decay)
    this.resources.water = Math.max(0, this.resources.water - delta * 0.5);
    this.resources.nutrients = Math.max(0, this.resources.nutrients - delta * 0.3);
    // Darkness doesn't decay, it's environmental, but let's fluctuate it slightly
    
    // Growth Logic
    if (Math.random() < this.growthRate) {
      this.attemptGrowth();
    }
  }

  attemptGrowth() {
    // Simple rule: Needs resources > 20 to grow
    if (this.resources.water > 20 && this.resources.nutrients > 20) {
      // Pick a random node to branch from, favoring younger nodes (tips)
      const candidates = this.nodes.filter(n => n.age < 50); // Arbitrary age limit for growth
      if (candidates.length === 0) return;

      const parent = candidates[Math.floor(Math.random() * candidates.length)];
      this.growNode(parent.id);
      
      // Consume resources
      this.resources.water -= 2;
      this.resources.nutrients -= 2;
    }
  }

  growNode(parentId: string) {
    const parent = this.nodes.find(n => n.id === parentId);
    if (!parent) return;

    // Random direction but generally upwards/outwards
    const direction = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      Math.random() * 1.5, // Tend upwards
      (Math.random() - 0.5) * 2
    ).normalize().multiplyScalar(0.5 + Math.random() * 0.5); // Length 0.5 to 1.0

    const newPos = parent.position.clone().add(direction);
    const newId = crypto.randomUUID();

    this.nodes.push({
      id: newId,
      position: newPos,
      parentId: parentId,
      age: 0
    });

    this.links.push({
      id: `${parentId}-${newId}`,
      source: parent.position,
      target: newPos
    });
  }

  addResource(type: 'water' | 'nutrients' | 'darkness', amount: number) {
    // @ts-ignore
    this.resources[type] = Math.min(100, this.resources[type] + amount);
  }
}

export const gameInstance = new FungiGame();
