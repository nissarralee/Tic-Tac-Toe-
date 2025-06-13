 document.addEventListener('DOMContentLoaded', () => {
            // Game elements
            const board = document.getElementById('board');
            const cells = document.querySelectorAll('.cell');
            const status = document.getElementById('status');
            const restartBtn = document.getElementById('restart');
            const xScoreEl = document.getElementById('x-score');
            const oScoreEl = document.getElementById('o-score');
            const tiesEl = document.getElementById('ties');
            const singlePlayerBtn = document.getElementById('singlePlayer');
            const twoPlayerBtn = document.getElementById('twoPlayer');
            
            // Game state
            let boardState = ['', '', '', '', '', '', '', '', ''];
            let currentPlayer = 'X';
            let gameActive = true;
            let isSinglePlayer = true;
            let scores = { X: 0, O: 0, ties: 0 };
            
            // Winning conditions
            const winningConditions = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
                [0, 4, 8], [2, 4, 6] // diagonals
            ];
            
            // Initialize game
            initGame();
            
            // Event listeners
            cells.forEach(cell => cell.addEventListener('click', handleCellClick));
            restartBtn.addEventListener('click', restartGame);
            singlePlayerBtn.addEventListener('click', () => switchMode(true));
            twoPlayerBtn.addEventListener('click', () => switchMode(false));
            
            function initGame() {
                boardState = ['', '', '', '', '', '', '', '', ''];
                currentPlayer = 'X';
                gameActive = true;
                
                // Clear board UI
                cells.forEach(cell => {
                    cell.textContent = '';
                    cell.classList.remove('x', 'o', 'winner', 'disabled');
                });
                
                updateStatus();
            }
            
            function handleCellClick(e) {
                const clickedCell = e.target;
                const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
                
                // If cell already filled or game not active, ignore click
                if (boardState[clickedCellIndex] !== '' || !gameActive) return;
                
                // Process player move
                makeMove(clickedCell, clickedCellIndex, currentPlayer);
                
                // Check for win or draw
                checkGameResult();
                
                // If single player mode and game still active, make computer move
                if (isSinglePlayer && gameActive && currentPlayer === 'O') {
                    setTimeout(makeComputerMove, 500);
                }
            }
            
            function makeMove(cell, index, player) {
                // Update board state and UI
                boardState[index] = player;
                cell.textContent = player;
                cell.classList.add(player.toLowerCase());
                cell.classList.add('disabled');
                
                // Switch player
                currentPlayer = player === 'X' ? 'O' : 'X';
                updateStatus();
            }
            
            function makeComputerMove() {
                if (!gameActive) return;
                
                // Simple AI - first try to win, then block, then random
                let move = findWinningMove('O') || 
                           findWinningMove('X') || 
                           findBestMove();
                
                const cell = document.querySelector(`.cell[data-index="${move}"]`);
                makeMove(cell, move, 'O');
                checkGameResult();
            }
            
            function findWinningMove(player) {
                for (let condition of winningConditions) {
                    const [a, b, c] = condition;
                    // Check if two in a row with one empty
                    if (boardState[a] === player && boardState[b] === player && boardState[c] === '') return c;
                    if (boardState[a] === player && boardState[c] === player && boardState[b] === '') return b;
                    if (boardState[b] === player && boardState[c] === player && boardState[a] === '') return a;
                }
                return null;
            }
            
            function findBestMove() {
                // Try center first
                if (boardState[4] === '') return 4;
                
                // Then try corners
                const corners = [0, 2, 6, 8];
                const emptyCorners = corners.filter(index => boardState[index] === '');
                if (emptyCorners.length > 0) {
                    return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
                }
                
                // Then any empty cell
                const emptyCells = boardState.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
                return emptyCells[Math.floor(Math.random() * emptyCells.length)];
            }
            
            function checkGameResult() {
                let roundWon = false;
                
                // Check all winning conditions
                for (let condition of winningConditions) {
                    const [a, b, c] = condition;
                    
                    if (boardState[a] === '' || boardState[b] === '' || boardState[c] === '') {
                        continue;
                    }
                    
                    if (boardState[a] === boardState[b] && boardState[b] === boardState[c]) {
                        roundWon = true;
                        
                        // Highlight winning cells
                        document.querySelector(`.cell[data-index="${a}"]`).classList.add('winner');
                        document.querySelector(`.cell[data-index="${b}"]`).classList.add('winner');
                        document.querySelector(`.cell[data-index="${c}"]`).classList.add('winner');
                        break;
                    }
                }
                
                // If won, update scores and end game
                if (roundWon) {
                    const winner = currentPlayer === 'X' ? 'O' : 'X';
                    status.textContent = `Player ${winner} wins!`;
                    scores[winner]++;
                    updateScores();
                    gameActive = false;
                    return;
                }
                
                // Check for draw
                if (!boardState.includes('')) {
                    status.textContent = "Game ended in a draw!";
                    scores.ties++;
                    updateScores();
                    gameActive = false;
                    return;
                }
            }
            
            function updateStatus() {
                status.textContent = `Player ${currentPlayer}'s turn`;
            }
            
            function updateScores() {
                xScoreEl.textContent = scores.X;
                oScoreEl.textContent = scores.O;
                tiesEl.textContent = scores.ties;
            }
            
            function restartGame() {
                initGame();
            }
            
            function switchMode(singlePlayer) {
                isSinglePlayer = singlePlayer;
                
                if (singlePlayer) {
                    singlePlayerBtn.classList.add('active');
                    twoPlayerBtn.classList.remove('active');
                } else {
                    singlePlayerBtn.classList.remove('active');
                    twoPlayerBtn.classList.add('active');
                }
                
                restartGame();
            }
        });
