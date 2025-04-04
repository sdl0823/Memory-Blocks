// 遊戲變數
let sequence = [];
let playerSequence = [];
let level = 1;
let score = 0;
let isPlayerTurn = false;
let gameStarted = false;

// 音效
const sounds = {
    red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
    yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
    purple: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    orange: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    pink: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
    gray: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
    brown: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    correct: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    wrong: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
};

// DOM 元素
const grid = document.getElementById('grid');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const startButton = document.getElementById('start');
const replayButton = document.getElementById('replay');
const gameOverModal = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');

// 顏色陣列
const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'gray', 'brown'];

// 初始化方塊
function initializeBlocks() {
    grid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const block = document.createElement('div');
        block.className = 'block';
        block.id = `block${i}`;
        block.style.backgroundColor = colors[i];
        block.addEventListener('click', () => handlePlayerClick(i));
        grid.appendChild(block);
    }
}

// 開始遊戲
function startGame() {
    gameStarted = true;
    sequence = [];
    playerSequence = [];
    level = 1;
    score = 0;
    isPlayerTurn = false;
    
    // 更新顯示
    levelDisplay.textContent = level;
    scoreDisplay.textContent = score;
    
    // 隱藏遊戲結束模態框
    gameOverModal.style.display = 'none';
    
    // 添加第一個序列項目
    addToSequence();
    
    // 播放序列
    setTimeout(playSequence, 500);
}

// 添加到序列
function addToSequence() {
    const randomIndex = Math.floor(Math.random() * 9);
    sequence.push(randomIndex);
}

// 播放序列
function playSequence() {
    isPlayerTurn = false;
    let i = 0;
    
    // 計算播放速度 (每5關加快0.1秒)
    const playSpeed = Math.max(0.5, 1 - (Math.floor((level - 1) / 5) * 0.1));
    
    const interval = setInterval(() => {
        if (i >= sequence.length) {
            clearInterval(interval);
            isPlayerTurn = true;
            playerSequence = [];
            return;
        }
        
        const blockIndex = sequence[i];
        const block = document.getElementById(`block${blockIndex}`);
        
        // 播放音效
        sounds[colors[blockIndex]].currentTime = 0;
        sounds[colors[blockIndex]].play();
        
        // 視覺效果
        block.classList.add('active');
        
        setTimeout(() => {
            block.classList.remove('active');
        }, playSpeed * 800);
        
        i++;
    }, playSpeed * 1000);
}

// 處理玩家點擊
function handlePlayerClick(index) {
    if (!isPlayerTurn || !gameStarted) return;
    
    const block = document.getElementById(`block${index}`);
    playerSequence.push(index);
    
    // 播放音效
    sounds[colors[index]].currentTime = 0;
    sounds[colors[index]].play();
    
    // 檢查是否正確
    const currentIndex = playerSequence.length - 1;
    
    if (playerSequence[currentIndex] === sequence[currentIndex]) {
        // 正確
        block.classList.add('correct');
        setTimeout(() => block.classList.remove('correct'), 200);
        
        // 檢查是否完成當前序列
        if (playerSequence.length === sequence.length) {
            // 增加分數和關卡
            score += 10;
            level += 1;
            
            // 更新顯示
            scoreDisplay.textContent = score;
            levelDisplay.textContent = level;
            
            // 添加新的序列項目
            addToSequence();
            
            // 延遲後播放新序列
            isPlayerTurn = false;
            setTimeout(playSequence, 1000);
        }
    } else {
        // 錯誤
        block.classList.add('wrong');
        sounds.wrong.play();
        setTimeout(() => {
            block.classList.remove('wrong');
            endGame();
        }, 500);
    }
}

// 遊戲結束
function endGame() {
    gameStarted = false;
    isPlayerTurn = false;
    
    // 顯示最終分數
    finalScoreDisplay.textContent = score;
    
    // 顯示遊戲結束模態框
    gameOverModal.style.display = 'flex';
}

// 事件監聽器
startButton.addEventListener('click', startGame);
replayButton.addEventListener('click', startGame);

// 初始化遊戲
initializeBlocks();