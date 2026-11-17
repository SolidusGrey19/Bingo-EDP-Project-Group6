import './App.css';
import './AppBingo.css';
import { useState } from 'react';

function getBingoLetter(number) {
  if (number >= 1 && number <= 15) {
    return 'B';
  } else if (number >= 16 && number <= 30) {
    return 'I';
  } else if (number >= 31 && number <= 45) {
    return 'N';
  } else if (number >= 46 && number <= 60) {
    return 'G';
  } else if (number >= 61 && number <= 75) {
    return 'O';
  }

  return '';
}

function generateCard() {
  const ranges = [
    [1, 15],
    [16, 30],
    [31, 45],
    [46, 60],
    [61, 75]
  ];

  const columns = ranges.map(([min, max], colIndex) => {
    const numbers = [];

    while (numbers.length < 5) {
      const number =
        Math.floor(Math.random() * (max - min + 1)) + min;

      if (!numbers.includes(number)) {
        numbers.push(number);
      }
    }

    if (colIndex === 2) {
      numbers[2] = 'FREE';
    }

    return numbers;
  });

  return Array.from({ length: 5 }, (_, rowIndex) =>
    columns.map(column => column[rowIndex])
  );
}

function generateThreeCards() {
  return [
    generateCard(),
    generateCard(),
    generateCard()
  ];
}

function getWinningPattern(card, calledNumbers) {
  const isMarked = (cell) =>
    cell === 'FREE' || calledNumbers.includes(cell);

  for (let row = 0; row < 5; row++) {
    if (card[row].every(isMarked)) {
      return 'Horizontal Row';
    }
  }

  for (let col = 0; col < 5; col++) {
    const completed = card.every(row => isMarked(row[col]));

    if (completed) {
      return 'Vertical Column';
    }
  }

  const diagonalOne = [0, 1, 2, 3, 4].every(index =>
    isMarked(card[index][index])
  );

  if (diagonalOne) {
    return 'Diagonal';
  }

  const diagonalTwo = [0, 1, 2, 3, 4].every(index =>
    isMarked(card[index][4 - index])
  );

  if (diagonalTwo) {
    return 'Diagonal';
  }

  const corners = [
    card[0][0],
    card[0][4],
    card[4][0],
    card[4][4]
  ];

  if (corners.every(isMarked)) {
    return 'Four Corners';
  }

  return null;
}

function findWinningCard(cards, calledNumbers) {
  for (let index = 0; index < cards.length; index++) {
    const pattern = getWinningPattern(cards[index], calledNumbers);

    if (pattern) {
      return {
        cardIndex: index,
        pattern: pattern
      };
    }
  }

  return null;
}

