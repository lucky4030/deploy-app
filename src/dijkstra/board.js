import React from 'react';
import './board.css';
import Node from './node';
import {dijkstra, getNodesInShortestPathOrder} from './algo';
var START_NODE_ROW = 10;
var START_NODE_COL = 15;
var FINISH_NODE_ROW = 10;
var FINISH_NODE_COL = 35;
var flag_for_start_selecton=1;
var flag_for_end_selection =1;
var flag_for_algo_status=0;
const visitedNodes=[];
export default class Board extends React.Component {
	constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      
    	};
	}
	componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  	}
  	handleMouseDown(row, col) {
  	if( flag_for_start_selecton ===1 && flag_for_end_selection ===1)
  	{
  		const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  	}
    else if( flag_for_start_selecton === 0 )
    {
    	START_NODE_ROW=row;
    	START_NODE_COL=col;
    	const newGrid =getInitialGrid();
  	this.setState({ grid:newGrid , mouseIsPressed: true });
    	flag_for_start_selecton =1;

    }
    else if( flag_for_end_selection === 0)
    {
    	FINISH_NODE_ROW=row;
    	FINISH_NODE_COL=col;
    	const newGrid =getInitialGrid();
  	this.setState({ grid:newGrid , mouseIsPressed: true });
    	flag_for_end_selection=1;
    setTimeout(	() => {alert("now click to select wall !!"); } , 1000);
    }
  }

  handleMouseEnter(row, col) {
if( flag_for_start_selecton ===1 && flag_for_end_selection ===1)
  	{
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }
}

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  clearboard(){
  	flag_for_start_selecton =0;
  	flag_for_end_selection =0;
  	START_NODE_ROW=0;
  	START_NODE_COL=0;
  	FINISH_NODE_ROW=0;
  	FINISH_NODE_COL=0;
  	if( flag_for_algo_status === 1)
  	{
  		for( let i=0; i< visitedNodes.length ; i++)
  		{
  			const node=visitedNodes[i];
  			document.getElementById(`node-${node.row}-${node.col}`).className=
  			'node node-unvisited';
  		}
  	}
  	flag_for_algo_status = 0;
  	const newGrid =getInitialGrid();
  	this.setState({ grid:newGrid , mouseIsPressed: false });
  	
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
  	if( flag_for_start_selecton===0 || flag_for_end_selection===0 )
  	{
  		alert("please select start and finish points first!!");
  	}
  	else{
  	flag_for_algo_status=1;

    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
   	const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);

   	for(let i=0; i< visitedNodesInOrder.length; i++)
   	{
   		visitedNodes[i]=visitedNodesInOrder[i];
   	}
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  	}
  }
	render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
      	<button className="visualbutton" onClick={() => this.visualizeDijkstra()}> Visualize dijkstra </button>
      	<button className="clearbutton" onClick ={() => this.clearboard()} > CLEAR-BOARD </button>
      	<p id="cordinate">coordinate:  start node = { START_NODE_ROW } { START_NODE_COL }  finish node = { FINISH_NODE_ROW } { FINISH_NODE_COL }</p>
        <div className="board">
          {grid.map( (row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                }
                 )}
              </div>
            );
          } )
            }
        </div>
      </>
    );
  }

 
}
 const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 53; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
	};

  const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
 	 };
  };

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
