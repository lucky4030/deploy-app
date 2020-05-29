export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue;
    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid);
  }
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}





// export function dijkstra ( grid , startnode , finishnode)
// {
// 	const unvisitednode=get_node(grid);
// 	const visitednode=[];
// 	while(!!unvisitednode.length )
// 	{
// 		sort_node(unvisitednode );
// 		const min_node=unvisitednode.shift();  // removes first element and return it
		
// 		if( min_node.iswall ) continue;
// 		if( min_node.distance === Infinity ) return visitednode;
// 		if( min_node === finishnode ) return visitednode;

// 		min_node.isVisited=true;
// 		visitednode.push(min_node);

// 		update_neighbour( min_node , grid );
// 	}
// }
// function get_node(grid)
// {
// 	const nodes=[];
// 	for( const row of grid )
// 		for( const node of row)
// 			nodes.push(node);
// 	return nodes;
// }
// function sort_node( nodes )
// {
// 	nodes.sort(  (node_a , node_b) => node_a.distance - node_b.distance ) ;
// }
// function update_neighbour( node , grid )
// {
// 	const neighbour=[];
// 	const {row ,col }= node;
	
// 	if (row > 0)   neighbour.push(grid[row - 1][col]);
//   	if (row < grid.length - 1)   neighbour.push(grid[row + 1][col]);
//  	if (col > 0)    neighbour.push(grid[row][col - 1]);
//   	if (col < grid[0].length - 1)   neighbour.push(grid[row][col + 1]);
	
// 	const neighbours=neighbour.filter(neigh => !neigh.isVisited);

// 	for( const inst of neighbours)
// 	{
// 		inst.distance=inst.distance+1;
// 		inst.previousNode=node;
// 	}
// }
// export function getNodesInShortestPathOrder(finishNode)
// {	
// 	const node_in_shortest_order=[];
// 	let current_node=finishNode;
// 	while( current_node != null )
// 	{
// 		node_in_shortest_order.unshift(current_node); // adds current_node as first element of array
// 		current_node=current_node.previousNode;
// 	}
// 	return node_in_shortest_order;
// }
