import React, { useState } from 'react';
import './App.css';

/**
 * Color palette provided by the client:
 *  - Primary:   #1976d2
 *  - Secondary: #e3e3e3
 *  - Accent:    #d32f2f
 */

/* PUBLIC_INTERFACE */
function App() {
  // Board state: array of 9 (null | "X" | "O")
  const [board, setBoard] = useState(Array(9).fill(null));
  // true for X's turn, false for O's turn
  const [xIsNext, setXIsNext] = useState(true);
  // Track if the game is over
  const winner = calculateWinner(board);
  const isDraw = !winner && board.every((cell) => cell !== null);

  // Returns "X" or "O" string, or null
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
    for (const [a, b, c] of lines) {
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }

  function handleSquareClick(idx) {
    if (board[idx] || winner) return;
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? "X" : "O";
    setBoard(nextBoard);
    setXIsNext((prev) => !prev);
  }

  function handleReset() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  let statusMsg;
  if (winner) {
    statusMsg = `Winner: ${winner}`;
  } else if (isDraw) {
    statusMsg = `Draw!`;
  } else {
    statusMsg = `Turn: ${xIsNext ? "X" : "O"}`;
  }

  // --- Rendered UI ---
  return (
    <div className="app ttt-app-bg">
      <main>
        <div className="ttt-container">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <div className="ttt-status" data-testid="game-status">{statusMsg}</div>
          <Board
            squares={board}
            onClick={handleSquareClick}
            winner={winner}
          />
          <button
            className="btn btn-large ttt-reset"
            onClick={handleReset}
            aria-label="Restart Game"
          >
            Reset Game
          </button>
          <div className="ttt-footer">
            <span style={{ fontSize: 13, color: "#aaa" }}>
              Minimalistic. Responsive. <span style={{ color: "#d32f2f", fontWeight: 500 }}>KAVIA</span>
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

/* PUBLIC_INTERFACE */
function Board({ squares, onClick, winner }) {
  // Return a 3x3 grid of squares
  function renderSquare(idx) {
    // Highlight winning line (if present)
    let highlight = false;
    const winLine = getWinningLine(squares);
    if (winLine && winLine.includes(idx)) {
      highlight = true;
    }
    return (
      <button
        key={idx}
        type="button"
        className={`ttt-square${highlight ? ' ttt-square--win' : ''}`}
        onClick={() => onClick(idx)}
        disabled={!!squares[idx] || !!winner}
        aria-label={squares[idx] ? `Cell ${idx + 1}: ${squares[idx]}` : `Empty cell ${idx + 1}`}
        tabIndex={0}
      >
        {squares[idx]}
      </button>
    );
  }

  // Render 3 rows
  return (
    <div className="ttt-board" role="grid">
      {[0, 1, 2].map((rowIdx) => (
        <div key={rowIdx} className="ttt-row" role="row">
          {[0, 1, 2].map((colIdx) => renderSquare(rowIdx * 3 + colIdx))}
        </div>
      ))}
    </div>
  );
}

// Identify which line (array of indices) won, or null if no win
function getWinningLine(squares) {
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
  for (const line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return line;
    }
  }
  return null;
}

export default App;