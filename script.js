const images = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'
];

let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameStartTime;
let timerInterval;

const menuElement = document.getElementById('menu');
const gameBoardElement = document.getElementById('game-board');
const gameStatsElement = document.getElementById('game-stats');
const timeElement = document.getElementById('time');
const movesElement = document.getElementById('moves');
const playButton = document.getElementById('play-btn');
const howToPlayButton = document.getElementById('how-to-play-btn');
const leaderboardButton = document.getElementById('leaderboard-btn');

playButton.addEventListener('click', startGame);
howToPlayButton.addEventListener('click', showHowToPlay);
leaderboardButton.addEventListener('click', showLeaderboard);

function startGame() {
    menuElement.style.display = 'none';
    gameBoardElement.style.display = 'grid';
    gameStatsElement.style.display = 'block';
    
    resetGame();
    createGameBoard();
    startTimer();
}

function resetGame() {
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    updateMoves();
    gameBoardElement.innerHTML = '';
    clearInterval(timerInterval);
}

function startTimer() {
    gameStartTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - gameStartTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');
    timeElement.textContent = `${minutes}:${seconds}`;
}

function updateMoves() {
    movesElement.textContent = moves;
}

function showHowToPlay() {
    alert("How to play:\n\n1. Click on a card to flip it.\n2. Try to find matching pairs of cards.\n3. The game ends when all pairs are found.\n4. Try to complete the game in the least time and moves possible!");
}

function showLeaderboard() {
    alert("Leaderboard functionality coming soon!");
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createGameBoard() {
    const shuffledImages = shuffleArray(images);

    shuffledImages.forEach((image, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.addEventListener('click', flipCard);
        gameBoardElement.appendChild(card);
    });
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        this.textContent = images[this.dataset.index];
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            updateMoves();
            setTimeout(checkMatch, 1000);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.textContent === card2.textContent) {
        matchedPairs++;
        if (matchedPairs === images.length / 2) {
            endGame();
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '';
        card2.textContent = '';
    }

    flippedCards = [];
}

function endGame() {
    clearInterval(timerInterval);
    const finalTime = timeElement.textContent;
    alert(`Congratulations! You won!\nTime: ${finalTime}\nMoves: ${moves}`);
    menuElement.style.display = 'flex';
    gameBoardElement.style.display = 'none';
    gameStatsElement.style.display = 'none';
}

const nicknameInput = document.getElementById('nickname');
const leaderboardElement = document.getElementById('leaderboard');
const timeLeaderboardElement = document.getElementById('time-leaderboard');
const movesLeaderboardElement = document.getElementById('moves-leaderboard');
const backToMenuButton = document.getElementById('back-to-menu');

playButton.addEventListener('click', startGame);
howToPlayButton.addEventListener('click', showHowToPlay);
leaderboardButton.addEventListener('click', showLeaderboard);
backToMenuButton.addEventListener('click', backToMenu);

function startGame() {
    const nickname = nicknameInput.value.trim();
    if (nickname === '') {
        alert('Please enter a nickname before playing.');
        return;
    }

    menuElement.style.display = 'none';
    gameBoardElement.style.display = 'grid';
    gameStatsElement.style.display = 'block';
    
    resetGame();
    createGameBoard();
    startTimer();
}

// ... (other functions remain the same) ...

function endGame() {
    clearInterval(timerInterval);
    const finalTime = timeElement.textContent;
    const nickname = nicknameInput.value.trim();
    
    alert(`Congratulations, ${nickname}! You won!\nTime: ${finalTime}\nMoves: ${moves}`);
    
    updateLeaderboard(nickname, finalTime, moves);
    
    menuElement.style.display = 'flex';
    gameBoardElement.style.display = 'none';
    gameStatsElement.style.display = 'none';
}

function updateLeaderboard(nickname, time, moves) {
    const timeLeaderboard = JSON.parse(localStorage.getItem('timeLeaderboard')) || [];
    const movesLeaderboard = JSON.parse(localStorage.getItem('movesLeaderboard')) || [];

    timeLeaderboard.push({ nickname, time });
    movesLeaderboard.push({ nickname, moves });

    timeLeaderboard.sort((a, b) => {
        const timeA = a.time.split(':').reduce((acc, time) => (60 * acc) + +time);
        const timeB = b.time.split(':').reduce((acc, time) => (60 * acc) + +time);
        return timeA - timeB;
    });

    movesLeaderboard.sort((a, b) => a.moves - b.moves);

    timeLeaderboard.splice(10); // Keep only top 10
    movesLeaderboard.splice(10); // Keep only top 10

    localStorage.setItem('timeLeaderboard', JSON.stringify(timeLeaderboard));
    localStorage.setItem('movesLeaderboard', JSON.stringify(movesLeaderboard));
}

function showLeaderboard() {
    menuElement.style.display = 'none';
    leaderboardElement.style.display = 'block';

    const timeLeaderboard = JSON.parse(localStorage.getItem('timeLeaderboard')) || [];
    const movesLeaderboard = JSON.parse(localStorage.getItem('movesLeaderboard')) || [];

    timeLeaderboardElement.innerHTML = timeLeaderboard
        .map((entry, index) => `<li>${index + 1}. ${entry.nickname} - ${entry.time}</li>`)
        .join('');

    movesLeaderboardElement.innerHTML = movesLeaderboard
        .map((entry, index) => `<li>${index + 1}. ${entry.nickname} - ${entry.moves} moves</li>`)
        .join('');
}

function backToMenu() {
    leaderboardElement.style.display = 'none';
    menuElement.style.display = 'flex';
}
