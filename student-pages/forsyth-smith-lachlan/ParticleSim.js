class ParticleSimulation {
    constructor(width, height, particle_count, terrain, params) {
        this.width = width;
        this.height = height;
        this.particleParameters = params;
        this.terrain = terrain; // we get an object reference to a marching square grid object to check collisions and modify its points
        this.particles = []
        this.maxFoodParticles = 100;
        this.maxLivingParticles = 100;
        this.foodParticles = []

        for (let i = 0; i < particle_count; i++) {
            // add a particle object to the particle array with a random position inside width and height
            const params = random(this.particleParameters);
            this.particles.push(new Particle(this.getNonSolidGridPosition(), params))
        }
    }
    spawnFood(particle) {
        this.foodParticles.push(new Food(particle));
        if (this.foodParticles.length > this.maxFoodParticles) {
            this.foodParticles.shift();
        }
    }
    splitParticle(particle) {

        // half particle's energy
        particle.energy = particle.energy / 2
        const params = { "id": particle.id, "colour": particle.colour, "cohesion": particle.cohesion, "aversion": particle.aversion }
        let split = new Particle(createVector(particle.pos.x + random(15), particle.pos.y + random(15)), params);
        split.vel = p5.Vector.random2D().mult(2);

        // copy attributes from particle
        split.energy = particle.energy;
        split.radius = split.getRadius(split.energy);
        split.renderedRadius = split.radius;

        // push a copy of the particle to the particles array
        this.particles.push(split);

    }
    draw() {
        const deltaSeconds = deltaTime / 1000

        // deletes particles if there's too many being added (starting from index 0)
        if (this.particles.length > this.maxLivingParticles) {
            for (let i = 0; i < this.particles.length - this.maxLivingParticles; i++) {
                this.particles.shift();
            }
        }

        // this splits up the screen into a 2D array, objects are pushed to the nearest grid
        // this means we don't have to check every single particle with each other
        // although collisions near each grid's edges won't be checked reliably
        // something like a bounding volume hierarchy or a KD tree would be better but is harder to implement
        const spatialPartition = new SpatialPartition(5);

        // draw particles food
        fill(255, 128);
        stroke(255, 128);
        strokeWeight(3)

        // iterating through food array
        for (let i = 0; i < this.foodParticles.length; i++) {
            const food = this.foodParticles[i];

            if (food.energy <= 0) {
                this.foodParticles.slice(i, 1); // remove food particle from array
                continue;
            }

            // update physics for food particle
            food.update();

            // draw food
            food.draw();

            // add to spatial partition
            spatialPartition.addToPartitionFromObjectPos(food);
        }

        // iterate through particles;
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];

            // a particle should die if its energy is < 0 and we respawn a new one
            // we also leave a food particle behind with its old energy value 
            if (particle.energy <= 0) {
                // replace particle with a new one and skip this iteration
                this.spawnFood(particle);
                particle.respawn(this.getNonSolidGridPosition());
                continue;
            } else if (particle.energy > 50) {
                this.splitParticle(particle);
            }

            particle.update();
            particle.draw();

            // get particle's position on the grid
            const grid_pos = this.terrain.ScreenSpaceToGridSpace(particle.pos.x, particle.pos.y)
            // respawn particle if out of bounds
            if (!this.terrain.isInsideGrid(grid_pos.x, grid_pos.y)) {
                particle.respawn(this.getNonSolidGridPosition());
                // replace particle with a new one and skip this iteration
                continue;
            }
            // respawn if particle hits marching squares terrain
            if (this.terrain.isPointSolid(grid_pos.x, grid_pos.y)) {

                // deletes a part of the terrain,
                this.terrain.addValueCircle(grid_pos.x, grid_pos.y, 2, -0.1);
                this.spawnFood(particle);
                particle.respawn(this.getNonSolidGridPosition());
                // replace particle with a new one and skip this iteration
                continue;
            }

            // trival barrier detection
            const distance_check_pos = this.terrain.ScreenSpaceToGridSpace(
                particle.pos.x + particle.vel.x * 40,
                particle.pos.y + particle.vel.y * 40
            )
            if (this.terrain.isPointSolid(distance_check_pos.x, distance_check_pos.y) || !this.terrain.isInsideGrid(distance_check_pos.x, distance_check_pos.y)) {
                particle.acc.add(particle.vel.x * particle.aversion * deltaSeconds, particle.vel.y * particle.aversion * deltaSeconds);
            }
            // push(); // DEBUG: show distance check grid square
            // fill(0, 50);
            // stroke("red");
            // square(distance_check_pos.x * this.terrain.SQUARE_SIZE, distance_check_pos.y * this.terrain.SQUARE_SIZE, this.terrain.SQUARE_SIZE);
            // line(particle.pos.x, particle.pos.y, distance_check_pos.x * this.terrain.SQUARE_SIZE, distance_check_pos.y * this.terrain.SQUARE_SIZE, this.terrain.SQUARE_SIZE);
            // pop();

            // add to spatial paritiion array grid
            spatialPartition.addToPartitionFromObjectPos(particle);

            // push(); // debug: show which grid square is being checked for particle
            // fill(0, 50);
            // stroke(255);
            // square(grid_pos.x * this.terrain.SQUARE_SIZE, grid_pos.y * this.terrain.SQUARE_SIZE, this.terrain.SQUARE_SIZE);
            // line(particle.pos.x, particle.pos.y, grid_pos.x * this.terrain.SQUARE_SIZE, grid_pos.y * this.terrain.SQUARE_SIZE, this.terrain.SQUARE_SIZE);
            // pop();
        }

        // iterates through all the space partitions checking the distance between each points
        for (let partitionIndex_X = 0; partitionIndex_X < spatialPartition.spatialPartition.length; partitionIndex_X++) {
            for (let partitionIndexY = 0; partitionIndexY < spatialPartition.spatialPartition.length; partitionIndexY++) {
                const partition = spatialPartition.spatialPartition[partitionIndex_X][partitionIndexY];
                // iterate through the particles stored in the partition
                for (let i = 0; i < partition.length; i++) {

                    // skip iteration if its not a particle
                    if (partition[i].constructor.name != "Particle") {
                        continue;
                    }
                    const particle = partition[i];
                    // nested iteration through particles in partition to get other 
                    for (let j = 0; j < partition.length; j++) {
                        // make sure the other particle isn't the same particle
                        const other = partition[j];
                        if (particle != other) {
                            let distanceVector = p5.Vector.sub(other.pos, particle.pos);
                            // square distance between particles
                            // this means we avoid doing a pointless square root (which would be slower)
                            const squareDistance = sqrDist(particle.pos.x, particle.pos.y, other.pos.x, other.pos.y);
                            // if same id
                            if (particle.id == other.id) {

                                // particle cohesion
                                // this implementation of particle cohesion was based off Dan Shiffman's flocking algorithm for boids
                                // it simply adds the distance vector to the particle / boid's position vector * a cohesion strength factor 
                                particle.pos.add(distanceVector.mult(particle.cohesion * deltaSeconds));
                            } else { // different id / no id

                                const collisionDistance = Math.pow(particle.radius + other.radius, 2);
                                const isColliding = squareDistance <= collisionDistance;

                                const isOtherFood = other.constructor.name == "Food";

                                // if the other object is food
                                // we pull the food object to the particle
                                if (isOtherFood) {
                                    // power of two becaue we are comparing the square distance
                                    const foodGrabDistance = pow(100, 2)
                                    const foodGrabForce = -0.01 * particle.energy;
                                    const foodGrabAcceleration = foodGrabForce / ((1 / other.energy) + 10)
                                    if (squareDistance <= foodGrabDistance) {
                                        other.vel.add(distanceVector.normalize().mult(foodGrabAcceleration));
                                    }

                                    // move towards food
                                    particle.acc.add(p5.Vector.sub(other.pos, particle.pos).mult(1 / squareDistance));

                                }
                                if (isColliding && (particle.energy > other.energy || (isOtherFood && other.canPickUp))) {
                                    particle.energy += other.energy;
                                    other.energy = 0;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    getNonSolidGridPosition() {
        let x_pos = random(width);
        let y_pos = random(height);
        let grid_pos = this.terrain.ScreenSpaceToGridSpace(x_pos, y_pos);
        let is_solid = this.terrain.isPointSolid(grid_pos.x, grid_pos.y);

        // if the spawn location is inside terrain, keep generating random locations until it finds a free location
        // tries 10 times then gives up, possibily spawning player inside terrain (better than an infinite while loop)
        for (let index = 0; index < 10; index++) {
            if (!is_solid)
            {
                break;
            }
            x_pos = random(width);
            y_pos = random(height);
            grid_pos = this.terrain.ScreenSpaceToGridSpace(x_pos, y_pos);
            is_solid = this.terrain.isPointSolid(grid_pos.x, grid_pos.y);
        }
        return createVector(x_pos, y_pos)
    }
}


class Particle {
    constructor(position, params) {

        // physics
        this.pos = position;
        this.vel = p5.Vector.random2D().mult(2);
        this.acc = createVector(0, 0);

        // what "team" the particle is on
        // e.g. particles with the same id won't absorb each other
        this.id = params.id;

        // colour of particle
        this.colour = params.colour

        // how strong a particle is pulled with particles with the same id
        this.cohesion = params.cohesion;

        // how strong a particle is pulled to / away the terrain
        this.aversion = params.aversion;

        // note: when a particle's energy <= 0 it should die
        this.energy = random(5, 10);

        // radius is proportional to energy
        this.radius = this.getRadius(this.energy);

        // this is the radius that is actually rendered (it is interpolated to `this.radius` for smoother animation)
        this.renderedRadius = this.radius;
    }
    update() {
        // update particle's physics
        this.energy -= deltaTime / 1000
        this.radius = this.getRadius(this.energy);
        this.vel.add(this.acc);
        this.vel.limit(2)
        this.pos.add(this.vel);
    }
    draw() {
        this.renderedRadius = lerp(this.renderedRadius, this.radius, 0.1);
        fill(this.colour);
        circle(this.pos.x, this.pos.y, this.renderedRadius * 2);
    }
    respawn(position) {
        this.pos = position;
        this.vel = p5.Vector.random2D().mult(5);
        this.acc = createVector(0, 0);
        this.energy = random(5, 10);
        this.radius = this.getRadius(this.energy);
        this.renderedRadius = this.radius;
    }
    getRadius(energy) {
        return Math.sqrt(energy * 10);
    }
}

class Food {
    constructor(particle) {
        // we pass in particle is a constructor arg to get its attributes
        this.pos = particle.pos;
        this.vel = particle.vel;
        this.acc = createVector(0, 0);
        this.energy = particle.energy;
        this.radius = Math.sqrt(this.energy * 10)
        this.lifetime = 0; // how long its been alive for (seconds)
        this.pickupTime = 1.6; // seconds
        this.canPickUp = false; // whether a particle can pick up / absorb its energy
        this.decayRate = 4;
    }
    getRadius(energy) {
        return Math.sqrt(energy * 10);
    }
    draw() {
        // text((this.energy).toString(), this.pos.x, this.pos.y) // DEBUG: show energy of food particle
        circle(this.pos.x, this.pos.y, this.getRadius(this.energy) * 2);
    }
    update() {
        // drag
        this.energy -= this.decayRate * (deltaTime / 1000)
        this.vel.lerp(createVector(0, 0), 0.1);
        this.lifetime += deltaTime / 1000
        this.canPickUp = this.lifetime >= this.pickupTime;
        this.vel.add(this.acc);
        this.pos.add(this.vel);
    }
    getRadius(energy) {
        return Math.sqrt(energy * 10);
    }
}

class SpatialPartition {
        // trival implementation of space partitioning for collision detection / distance checking
        // objects are added to a 2D array of arrays depending on their position in divided "partitions" of space
        // ideas and concepts from: https://www.youtube.com/watch?v=eED4bSkYCB8
    constructor(partitionCount) {
        this.partitionSize = floor(width / partitionCount);
        this.spatialPartition = [];
        for (let x = 0; x < this.partitionSize; x++) {
            this.spatialPartition.push([])
            for (let y = 0; y < this.partitionSize; y++) {
                this.spatialPartition[x][y] = []
                // square(x *this.partitionSize, y * this.partitionSize, this.partitionSize); // DEBUG show partition grid (SLOW)
            }
        }
    }
    addToPartitionFromObjectPos(object) {
        // we int floor (round down) to a partition index
        // using min() and max() to avoid a index out of bounds (positions outside partition will be pushed to the nearest partition)
        const paritiionGridX = max(min(floor(object.pos.x / this.partitionSize), this.spatialPartition.length - 1), 0);
        const paritiionGridY = max(min(floor(object.pos.y / this.partitionSize), this.spatialPartition.length - 1), 0);
        this.spatialPartition[paritiionGridX][paritiionGridY].push(object);
    }
}

function sqrDist(x1, y1, x2, y2) {
    // this is *much* faster than `dist()` by skipping costly sqrt approximations
    // NOTE: will not return the exact distance but the distance^2
    // return value likely should be scaled down or compared with another squared value
    // https://en.wikipedia.org/wiki/Magnitude_(mathematics)#Euclidean_vector_space
    return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
}

