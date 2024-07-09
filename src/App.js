import React, { useState } from "react";
import { Button, Container, Row, Col, ListGroup, ListGroupItem, ButtonGroup } from "react-bootstrap";

function Square({ value, onSquareClick, highlight }) {
  const style = highlight ? { color: 'red', fontWeight: 'bold' } : {};
  return (
    <Button variant="outline-primary" className="square" onClick={onSquareClick} style={style}>
      {value}
    </Button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo.winner;

  function handleClick(i) {
    if (winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (!squares.includes(null)) { // Check if all squares are filled
    status = 'Draw: No one wins!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  // Render squares and board rows
  const renderSquare = (i) => (
    <Square
      value={squares[i]}
      onSquareClick={() => handleClick(i)}
      highlight={winner && winnerInfo.line.includes(i)}
    />
  );

  const size = 3; // Assuming a 3x3 Tic-Tac-Toe board
  let board = [];

  for (let row = 0; row < size; row++) {
    let boardRow = [];
    for (let col = 0; col < size; col++) {
      boardRow.push(
        <Col key={row * size + col} className="p-0">
          {renderSquare(row * size + col)}
        </Col>
      );
    }
    board.push(<Row key={row} className="board-row">{boardRow}</Row>);
  }

  return (
    <Container>
      <div className="status mb-3">{status}</div>
      {board}
    </Container>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true); // State to track sort order
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = history.slice(0, currentMove + 1);
    nextHistory.push(nextSquares);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleSortToggle() {
    setIsAscending(!isAscending); // Toggle the order
  }

  const moves = history.map((squares, move) => {
    const description = move ?
      `Go to move #${move}` :
      'Go to game start';
    
    // Apply bold styling if the current move is the one selected
    const style = move === currentMove ? { fontWeight: 'bold' } : {};

    return (
      <ListGroupItem key={move} className="list-group-item">
        <Button variant="link" onClick={() => jumpTo(move)} style={style}>{description}</Button>
      </ListGroupItem>
    );
  });

  if (!isAscending) {
    moves.reverse(); // Reverse the order of moves if descending
  }

  return (
    <Container className="game mt-3">
      <Row className="flex-nowrap">
        <Col md={8} className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </Col>
        <Col md={4} className="game-info">
          <ButtonGroup className="mb-3">
            <Button variant="primary" onClick={handleSortToggle}>
              {isAscending ? 'Sort Descending' : 'Sort Ascending'}
            </Button>
          </ButtonGroup>
          <ListGroup as="ol">{moves}</ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}
