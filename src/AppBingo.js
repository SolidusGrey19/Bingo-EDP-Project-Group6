import './App.css';
import './AppBingo.css';
import { useState } from 'react';

function generateCard() {
  const ranges = [
    [1, 15],
    [16, 30],
    [31, 45],
    [46, 60],
    [61, 75],
  ];

  const columns = ranges.map(([min, max], colIdx) => {
    const nums = [];
    while (nums.length < 5) {
      const n = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!nums.includes(n)) nums.push(n);
    }
    if (colIdx === 2) nums[2] = 'FREE'; // Center space
    return nums;
  });

  return Array.from({ length: 5 }, (_, rowIdx) =>
    columns.map((col) => col[rowIdx])
  );
}

function generateThreeCards() {
  return [generateCard(), generateCard(), generateCard()];
}

function Bingo() {
  const [called, setCalled] = useState([]); // numbers drawn so far
  const [winner, setWinner] = useState(''); // '', 'player', 'bot', 'tie'
  const [playerCards, setPlayerCards] = useState(() => generateThreeCards());
  const [botCards, setBotCards] = useState(() => generateThreeCards());

  // Helper to render a single 5x5 card as a <table>
  const renderCard = (card, cardIndex) => (
    <table key={cardIndex} className="bingo-card">
      <thead>
        <tr>
          {['B', 'I', 'N', 'G', 'O'].map((letter) => (
            <th key={letter} className="bingo-letter">
              {letter}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {card.map((row, rIdx) => (
          <tr key={rIdx}>
            {row.map((cell, cIdx) => {
              const isMarked = cell === 'FREE' || called.includes(cell);
              return (
                <td
                  key={cIdx}
                  className={`bingo-cell ${isMarked ? 'marked' : ''}`}
                >
                  {cell}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );

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
        <div className="bingo-row">
          {playerCards.map((card, idx) => renderCard(card, idx))}
        </div>

        <h2>Bot Cards</h2>
        <div className="bingo-row">
          {botCards.map((card, idx) => renderCard(card, idx))}
        </div>
      </header>
    </div>
  );
}

export default Bingo;
