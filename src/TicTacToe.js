import { useState } from 'react';
import './TicTacToe-style.css';

const calculateWinner = (squares) => {
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
    if (squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return [null, null];
};

const Square = (props) => {
  const squareClass = "square" + 
    (props.winner ? " highlight" : "") + 
    (props.value || props.end ? " selected" : "");
  return (
    <button
      className={squareClass}
      onClick={props.onClick}
    >
      {props.value ? props.value : "."}
    </button>
  );
};

const Board = (props) => {
  const renderSquare = i => (
    <Square
      end={props.gameEnd}
      winner={props.winningSquares && props.winningSquares.includes(i)}
      value={props.squares[i]}
      onClick={() => props.onClick(i)}
    />
  );

  return (
    <div className="board-container">
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

const TicTacToe = () => {
  const [state, setState] = useState({
    history: [{ squares: Array(9).fill(null) }],
    stepNumber: 0,
    xIsNext: true
  });
  const history = state.history;
  const current = history[state.stepNumber];
  const [winner, winningLine] = calculateWinner(current.squares);
  let status;
  let end = false;
  if (winner) {
    status = 'Winner is ' + winner;
    end = true;
  } else if (!current.squares.includes(null)) {
    end = true;
    status = 'Nobody won.'
  }  else {
    status = 'Next player: ' + (state.xIsNext ? 'X' : 'O');
  }

  const moves = history.map((_, move) => {
    return (
      <li key={move}>
        <button
          className={move === state.stepNumber ? "history-btn highlight" : "history-btn"}
          onClick={() => jumpTo(move)}
        >{move}</button>
      </li>
    );
  });

  const jumpTo = (step) => {
    setState({
      history: state.history,
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  };

  const handleClick = i => {
    const history = state.history.slice(0, state.stepNumber + 1);
    const current = history[history.length - 1];
    const newSquares = current.squares.slice();
    if (calculateWinner(newSquares)[0] || newSquares[i]) {
      return;
    }
    newSquares[i] = state.xIsNext ? 'X' : 'O';
    setState({
      history: history.concat(
        [{ squares: newSquares }]
      ),
      stepNumber: history.length,
      xIsNext: !state.xIsNext
    });
  };

  const restart = () => {
    setState({
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0,
      xIsNext: true
    });
  };

  return (
    <div className="main-container">
      <div className="status">{status}</div>
      <Board
        gameEnd={end}
        winningSquares={winningLine}
        squares={current.squares}
        onClick={(i) => handleClick(i)}
      />
      <div className="game-info">
        <div>Steps:</div>
        <ol>{moves}</ol>
      </div>
      <div className="bot-panel">
        <button className="restart" onClick={restart}>Restart</button>
      </div>
    </div>
  );
};

export default TicTacToe;