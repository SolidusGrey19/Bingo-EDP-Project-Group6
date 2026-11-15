import './App.css';
import './AppBingo.css';
import { useState } from 'react';

function Bingo() {
  const [called, setCalled] = useState([]);  // numbers drawn so far
  const [winner, setWinner] = useState('');  // '', 'player', 'bot', 'tie'

  return (
    <div className="App">
      <header className="App-header bingo-page">
        <h1>Bingo Game</h1>
        <p className="bingo-rule">
          Win by completing a row, column, diagonal, or the 4 corners.
        </p>

        <div className="mydiv bingo-panel">
          <p>Numbers called ({called.length}): {called.join(', ')}</p>
        </div>

        <h2>Your Cards</h2>
        <div className="bingo-row"></div>

        <h2>Bot Cards</h2>
        <div className="bingo-row"></div>
      </header>
    </div>
  );
}

export default Bingo;