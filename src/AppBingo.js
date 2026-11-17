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
    if (colIdx === 2) nums[2] = 'FREE';
    return nums;
  });

  return Array.from({ length: 5 }, (_, rowIdx) =>
    columns.map((col) => col[rowIdx])
  );
}

function generateThreeCards() {
  return [generateCard(), generateCard(), generateCard()];
}

const isMarked = (cell, called) => cell === 'FREE' || called.includes(cell);

function hasBingo(card, called) {
  const lines = [];

  for (let i = 0; i < 5; i++) {
    lines.push(card[i]);                   
    lines.push(card.map((row) => row[i])); 
  }

  lines.push([0, 1, 2, 3, 4].map((i) => card[i][i]));     
  lines.push([0, 1, 2, 3, 4].map((i) => card[i][4 - i])); 
  lines.push([card[0][0], card[0][4], card[4][0], card[4][4]]); 

  return lines.some((line) => line.every((cell) => isMarked(cell, called)));
}

const letterFor = (n) => 'BINGO'[Math.floor((n - 1) / 15)];


function Bingo() {
  const [called, setCalled] = useState([]); 
  const [winner, setWinner] = useState(''); 
  const [playerCards, setPlayerCards] = useState(() => generateThreeCards());
  const [botCards, setBotCards] = useState(() => generateThreeCards());
  const [lastNumber, setLastNumber] = useState(null);
  const [remainingNumbers, setRemainingNumbers] = useState(
  Array.from({ length: 75 }, (_, i) => i + 1)
);
  const drawNumber = () => {
    if (remainingNumbers.length === 0 || winner) return;

    const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
    const number = remainingNumbers[randomIndex];

    setLastNumber(number);
    setCalled(prev => [...prev, number]);
    setRemainingNumbers(prev =>
      prev.filter(n => n !== number)
    );
  };

  
  
  
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
  <h2>Number Randomizer</h2>

  <h1 style={{ fontSize: '60px', color: '#ffc107' }}>
    {lastNumber || '--'}
  </h1>

  <button
    onClick={drawNumber}
    disabled={remainingNumbers.length === 0 || winner !== ''}
  >
    Draw Bingo Number
  </button>

  <button onClick={() => {
    setCalled([]);
    setLastNumber(null);
    setRemainingNumbers(Array.from({ length: 75 }, (_, i) => i + 1));
    setWinner('');
  }}>
    Reset
  </button>

  <p>Numbers Called: {called.length}/75</p>
</div>

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




