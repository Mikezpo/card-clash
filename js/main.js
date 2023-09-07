let deckId = '';

let player1TotalScore = 0;
let player2TotalScore = 0;
let totalRoundsPlayed = 0;

const player1Card = document.querySelector('#player1');
const player2Card = document.querySelector('#player2');

player1Card.addEventListener('animationend', function() {
    player1Card.classList.remove('card-slide-in');
});

player2Card.addEventListener('animationend', function() {
    player2Card.classList.remove('card-slide-in');
});

// Fetch and shuffle the deck
fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(res => res.json())
    .then(data => {
        deckId = data.deck_id;
    })
    .catch(err => {
        console.log(`Error: ${err}`);
        showError("The card deck is finished. Please refresh the page.");
    });

// Add event listener to the button
document.querySelector('button').addEventListener('click', drawTwo);

function drawTwo() {
    const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            player1Card.classList.remove('card-slide-in');
            player2Card.classList.remove('card-slide-in');

            player1Card.offsetWidth;  // Trigger a reflow
            player2Card.offsetWidth;  // Trigger a reflow

            player1Card.classList.add('card-slide-in');
            player2Card.classList.add('card-slide-in');

            player1Card.src = data.cards[0].image;
            player2Card.src = data.cards[1].image;

            let player1Val = convertToNum(data.cards[0].value);
            let player2Val = convertToNum(data.cards[1].value);

            totalRoundsPlayed++;
            if (player1Val > player2Val) {
                player1TotalScore++;
                document.querySelector('h3').innerText = 'Player 1 Wins this round!';
            } else if (player1Val < player2Val) {
                player2TotalScore++;
                document.querySelector('h3').innerText = 'Player 2 Wins this round!';
            } else {
                document.querySelector('h3').innerText = 'This round is a draw!';
            }

            updateScores();

            // Decide and display the game winner after 10 rounds
            if (totalRoundsPlayed === 26) {
                decideWinner();
            }
        })
        .catch(err => {
            console.log(`Error: ${err}`);
            showError("The card deck is finished. Please refresh the page.");
        });
}

// ... (The rest of your code remains unchanged)


function updateScores() {
    document.querySelector('#player1Score').innerText = player1TotalScore;
    document.querySelector('#player2Score').innerText = player2TotalScore;
    document.querySelector('#totalRounds').innerText = totalRoundsPlayed;
}

function decideWinner() {
    // Calculate the absolute difference
    let pointDifference = Math.abs(player1TotalScore - player2TotalScore); 
    
    if (player1TotalScore > player2TotalScore) {
        showScore(`Game Over! Player 1 wins the game by ${pointDifference} points!`);
    } else if (player1TotalScore < player2TotalScore) {
        showScore(`Game Over! Player 2 wins the game by ${pointDifference} points!`);
    } else {
        showScore('Game Over! It\'s a draw!');
    }

    document.querySelector('button').disabled = true;
}

// Convert card value to number for comparison
function convertToNum(val) {
    const cardValues = {
        'ACE': 14,
        'KING': 13,
        'QUEEN': 12,
        'JACK': 11
    };
    return cardValues[val] || Number(val);
}

// Event listener for the refresh button
document.querySelector('#refreshButton').addEventListener('click', function() {
    location.reload();
});

function showScore(scoreMessage) {
    // Display the error message
    document.querySelector('#scoreMessage').innerText = scoreMessage;

    // Show the error section and hide the game section
    document.querySelector('#scoreSection').style.display = 'block';
    document.querySelector('button').style.display = 'none'; // Hide the deal button
    document.querySelector('h3').style.display = 'none';     // Hide the result text
}
