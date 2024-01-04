class _Node {
    public f = 0; // Total cost
    public g = 0; // Cost from start to this node
    public h = 0; // Heuristic cost estimate from this node to the end
    constructor(
        public id: string, 
        public x: number, 
        public y: number, 
        public neighbors: _Node[]
    ) {}
}

function aStar(start: _Node, goal: _Node, heuristic: (node: _Node, goal: _Node) => number): _Node[] {
    let openSet: _Node[] = [start];
    let cameFrom: Map<_Node, _Node> = new Map();

    while (openSet.length > 0) {
        let current = openSet.reduce((a, b) => a.f < b.f ? a : b);

        if (current === goal) {
            return reconstructPath(cameFrom, current);
        }

        openSet = openSet.filter(node => node !== current);
        current.neighbors.forEach(neighbor => {
            const tentativeGScore = current.g + 1; // Assuming each edge has the same cost

            if (tentativeGScore < neighbor.g || !openSet.includes(neighbor)) {
                cameFrom.set(neighbor, current);
                neighbor.g = tentativeGScore;
                neighbor.h = heuristic(neighbor, goal);
                neighbor.f = neighbor.g + neighbor.h;

                if (!openSet.includes(neighbor)) openSet.push(neighbor);
            }
        });
    }

    return []; // No path found
}

function reconstructPath(cameFrom: Map<_Node, _Node>, current: _Node): _Node[] {
    let totalPath = [current];
    while (cameFrom.has(current)) {
        current = cameFrom.get(current)!;
        totalPath.unshift(current);
    }
    return totalPath;
}

function heuristic(node: _Node, goal: _Node): number {
    // Currently set to Euclidean Distance (we can modify this later)
    return Math.sqrt(Math.pow(node.x - goal.x, 2) + Math.pow(node.y - goal.y, 2));
}

let nodeA = new _Node('A', 0, 0, []);
let nodeB = new _Node('B', 1, 1, [nodeA]);
nodeA.neighbors.push(nodeB);

// Using the A* algorithm
let path = aStar(nodeA, nodeB, heuristic);
console.log(path)