function Bingo() {

  const [called, setCalled] = useState([]);

  const [remainingNumbers, setRemainingNumbers] = useState(
    Array.from({ length: 75 }, (_, index) => index + 1)
  );

  const [lastNumber, setLastNumber] = useState(null);

  const [playerCards, setPlayerCards] = useState(() =>
    generateThreeCards()
  );

  const [botCards, setBotCards] = useState(() =>
    generateThreeCards()
  );

  const [winner, setWinner] = useState(null);

  const drawNumber = () => {

    if (remainingNumbers.length === 0 || winner) {
      return;
    }

    const randomIndex = Math.floor(
      Math.random() * remainingNumbers.length
    );

    const number = remainingNumbers[randomIndex];

    const updatedCalled = [...called, number];

    setCalled(updatedCalled);
    setLastNumber(number);

    setRemainingNumbers(previous =>
      previous.filter(n => n !== number)
    );

    const playerResult = findWinningCard(
      playerCards,
      updatedCalled
    );

    const botResult = findWinningCard(
      botCards,
      updatedCalled
    );

    if (playerResult && botResult) {

      setWinner({
        side: 'tie',
        playerCardIndex: playerResult.cardIndex,
        botCardIndex: botResult.cardIndex,
        pattern: playerResult.pattern
      });

    } else if (playerResult) {

      setWinner({
        side: 'player',
        playerCardIndex: playerResult.cardIndex,
        pattern: playerResult.pattern
      });

    } else if (botResult) {

      setWinner({
        side: 'bot',
        botCardIndex: botResult.cardIndex,
        pattern: botResult.pattern
      });
    }
  };

  const newGame = () => {

    setCalled([]);

    setRemainingNumbers(
      Array.from({ length: 75 }, (_, index) => index + 1)
    );

    setLastNumber(null);

    setWinner(null);

    setPlayerCards(generateThreeCards());
    setBotCards(generateThreeCards());
  };

  const renderCard = (card, cardIndex, side) => {

    const winningCard =
      winner &&
      (
        (side === 'player' &&
          winner.playerCardIndex === cardIndex) ||
        (side === 'bot' &&
          winner.botCardIndex === cardIndex)
      );

    return (
      <div
        className={`bingo-card ${
          winningCard ? 'winning-card' : ''
        }`}
        key={`${side}-${cardIndex}`}
      >

        <div className="card-heading">
          {side === 'player' ? 'Player' : 'Bot'} Card {cardIndex + 1}

          {winningCard && (
            <span className="winner-tag">WINNER</span>
          )}
        </div>

        <table>
          <thead>
            <tr>
              {['B', 'I', 'N', 'G', 'O'].map(letter => (
                <th key={letter}>{letter}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {card.map((row, rowIndex) => (
              <tr key={rowIndex}>

                {row.map((cell, colIndex) => {

                  const isMarked =
                    cell === 'FREE' || called.includes(cell);

                  return (
                    <td
                      key={colIndex}
                      className={isMarked ? 'marked' : ''}
                    >
                      {cell}
                    </td>
                  );
                })}

              </tr>
            ))}
          </tbody>
        </table>

      </div>
    );
  };

  return (
    <div className="App">

      <main className="App-header bingo-page">

        <div className="bingo-container">

          
          <header className="page-header">
            <h1>BINGO</h1>
            <p>Player vs. Bot</p>
          </header>

         
          {winner && (
            <div className="winner-message">

              {winner.side === 'player' && (
                <>
                  <h2>Congratulations! You Win!</h2>
                  <p>You completed a {winner.pattern}.</p>
                </>
              )}

              {winner.side === 'bot' && (
                <>
                  <h2>The Bot Wins!</h2>
                  <p>The bot completed a {winner.pattern}.</p>
                </>
              )}

              {winner.side === 'tie' && (
                <>
                  <h2>It's a Tie!</h2>
                  <p>Both completed a Bingo pattern!</p>
                </>
              )}

            </div>
          )}

         
          <section className="game-main">

          
            <div className="game-panel randomizer">

              <h2>Number Randomizer</h2>

              <div className="last-number">
                {lastNumber !== null
                ? `${getBingoLetter(lastNumber)}-${lastNumber}`
                : '--'}
              </div>

              <p>
                Numbers Called: {called.length}/75
              </p>

              <div className="game-buttons">

                <button
                  className="primary-button"
                  onClick={drawNumber}
                  disabled={
                    remainingNumbers.length === 0 ||
                    winner !== null
                  }
                >
                  Draw Bingo Number
                </button>

                <button
                  className="secondary-button"
                  onClick={newGame}
                >
                  New Game
                </button>

              </div>

              {winner && (
                <p className="game-over">
                  Game Over! Start a new game to play again.
                </p>
              )}

              {remainingNumbers.length === 0 && !winner && (
                <p className="game-over">
                  All numbers have been called.
                </p>
              )}

            </div>

          
            <section className="cards-section">

              <h2>Your Cards</h2>

              <div className="cards-container">
                {playerCards.map((card, index) =>
                  renderCard(card, index, 'player')
                )}
              </div>

            </section>

      
            <section className="cards-section">

              <h2>Bot Cards</h2>

              <div className="cards-container">
                {botCards.map((card, index) =>
                  renderCard(card, index, 'bot')
                )}
              </div>

            </section>

          </section>

          <footer className="bingo-footer">
            Bingo Game | EDP Project Group 6
          </footer>

        </div>

      </main>

    </div>
  );
}

export default Bingo;