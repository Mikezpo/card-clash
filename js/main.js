let deckId = ''

fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(res => res.json())
    .then(data => {
        console.log(data)
        deckId = data.deck_id

    })
    .catch(err => {
        console.log(`error ${err}`)
    });