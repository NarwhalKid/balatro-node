const suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
const ranks = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];

function newGame(deck = "Red Deck", stake = "White Stake") {
    let game = {
        "endless": false,
        stake,
        "defaultDiscards": 3,
        "defaultHands": 4,
        "money": 4,
        "ante": 1,
        "round": 0,
        "jokerSlots": 5,
        "jokers": [],
        "consumableSlots": 2,
        "consumables": [],
        "handSize": 8,
        "deckSize": 52,
        "tags": [],
        deck,
        "vouchers": [],
        "anteBlinds": [],
        "bossBlinds": [
            {
                "name": "The Hook",
                "debuff": "Discards 2 random\ncards per hand played",
                "minimumAnte": 1,
                "scoreMult": 2,
                "primaryColor": "#9f2909",
                "primaryShadow": "#651200",
                "secondaryColor": "#522a1e",
                "tertiaryColor": "#372a25",
                "alreadySeen": false
            },
            {
                "name": "The Ox",
                "debuff": "Playing a (most played hand)\nsets money to $0",
                "minimumAnte": 6,
                "scoreMult": 2,
                "primaryColor": "#b24700",
                "primaryShadow": "#732700",
                "secondaryColor": "#3c301f",
                "tertiaryColor": "#5a3612",
                "alreadySeen": false
            },
            {
                "name": "The House",
                "debuff": "First hand is\ndrawn face down",
                "minimumAnte": 2,
                "scoreMult": 2,
                "primaryColor": "#3c789f",
                "primaryShadow": "#1f4a65",
                "secondaryColor": "#243a44",
                "tertiaryColor": "#2a4a5b",
                "alreadySeen": false
            },
            {
                "name": "The Wall",
                "debuff": "Extra large blind",
                "minimumAnte": 2,
                "scoreMult": 4,
                "primaryColor": "#7d459c",
                "primaryShadow": "#4d2663",
                "secondaryColor": "#302f43",
                "tertiaryColor": "#443558",
                "alreadySeen": false
            },
            {
                "name": "The Wheel",
                "debuff": "1 in 7 cards get\ndrawn face down",
                "minimumAnte": 2,
                "scoreMult": 2,
                "primaryColor": "#3bb96d",
                "primaryShadow": "#1f7742",
                "secondaryColor": "#24473a",
                "tertiaryColor": "#2a6446",
                "alreadySeen": false
            },
            {
                "name": "The Arm",
                "debuff": "Decrease level of\nplayed poker hand",
                "minimumAnte": 2,
                "scoreMult": 2,
                "primaryColor": "#5653f5",
                "primaryShadow": "#322fa1",
                "secondaryColor": "#293355",
                "tertiaryColor": "#343b7d",
                "alreadySeen": false
            },
            {
                "name": "The Club",
                "debuff": "All Club cards\nare debuffed",
                "minimumAnte": 1,
                "scoreMult": 2,
                "primaryColor": "#b2c786",
                "primaryShadow": "#738154",
                "secondaryColor": "#3c4a3e",
                "tertiaryColor": "#5a6850",
                "alreadySeen": false
            },
            {
                "name": "The Fish",
                "debuff": "Cards drawn face down\nafter each hand played",
                "minimumAnte": 2,
                "scoreMult": 2,
                "primaryColor": "#2677b7",
                "primaryShadow": "#114a76",
                "secondaryColor": "#1f3a48",
                "tertiaryColor": "#214864",
                "alreadySeen": false
            },
            {
                "name": "The Psychic",
                "debuff": "Must play 5 cards",
                "minimumAnte": 1,
                "scoreMult": 2,
                "primaryColor": "#f0ba24",
                "primaryShadow": "#9e780f",
                "secondaryColor": "#47472b",
                "tertiaryColor": "#716429",
                "alreadySeen": false
            },
            {
                "name": "The Goad",
                "debuff": "All Spade cards\nare debuffed",
                "minimumAnte": 1,
                "scoreMult": 2,
                "primaryColor": "#b2488b",
                "primaryShadow": "#732957",
                "secondaryColor": "#3c303f",
                "tertiaryColor": "#5a3652",
                "alreadySeen": false
            },
            {
                "name": "The Water",
                "debuff": "Start with\n0 discards",
                "minimumAnte": 2,
                "scoreMult": 2,
                "primaryColor": "#c1dfec",
                "primaryShadow": "#7d919b",
                "secondaryColor": "#3e4e53",
                "tertiaryColor": "#5f7378",
                "alreadySeen": false
            },
            {
                "name": "The Window",
                "debuff": "All Diamond cards\nare debuffed",
                "minimumAnte": 1,
                "scoreMult": 2,
                "primaryColor": "#a09889",
                "primaryShadow": "#666056",
                "secondaryColor": "#37403f",
                "tertiaryColor": "#525652",
                "alreadySeen": false
            },
            {
                "name": "The Manacle",
                "debuff": "-1 Hand Size",
                "minimumAnte": 1,
                "scoreMult": 2,
                "primaryColor": "#434343",
                "primaryShadow": "#242424",
                "secondaryColor": "#252f30",
                "tertiaryColor": "#2c3435",
                "alreadySeen": false
            },
            {
                "name": "The Eye",
                "debuff": "No repeat hand\ntypes this round",
                "minimumAnte": 3,
                "scoreMult": 2,
                "primaryColor": "#3560e3",
                "primaryShadow": "#1b3a95",
                "secondaryColor": "#233552",
                "tertiaryColor": "#273f76",
                "alreadySeen": false
            },
            {
                "name": "The Mouth",
                "debuff": "Play only 1 hand\ntype this round",
                "minimumAnte": 2,
                "scoreMult": 2,
                "primaryColor": "#a66081",
                "primaryShadow": "#6a3a50",
                "secondaryColor": "#39353d",
                "tertiaryColor": "#543f4e",
                "alreadySeen": false
            },
            {
                "name": "The Plant",
                "debuff": "All face cards\nare debuffed",
                "minimumAnte": 4,
                "scoreMult": 2,
                "primaryColor": "#5f8676",
                "primaryShadow": "#395448",
                "secondaryColor": "#2b3d3b",
                "tertiaryColor": "#374f4a",
                "alreadySeen": false
            },
            {
                "name": "The Serpent",
                "debuff": "After Play or Discard,\nalways draw 3 cards",
                "minimumAnte": 5,
                "scoreMult": 2,
                "primaryColor": "#2c8f3a",
                "primaryShadow": "#145a1e",
                "secondaryColor": "#213e2f",
                "tertiaryColor": "#235332",
                "alreadySeen": false
            },
            {
                "name": "The Pillar",
                "debuff": "Cards played previously\nthis Ante are debuffed",
                "minimumAnte": 1,
                "scoreMult": 2,
                "primaryColor": "#6f553d",
                "primaryShadow": "#443221",
                "secondaryColor": "#2e332f",
                "tertiaryColor": "#3e3b33",
                "alreadySeen": false
            },
            {
                "name": "The Needle",
                "debuff": "Play only 1 hand",
                "minimumAnte": 2,
                "scoreMult": 1,
                "primaryColor": "#485d17",
                "primaryShadow": "#293706",
                "secondaryColor": "#263429",
                "tertiaryColor": "#2e3e24",
                "alreadySeen": false
            },
            {
                "name": "The Head",
                "debuff": "All Heart cards\nare debuffed",
                "minimumAnte": 1,
                "scoreMult": 2,
                "primaryColor": "#a493ad",
                "primaryShadow": "#685c6f",
                "secondaryColor": "#393f46",
                "tertiaryColor": "#53545f",
                "alreadySeen": false
            },
            {
                "name": "The Tooth",
                "debuff": "Lose $1 per\ncard played",
                "minimumAnte": 3,
                "scoreMult": 2,
                "primaryColor": "#ae1313",
                "primaryShadow": "#6f0303",
                "secondaryColor": "#3b2527",
                "tertiaryColor": "#572122",
                "alreadySeen": false
            },
            {
                "name": "The Flint",
                "debuff": "Base Chips and\nMult are halved",
                "minimumAnte": 2,
                "scoreMult": 2,
                "primaryColor": "#e55815",
                "primaryShadow": "#963404",
                "secondaryColor": "#453427",
                "tertiaryColor": "#6d3d23",
                "alreadySeen": false
            },
            {
                "name": "The Mark",
                "debuff": "All face cards are\ndrawn face down",
                "minimumAnte": 2,
                "scoreMult": 2,
                "primaryColor": "#581f30",
                "primaryShadow": "#293706",
                "secondaryColor": "#2a292d",
                "tertiaryColor": "#35262e",
                "alreadySeen": false
            }
        ]
    };

    // Fill default deck
    game.deckCards = suits.flatMap(suit =>
        ranks.map(rank => {
            let chips = 0;
            if (rank === 'Ace') chips = 11;
            else if (['Jack', 'Queen', 'King'].includes(rank)) chips = 10;
            else chips = parseInt(rank);
            return { rank, suit, chips };
        })
    );



    switch (deck.toLowerCase().replace(" ", "")) {
        case "reddeck":
            game.defaultDiscards++;
            break;
        case "bluedeck":
            game.defaultHands++;
            break;
        case "yellowdeck":
            game.money += 10;
            break;
        case "blackdeck":
            game.jokerSlots++;
            game.defaultHands--;
            break;
        case "magicdeck":
            game.vouchers.push("Crystal Ball");
            game.consumableSlots++;
            game.consumables.push({"name": "The Fool"});
            game.consumables.push({"name": "The Fool"});
            break;
        case "nebuladeck":
            game.vouchers.push("Telescope");
            game.consumableSlots--;
            break;
        case "ghostdeck":
            game.consumables.push({"name": "Hex"});
            break;
        case "abandoneddeck":
            game.deckCards = deckCards.filter(card => !['Jack', 'Queen', 'King'].includes(card.rank));
            break;
        case "checkereddeck":
            game.deckCards = deckCards.map(card => {
                let newSuit = card.suit;
                if (card.suit === 'Clubs') newSuit = 'Spades';
                else if (card.suit === 'Diamonds') newSuit = 'Clubs';
                
                return {
                    ...card,
                    suit: newSuit
                };
            });
            break;
        case "zodiacdeck":
            game.vouchers.push("Tarot Merchant");
            game.vouchers.push("Planet Merchant");
            game.vouchers.push("Overstock");
            break;
        case "painteddeck":
            game.jokerSlots--;
            game.handSize++;
            break;
        case "erraticdeck":
            for (let i = 0; i < 52; i++) {
                let card = {};
                card.suit = suits[Math.floor(Math.random() * suits.length)];
                card.rank = ranks[Math.floor(Math.random() * ranks.length)];
                card.chips = card.rank;
                if (["Jack", "Queen", "King"].includes(card.rank)) card.chips = 10;
                if (card.rank == "Ace") card.chips = 11;
                card.chips = parseInt(card.chips);
                return card;
            }
            break;
        default:
            throw new Error("Invalid deck");
    }
    return game;
}

module.export = {
    newGame
}