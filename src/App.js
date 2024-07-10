import React, { useState } from 'react';
import { Button, Container, Row, Col, ListGroup, ListGroupItem, ButtonGroup } from 'react-bootstrap';
import './styles.css'; // Ensure this path is correct

// Define the Square component, which represents each square in the Tic-Tac-Toe board
function Square({ value, onSquareClick, highlight }) {
  // Determine the style for the square, applying a special style if it's part of the winning line
  const style = highlight ? { color: 'red', fontWeight: 'bold' } : {};

  // Render a Bootstrap button as a square in the Tic-Tac-Toe board
  return (
    <Button 
      variant="outline-primary" // Bootstrap button variant
      className="square" // Custom CSS class
      onClick={onSquareClick} // Event handler for button click
      style={style} // Apply the determined style
    >
      {value} {/* Display the value of the square ('X', 'O', or null) */}
    </Button>
  );
}

// Define the Board component, which represents the entire Tic-Tac-Toe board
function Board({ xIsNext, squares, onPlay }) {
  // Determine if there's a winner and get the winning line information
  const winnerInfo = calculateWinner(squares); // Get the winner information
  const winner = winnerInfo.winner; // Extract the winner ('X' or 'O') from the result

  // Handle a square click event
  function handleClick(i) {
    // Ignore the click if there's already a winner or the square is occupied
    if (winner || squares[i]) {
      return; // Exit the function early
    }

    // Create a copy of the squares array to avoid mutating the original state
    const nextSquares = squares.slice(); // Create a shallow copy of the squares array
    nextSquares[i] = xIsNext ? 'X' : 'O'; // Update the clicked square with 'X' or 'O'

    // Pass the updated squares array to the parent component
    onPlay(nextSquares); // Invoke the onPlay function passed as a prop
  }

  // Determine the game status message
  let status;
  if (winner) {
    status = 'Winner: ' + winner; // If there's a winner, display the winner
  } else if (!squares.includes(null)) { // Check if all squares are filled
    status = 'Draw: No one wins!'; // If all squares are filled and no winner, declare a draw
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O'); // Indicate the next player
  }

  // Helper function to render a square
  const renderSquare = (i) => (
    <Square
      value={squares[i]} // Value of the square ('X', 'O', or null)
      onSquareClick={() => handleClick(i)} // Event handler for square click
      highlight={winner && winnerInfo.line.includes(i)} // Highlight if part of the winning line
    />
  );

  const size = 3; // Define the size of the Tic-Tac-Toe board (3x3)
  let board = []; // Initialize an array to hold the board rows

  // Construct the board rows and columns
  for (let row = 0; row < size; row++) { // Loop through each row
    let boardRow = []; // Initialize an array to hold the squares in the current row
    for (let col = 0; col < size; col++) { // Loop through each column in the current row
      boardRow.push(
        <Col key={row * size + col} className="p-0"> {/* Bootstrap column for layout */}
          {renderSquare(row * size + col)} {/* Render each square */}
        </Col>
      );
    }
    board.push(<Row key={row} className="board-row">{boardRow}</Row>); // Add the row to the board
  }

  // Render the board and status message
  return (
    <Container> {/* Bootstrap container for layout */}
      <div className="status mb-3">{status}</div> {/* Display the game status */}
      {board} {/* Display the constructed board */}
    </Container>
  );
}

// Define the Game component, which represents the entire Tic-Tac-Toe game
export default function Game() {
  // Initialize state variables
  const [history, setHistory] = useState([Array(9).fill(null)]); // Array to track the history of moves
  const [currentMove, setCurrentMove] = useState(0); // Track the current move index
  const [isAscending, setIsAscending] = useState(true); // State to track sort order of the history
  const xIsNext = currentMove % 2 === 0; // Determine if 'X' is the next player based on the move index
  const currentSquares = history[currentMove]; // Get the squares for the current move from the history

  // Handle a play event by updating the history and current move
  function handlePlay(nextSquares) {
    const nextHistory = history.slice(0, currentMove + 1); // Get the history up to the current move
    nextHistory.push(nextSquares); // Add the new squares to the history
    setHistory(nextHistory); // Update the history state
    setCurrentMove(nextHistory.length - 1); // Update the current move state
  }

  // Handle a jump to a specific move in the history
  function jumpTo(nextMove) {
    setCurrentMove(nextMove); // Set the current move to the selected move
  }

  // Toggle the sort order of the move history
  function handleSortToggle() {
    setIsAscending(!isAscending); // Toggle the order
  }

  // Generate the list of move history buttons
  const moves = history.map((squares, move) => {
    const description = move ?
      `Go to move #${move}` : // Description for each move
      'Go to game start'; // Description for the start of the game
    
    // Apply bold styling if the current move is the one selected
    const style = move === currentMove ? { fontWeight: 'bold' } : {};

    return (
      <ListGroupItem key={move} className="list-group-item"> {/* List group item for each move */}
        <Button variant="link" onClick={() => jumpTo(move)} style={style}>{description}</Button> {/* Button to jump to a specific move */}
      </ListGroupItem>
    );
  });

  // Reverse the order of moves if descending
  if (!isAscending) {
    moves.reverse();
  }

  // Render the game board and the move history
  return (
    <div className="game-container">
      <div className="title">Tic-Tac-Toe</div> {/* Add the title here */}
      <Container className="game mt-3"> {/* Bootstrap container for layout */}
        <Row className="flex-nowrap"> {/* Bootstrap row for layout */}
          <Col md={8} className="game-board"> {/* Bootstrap column for the game board */}
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} /> {/* Render the game board */}
          </Col>
          <Col md={4} className="game-info"> {/* Bootstrap column for the game info */}
            <ButtonGroup className="mb-3"> {/* Button group for sort toggle */}
              <Button variant="primary" onClick={handleSortToggle}> {/* Button to toggle sort order */}
                {isAscending ? 'Sort Descending' : 'Sort Ascending'} {/* Button label */}
              </Button>
            </ButtonGroup>
            <ListGroup as="ol">{moves}</ListGroup> {/* List group for the move history */}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

// Helper function to determine the winner
function calculateWinner(squares) {
  // Define all possible winning combinations
  const lines = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal from top-left to bottom-right
    [2, 4, 6], // Diagonal from top-right to bottom-left
  ];
  
  // Check each line for a winning combination
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]; // Get the indices of the squares in the current line
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) { // Check if all squares in the line have the same value
      return { winner: squares[a], line: [a, b, c] }; // Return the winner and the winning line
    }
  }
  return { winner: null, line: [] }; // Return no winner if no combination found
}
