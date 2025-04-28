const suits = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
const ranks = ['Ace', 'King', 'Queen', 'Jack', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

const seals = {
  "Red Seal": {},
  "Gold Seal": {},
  "Blue Seal": {},
  "Purple Seal": {}
}

const enhancements = {
  "Bonus Card": {onCardScored(gameState, card) {return {"plusChips": 30};}},
  "Mult Card": {onCardScored(gameState, card) {return {"plusMult": 4};}},
  "Wild Card": {},
  "Glass Card": {onCardScored(gameState, card) {return {"plusChips": 2, "destroy": random(gameState, 1, 4)};}},
  "Steel Card": {onCardHeld(gameState, card) {return {"timesMult": 1.5};}},
  "Stone Card": {onCardScored(gameState, card) {return {"plusChips": 50};}},
  "Gold Card": {onGoldCard(gameState, card) {return {"plusChips": 30};}}, // TODO
  "Lucky Card": {onCardScored(gameState, card) {
    const money = random(gameState, 1, 15);
    const mult = random(gameState, 1, 5);
    if (money) gameState.money += 20;
    if (money || mult) handleJokers(gameState, onLuckyTrigger);
    return {"plusMult": mult ? 20 : 0};
  }}
}

const cards = {
  "Tarot Card": [
    {
      name: "The Fool",
      text: "Creates the last Tarot or Planet card used during this run (The Fool excluded)"
    },
    {
      name: "The Magician",
      text: "Enhances 2 selected cards to Lucky Cards"
    },
    {
      name: "The High Priestess",
      text: "Creates up to 2 random Planet cards (Must have room)"
    },
    {
      name: "The Empress",
      text: "Enhances 2 selected cards to Mult Cards"
    },
    {
      name: "The Emperor",
      text: "Creates up to 2 random Tarot cards (Must have room)"
    },
    {
      name: "The Hierophant",
      text: "Enhances 2 selected cards to Bonus Cards"
    },
    {
      name: "The Lovers",
      text: "Enhances 1 selected card into a Wild Card"
    },
    {
      name: "The Chariot",
      text: "Enhances 1 selected card into a Steel Card"
    },
    {
      name: "Justice",
      text: "Enhances 1 selected card into a Glass Card"
    },
    {
      name: "The Hermit",
      text: "Doubles money (Max of $20)"
    },
    {
      name: "The Wheel of Fortune",
      text: "1 in 4 chance to add Foil, Holographic, or Polychrome edition to a random Joker"
    },
    {
      name: "Strength",
      text: "Increases rank of up to 2 selected cards by 1"
    },
    {
      name: "The Hanged Man",
      text: "Destroys up to 2 selected cards"
    },
    {
      name: "Death",
      text: "Select 2 cards, convert the left card into the right card (Drag to rearrange)" // TODO: decide if i wanna change this
    },
    {
      name: "Temperance",
      text: "Gives the total sell value of all current Jokers (Max of $50)"
    },
    {
      name: "The Devil",
      text: "Enhances 1 selected card into a Gold Card"
    },
    {
      name: "The Tower",
      text: "Enhances 1 selected card into a Stone Card"
    },
    {
      name: "The Star",
      text: "Converts up to 3 selected cards to Diamonds"
    },
    {
      name: "The Moon",
      text: "Converts up to 3 selected cards to Clubs"
    },
    {
      name: "The Sun",
      text: "Converts up to 3 selected cards to Hearts"
    },
    {
      name: "Judgement",
      text: "Creates a random Joker card (Must have room)"
    },
    {
      name: "The World",
      text: "Converts up to 3 selected cards to Spades"
    }
  ],
  "Spectral Card": [
    {
      name: "Familiar",
      text: "Destroy 1 random card in your hand, but add 3 random Enhanced face cards to your hand"
    },
    {
      name: "Grim",
      text: "Destroy 1 random card in your hand, but add 2 random Enhanced Aces to your hand"
    },
    {
      name: "Incantation",
      text: "Destroy 1 random card in your hand, but add 4 random Enhanced numbered cards to your hand"
    },
    {
      name: "Talisman",
      text: "Add a Gold Seal to 1 selected card in your hand"
    },
    {
      name: "Aura",
      text: "Add Foil, Holographic, or Polychrome effect to 1 selected card in hand"
    },
    {
      name: "Wraith",
      text: "Creates a random Rare Joker, sets money to $0"
    },
    {
      name: "Sigil",
      text: "Converts all cards in hand to a single random suit"
    },
    {
      name: "Ouija",
      text: "Converts all cards in hand to a single random rank\n-1 hand size"
    },
    {
      name: "Ectoplasm",
      text: "Add Negative to a random Joker.\n-X hand size" // TODO: make hand size update
    },
    {
      name: "Immolate",
      text: "Destroys 5 random cards in hand, gain $20"
    },
    {
      name: "Ankh",
      text: "Create a copy of a random Joker, destroy all other Jokers"
    },
    {
      name: "Deja Vu",
      text: "Add a Red Seal to 1 selected card in your hand"
    },
    {
      name: "Hex",
      text: "Add Polychrome to a random Joker, and destroy all other Jokers"
    },
    {
      name: "Trance",
      text: "Add a Blue Seal to 1 selected card in your hand"
    },
    {
      name: "Medium",
      text: "Add a Purple Seal to 1 selected card card in your hand"
    },
    {
      name: "Cryptid",
      text: "Create 2 copies of 1 selected card in your hand"
    },
    {
      name: "The Soul",
      text: "Creates a Legendary Joker (Must have room)"
    },
    {
      name: "Black Hole",
      text: "Upgrade every poker hand by 1 level"
    }
  ]
}

cards["Playing Card"] = suits.flatMap(suit =>
  ranks.map(rank => {
      let chips = 0;
      if (rank === 'Ace') chips = 11;
      else if (['Jack', 'Queen', 'King'].includes(rank)) chips = 10;
      else chips = BigInt(rank);
      return { rank, suit, chips };
  })
);

const pokerHands = {
  "High Card": {
    base: {
      mult: 1n,
      chips: 5n
    },
    addition: {
      mult: 1n,
      chips: 10n
    },
    planet: "Pluto",
    unlocked: true
  },
  "Pair": {
    base: {
      mult: 2n,
      chips: 10n
    },
    addition: {
      mult: 1n,
      chips: 15n
    },
    planet: "Mercury",
    unlocked: true
  },
  "Two Pair": {
    base: {
      mult: 2n,
      chips: 20n
    },
    addition: {
      mult: 1n,
      chips: 20n
    },
    planet: "Uranus",
    unlocked: true
  },
  "Three of a Kind": {
    base: {
      mult: 3n,
      chips: 30n
    },
    addition: {
      mult: 2n,
      chips: 20n
    },
    planet: "Venus",
    unlocked: true
  },
  "Straight": {
    base: {
      mult: 4n,
      chips: 30n
    },
    addition: {
      mult: 3n,
      chips: 30n
    },
    planet: "Saturn",
    unlocked: true
  },
  "Flush": {
    base: {
      mult: 4n,
      chips: 35n
    },
    addition: {
      mult: 2n,
      chips: 15n
    },
    planet: "Jupiter",
    unlocked: true
  },
  "Full House": {
    base: {
      mult: 4n,
      chips: 40n
    },
    addition: {
      mult: 2n,
      chips: 25n
    },
    planet: "Earth",
    unlocked: true
  },
  "Four of a Kind": {
    base: {
      mult: 7n,
      chips: 60n
    },
    addition: {
      mult: 3n,
      chips: 30n
    },
    planet: "Mars",
    unlocked: true
  },
  "Straight Flush": {
    base: {
      mult: 8n,
      chips: 100n
    },
    addition: {
      mult: 4n,
      chips: 40n
    },
    planet: "Neptune",
    unlocked: true
  },
  "Five of a Kind": {
    base: {
      mult: 12,
      chips: 120
    },
    addition: {
      mult: 3,
      chips: 35
    },
    planet: "Planet X",
    unlocked: false
  },
  "Flush House": {
    base: {
      mult: 14,
      chips: 140
    },
    addition: {
      mult: 4,
      chips: 40
    },
    planet: "Ceres",
    unlocked: false
  },
  "Flush Five": {
    base: {
      mult: 16,
      chips: 160
    },
    addition: {
      mult: 3,
      chips: 50
    },
    planet: "Eris",
    unlocked: false
  }
};



const boosterPacks = [
  {"name": "Arcana Pack", "amount": 3, "choices": 1, "odds": 4},
  {"name": "Jumbo Arcana Pack", "amount": 5, "choices": 1, "odds": 2},
  {"name": "Mega Arcana Pack", "amount": 5, "choices": 2, "odds": 0.5},
  
  {"name": "Celestial Pack", "amount": 3, "choices": 1, "odds": 4},
  {"name": "Jumbo Celestial Pack", "amount": 5, "choices": 1, "odds": 2},
  {"name": "Mega Celestial Pack", "amount": 5, "choices": 2, "odds": 0.5},
  
  {"name": "Standard Pack", "amount": 3, "choices": 1, "odds": 4},
  {"name": "Jumbo Standard Pack", "amount": 5, "choices": 1, "odds": 2},
  {"name": "Mega Standard Pack", "amount": 5, "choices": 2, "odds": 0.5},

  {"name": "Buffoon Pack", "amount": 2, "choices": 1, "odds": 1.2},
  {"name": "Jumbo Buffoon Pack", "amount": 4, "choices": 1, "odds": 0.6},
  {"name": "Mega Buffoon Pack", "amount": 4, "choices": 2, "odds": 0.15},

  {"name": "Spectral Pack", "amount": 2, "choices": 1, "odds": 0.6},
  {"name": "Jumbo Spectral Pack", "amount": 4, "choices": 1, "odds": 0.3},
  {"name": "Mega Spectral Pack", "amount": 4, "choices": 2, "odds": 0.07}
];

function jokerCount(gameState, jokerName) {
  return gameState.jokers.filter(joker => !joker.debuffed && joker.name.toLowerCase().replaceAll(" ", "") == jokerName).length;
}

function random(gameState, odds, outOf) {
  return Math.floor(Math.random() * odds) + 1 <= outOf * Math.pow(2, jokerCount(gameState, "Oops! All 6s"));
}

function isSuit(gameState, card, suit) {
  if (card.edition.toLowerCase().replaceAll(" ", "") == "stonecard") return false;
  if (card.edition.toLowerCase().replaceAll(" ", "") == "wildcard" && !card.debuffed) return true;
  const redHands = ["hearts", "diamonds"];
  const blackHands = ["spades", "clubs"];
  if (jokerCount(gameState, "smearedjoker") && ((redHands.contains(card.suit.toLowerCase()) && redHands.contains(suit.toLowerCase())) || (blackHands.contains(card.suit.toLowerCase()) && blackHands.contains(suit.toLowerCase())))) return true;
  return card.suit.toLowerCase() == suit.toLowerCase();
}

function isFaceCard(gameState, card) {
  if (card.edition.toLowerCase().replaceAll(" ", "") == "stonecard") return false;
  if (jokerCount(gameState, "pareidolia") > 0) {
    return true;
  }
  return isRank(gameState, card, "King") || isRank(gameState, card, "Queen") || isRank(gameState, card, "Jack"); 
}

function isRank(gameState, card, rank) {
  if (card.edition.toLowerCase().replaceAll(" ", "") == "stonecard") return false;
  return card.rank == rank;
}

function cardsContain(gameState, cards, handType) {
  handType = handType.toLowerCase().replaceAll(" ", "");
  const hasFourFingers = jokerCount(gameState, "fourfingers") > 0;
  const hasShortcut = jokerCount(gameState, "shortcut") > 0;
  if (handType == "fiveofakind") {
    for (const rank of ranks) {
      const returnCards = cards.filter(card => isRank(gameState, card, rank));
      if (returnCards.length >= 5) return returnCards;
    } 
  }
  if (handType == "fourofakind") {
    for (const rank of ranks) {
      const returnCards = cards.filter(card => isRank(gameState, card, rank));
      if (returnCards.length >= 4) return returnCards;
    } 
  }
  if (handType == "threeofakind") {
    for (const rank of ranks) {
      const returnCards = cards.filter(card => isRank(gameState, card, rank));
      if (returnCards.length >= 3) return returnCards;
    }    
  }
  if (handType == "pair") {
    for (const rank of ranks) {
      const returnCards = cards.filter(card => isRank(gameState, card, rank));
      if (returnCards.length >= 2) return returnCards;
    }
  }
  if (handType == "flush") {
    let returnCards = [];
    suits.forEach(suit => {
      const tempReturnCards = cards.filter(card => isSuit(gameState, card, suit));
      if (tempReturnCards.length >= hasFourFingers ? 4 : 5) {
        if (returnCards.length <= tempReturnCards.length) {
          returnCards = tempReturnCards;
        }
      }
    });
    return returnCards;
  }
  if (handType == "twopair") {
    let pairs = 0;
    ranks.forEach(rank => {if (cards.filter(card => isRank(gameState, card, rank)).length >= 2) pairs++});
    return pairs >= 2
  }
  if (handType == "fullhouse") {
    if (cardsContain(gameState, cards, "Two Pair") && cardsContain(gameState, cards, "Three of a Kind"))
    return cards;
  }
  if (handType == "straight") {
    if (cards.length < (hasFourFingers ? 4 : 5)) return false;

    const rankToValue = {
      '2': 2, '3': 3, '4': 4, '5': 5,
      '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
      'Jack': 11, 'Queen': 12, 'King': 13, 'Ace': 14
    };
  
    const valueToCards = {};
    for (const card of cards) {
      const val = rankToValue[card.rank];
      if (!valueToCards[val]) valueToCards[val] = [];
      valueToCards[val].push(card);
    }
  
    let uniqueValues = Object.keys(valueToCards).map(Number);
  
    const hasAce = uniqueValues.includes(14);
    if (hasAce && uniqueValues.includes(2)) {
      if (!valueToCards[1]) valueToCards[1] = [...valueToCards[14]];
      uniqueValues.push(1);
    }
  
    uniqueValues = [...new Set(uniqueValues)].sort((a, b) => a - b);
    const neededLength = hasFourFingers ? 4 : 5;
  
    for (let i = 0; i <= uniqueValues.length - neededLength; i++) {
      const slice = uniqueValues.slice(i, i + neededLength + (hasShortcut ? 1 : 0));
  
      if (slice.includes(1) && slice.includes(14)) continue;
  
      let sequence = [slice[0]];
      for (let j = 1; j < slice.length; j++) {
        const diff = slice[j] - slice[j - 1];
        if (diff === 1 || (hasShortcut && diff === 2)) {
          sequence.push(slice[j]);
        } else {
          sequence = [slice[j]];
        }
  
        if (sequence.length >= neededLength) {
          if (uniqueValues.length < cards.length) return cards;
          return sequence.map(val => valueToCards[val][0]);
        }
      }
    }
  }
  if (handType == "highcard") return true;
  if (handType == "straightflush") {
    if (cardsContain(gameState, cards, "Straight") && cardsContain(gameState, cards, "Flush"))
    return cards;
  }
  if (handType == "flushhouse") {
    if (cardsContain(gameState, cards, "Full House") && cardsContain(gameState, cards, "Flush"))
    return cards;
  }
  if (handType == "flushfive") {
    if (cardsContain(gameState, cards, "Flush Five") && cardsContain(gameState, cards, "Flush"))
    return cards;
  }
  return false;
}

function getHandType(gameState, cards) { // TODO: go through all uses and check if should include debuffed cards
  const sort = pokerHands.toSorted((a, b) => (a.base.mult + a.base.chips) - (b.base.mult + b.base.chips));
  for (const hand of sort) {
    const contains = cardsContain(gameState, cards, hand);
    if (contains) return {
      "handType": hand,
      "cards": jokerCount(gameState, "splash") ? cards : contains
    };
  }
}

function drawCard(gameState, card = undefined, toHand = true) {
  if (card) {
    if (toHand) {
      gameState.fullDeck.push(card);
      if (gameState.state == "blind")
        gameState.blind.hand.push(card);
    } else {
      gameState.fullDeck.push(card);
      if (gameState.state == "blind")
        gameState.blind.remainingCards.push(card);
    }
  } else {
    if (gameState.blind.remainingCards.length < 1) return;
    const cardIdx = Math.floor(Math.random() * gameState.blind.remainingCards.length);
    gameState.blind.hand.push(gameState.blind.remainingCards[cardIdx]);
    gameState.blind.remainingCards.splice(cardIdx, 1);
  }
}

function addConsumable(gameState, card) {
  if (gameState.consumableSlots > gameState.consumables.length) {
    gameState.consumables.push(gameState, card);
  }
}

const jokers = {
    "8 Ball": {
      getDesc(gameState) { return "1 in 4 chance for each played 8 to create a Tarot card when scored\n(Must have room)" },
      "rarity": "Common",
      onCardScored(gameState, card) {
        if (isRank(gameState, card, "8")) {
          if (random(gameState, 1, 4)) {
            addConsumable(gameState, newCard(gameState, "Tarot Card"));
          }
        }
      },
      "cost": 5
    },

    "Abstract Joker": {
      getDesc(gameState) { return "+3 Mult for each Joker card" },
      "rarity": "Common",
      onScore(gameState, cards) {
        return {"plusMult": gameState.jokers.length * 3};
      },
      "cost": 4
    },

    "Acrobat": {
      "rarity": "Uncommon",
      getDesc(gameState) {return "X3 Mult on final hand of round"},
      onScore(gameState, cards) {
        if (gameState.blind.hands < 1) {
          return {"timesMult": 3};
        }
      },
      "cost": 6
    },

    "Ancient Joker": {
      "rarity": "Rare",
      getDesc(gameState) {return `Each played card with ${gameState.jokerProperties.ancient.suit} gives X1.5 Mult when scored, suit changes at end of round`},
      onCardScored(gameState, card) {
        if (isSuit(gameState, card, gameState.jokerProperties.ancient.suit)) {
          return {"timesMult": 1.5};
        }
      },
      onRoundEnd(gameState) { // TODO: remove this from ancient joker so it doesnt trigger for each one
        const newSuits = suits.filter(suit => suit != gameState.jokerProperties.ancient.suit);
        gameState.jokerProperties.ancient.suit = newSuits[Math.floor(Math.random() * newSuits.length)]
      },
      "cost": 8
    },

    "Arrowhead": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Played cards with Spade suit give +50 Chips when scored" },
      onCardScored(gameState, card) {
        if (isSuit(gameState, card, "Spades")) {
          return {"plusChips": 50};
        }
      },
      "cost": 7
    },

    "Astronomer": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "All Planet cards and Celestial Packs in the shop are free" },
      "cost": 8
      // TODO
    },

    "Banner": {
      getDesc(gameState) { return "+30 Chips for each remaining discard" },
      "rarity": "Common",
      onScore(gameState, cards) {
        return {"plusChips": 30 * gameState.blind.discards};
      },
      "cost": 5
    },

    "Baron": {
      "rarity": "Rare",
      getDesc(gameState) { return "Each King held in hand gives X1.5 Mult" },
      onHeld(gameState, card) {
        if (isRank(gameState, card, "King")) {
          return {"timesMult": 1.5};
        }
      },
      "cost": 8
    },

    "Baseball Card": {
      "rarity": "Rare",
      getDesc(gameState) { return "Uncommon Jokers each give X1.5 Mult" },
      "cost": 8
    },

    "Blackboard": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "X3 Mult if all cards held in hand are Spades or Clubs" },
      onScore(gameState, cards) {
        for (let [idx, card] of gameState.blind.hand.entries()) {
          if (!isSuit(gameState, card, "Spades") && !isSuit(gameState, card, "Clubs")) {
            return;
          }
        }
        return {"timesMult": 3};
      },
      "cost": 6
    },

    "Bloodstone": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "1 in 2 chance for played cards with the Heart suit to give X1.5 Mult when scored" },
      onCardScored(gameState, card) {
        if (isSuit(gameState, card, "Hearts")) {
          if (random(gameState, 1, 2)) {
            return {"timesMult": 1.5};
          }
        }
      },
      "cost": 7
    },

    "Blue Joker": {
      getDesc(gameState) { return `+2 Chips for each remaining card in deck\n(Currently +${2*gameState.remainingCards.length})` },
      "rarity": "Common",
      onScore(gameState, cards) {return {"plusChips": 2 * gameState.remainingCards.length}},
      "cost": 5
    },

    "Blueprint": {
      "rarity": "Rare",
      getDesc(gameState) { return "Copies ability of Joker to the right" },
      "cost": 10
      // TODO
    },

    "Bootstraps": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "+2 Mult for every $5 you have" },
      onScore(gameState, cards) {return {"plusMult": 2*Math.floor(gameState.money/5)}},
      "cost": 7
    },

    "Brainstorm": {
      "rarity": "Rare",
      getDesc(gameState) { return "Copies the ability of leftmost Joker" },
      "cost": 10
      // TODO
    },

    "Bull": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "+2 Chips for each $1 you have" },
      onScore(gameState, cards) {return {"plusChips": 2*gameState.money}},
      "cost": 6
    },

    "Burglar": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "When Blind is selected, gain +3 Hands and lose all discards" },
      onBlindStart(gameState) {
        gameState.blind.discards = 0;
        gameState.blind.hands += 3;
      },
      "cost": 6
    },

    "Burnt Joker": {
      "rarity": "Rare",
      getDesc(gameState) { return "Upgrade the level of the first discarded poker hand each round" },
      onDiscard(gameState, cards) {
        if (gameState.firstDiscard) {
          gameState.handLevels[getHandType(gameState, cards)]++;
        }
      },
      "cost": 8
    },

    "Business Card": {
      getDesc(gameState) { return "Played face cards have a 1 in 2 chance to give $2 when scored" },
      "rarity": "Common",
      onCardScored(gameState, card) {
        if (isFaceCard(gameState, card)) {
          if (random(gameState, 1, 2)) {
            gameState.money += 2;
          }
        }
      },
      "cost": 4
    },

    "Canio": {
      "rarity": "Legendary",
      getDesc(gameState) { return `This Joker gains X1 Mult when a face card is destroyed\n(Currently X${this.properties.timesMult})` },
      "properties": {"timesMult": 1},
      onScore(gameState, cards) {return {"timesMult": this.properties.timesMult}},
      onCardsDestroyed(gameState, cards) {
        cards.forEach(card => {
          if (isFaceCard(card)) timesMult++;
        })
      },
      "cost": 20
    },

    "Campfire": {
      "rarity": "Rare",
      getDesc(gameState) { return `This Joker gains X0.25 Mult for each card sold, resets when Boss Blind is defeated\n(Currently X${this.properties.timesMult})` },
      "properties": {"timesMult": 1},
      onScore(gameState, cards) {return {"timesMult": this.properties.timesMult}},
      onCardSold(gameState, card) {
        this.properties.timesMult += 0.25;
      },
      onBlindEnd(gameState) {
        const bossName = gameState.blind.name.toLowerCase().replaceAll(" ", "");
        if (bossName != "smallblind" && bossName != "bigblind") {
          this.properties.timesMult = 1;
        }
      },
      "cost": 9
    },

    "Card Sharp": {
      "rarity": "Uncommon",
      getDesc(gameState) { return " X3 Mult if played poker hand has already been played this round" },
      onScore(gameState, cards) {
        if (gameState.blind.handPlays.includes(getHandType(gameState, cards).handType)) {
          return {"timesMult": 3};
        }
      },
      "cost": 6
    },

    "Cartomancer": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Create a Tarot card when Blind is selected (Must have room)" },
      onBlindStart(gameState) {addConsumable(gameState, newCard(gameState, "Tarot"))},
      "cost": 6
    },

    "Castle": {
      getDesc(gameState) { return `This Joker gains +3 Chips per discarded ${gameState.jokerProperties.castle.suit} card, suit changes every round\n(Currently +${this.properties.plusChips})` },
      "rarity": "Common",
      "properties": {
        "plusChips": 0
      },
      onCardScored(gameState, card) {return {"plusChips": plusChips};},
      onDiscard(gameState, cards) {
        cards.forEach(card => {
          if (isSuit(gameState, card, gameState.jokerProperties.castle.suit)) {
            this.properties.plusChips += 3;
          }
        });
      },
      onRoundEnd(gameState) { // TODO: move this out of joker so its the same
        const possibleCards = gameState.fullDeck.filter(card => card.enhancement.toLowerCase().replaceAll(" ", "") != "stonecard");
        if (possibleCards.length < 1) return;
        gameState.jokerProperties.castle.suit = structuredClone(possibleCards[Math.floor(Math.random() * possibleCards.length)]);
      },
      "cost": 6
    },

    "Cavendish": {
      getDesc(gameState) { return "X3 Mult, 1 in 1000 chance this card is destroyed at end of round" },
      "rarity": "Common",
      onScore(gameState, cards) {return {"timesMult": 3}},
      onRoundEnd(gameState) {
        if (random(gameState, 1, 1000)) return {"destroy": true};
      },
      "cost": 4
    },

    "Ceremonial Dagger": {
      "rarity": "Uncommon",
      getDesc(gameState) { return `When Blind is selected, destroy Joker to the right and permanently add double its sell value to this Mult\n(Currently +${this.properties.plusMult})` },
      "properties": {
        "plusMult": 0
      },
      onScore(gameState, cards) {return {"plusMult": this.properties.plusMult}},
      onBlindStart(gameState) {
        // TODO
      },
      "cost": 6
    },

    "Certificate": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "When round begins, add a random playing card with a random seal to your hand" },
      onBlindStart(gameState) {
        drawCard(gameState, newCard(gameState, "Playing Card", true));
      },
      "cost": 6
    },

    "Chaos the Clown": {
      getDesc(gameState) { return "1 free Reroll per shop" },
      "rarity": "Common",
      "cost": 4
      // TODO
    },

    "Chicot": {
      "rarity": "Legendary",
      getDesc(gameState) { return "Disables effect of every Boss Blind" },
      "cost": 20
      // TODO
    },

    "Clever Joker": {
      getDesc(gameState) { return "+80 Chips if played hand contains a Two Pair" },
      "rarity": "Common",
      onScore(gameState, cards) {
        if (cardsContain(gameState, getHandType(gameState, cards).cards, "Two Pair")) return {"plusChips": 80};
      },
      "cost": 4
    },

    "Cloud 9": {
      "rarity": "Uncommon",
      getDesc(gameState) { return `Earn $1 for each 9 in your full deck at end of round\n(Currently $${gameState.fullDeck.filter(card => isRank(gameState, card, 9)).length})` },
      onRoundEnd(gameState) {
        return {"money": 
          gameState.fullDeck.filter(card => isRank(gameState, card, 9)).length
        };
      },
      "cost": 7
    },

    "Constellation": {
      "rarity": "Uncommon",
      getDesc(gameState) { return `This Joker gains X0.1 Mult every time a Planet card is used\n(Currently X${this.properties.timesMult})` },
      "properties": {
        "timesMult": 1
      },
      onPlanetCardUsed(gameState) {this.properties.timesMult += 0.1},
      onScore(gameState, card) {return {"timesMult": this.properties.timesMult};},
      "cost": 6
    },

    "Crafty Joker": {
      getDesc(gameState) { return "+80 Chips if played hand contains a Flush" },
      "rarity": "Common",
      onScore(gameState, cards) {
        if (cardsContain(gameState, getHandType(gameState, cards).cards, "Flush")) return {"plusChips": 80};
      },
      "cost": 4
    },

    "Crazy Joker": {
      getDesc(gameState) { return "+12 Mult if played hand contains a Straight" },
      "rarity": "Common",
      onScore(gameState, cards) {
        if (cardsContain(gameState, getHandType(gameState, cards).cards, "Straight")) return {"plusMult": 12};
      },
      "cost": 4
    },

    "Credit Card": {
      getDesc(gameState) { return "Go up to -$20 in debt" },
      "rarity": "Common",
      "cost": 1
      // TODO
    },

    "Delayed Gratification": {
      getDesc(gameState) { return "Earn $2 per discard if no discards are used by end of the round" },
      "rarity": "Common",
      onRoundEnd(gameState) {
        if (gameState.blind.firstDiscard) return {"money": gameState.blind.discards * 2}; // TODO: blind.firstDiscard
      },
      "cost": 4
    },

    "Devious Joker": {
      getDesc(gameState) { return "+100 Chips if played hand contains a Straight" },
      "rarity": "Common",
      onScore(gameState, cards) {
        if (cardsContain(gameState, getHandType(gameState, cards).cards, "Straight")) return {"plusChips": 100};
      },
      "cost": 4
    },

    "Diet Cola": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Sell this card to create a free Double Tag" },
      onSell(gameState) {
        if (!gameState.bannedTags.includes("Double Tag"))
          gameState.tags.push("Double Tag");
      },
      "cost": 6
    },

    "DNA": {
      "rarity": "Rare",
      getDesc(gameState) { return "If first hand of round has only 1 card, add a permanent copy to deck and draw it to hand" },
      onHandPlayed(gameState, cards) {
        if (cards.length == 1 && gameState.blind.firstHand) {
          drawCard(gameState, structuredClone(cards[0]));
        }
      },
      "cost": 8
    },

    "Driver's License": {
      "rarity": "Rare",
      getDesc(gameState) { return `X3 Mult if you have at least 16 Enhanced cards in your full deck\n(${gameState.fullDeck.filter(card => card.enhancement).length}/16` },
      onScore(gameState, cards) {
        if (gameState.fullDeck.filter(card => card.enhancement).length >= 16) {
          return {"timesMult": 3}
        }
      },
      "cost": 7
    },

    "Droll Joker": {
      getDesc(gameState) { return "+10 Mult if played hand contains a Flush" },
      "rarity": "Common",
      onScore(gameState, cards) {
        if (cardsContain(gameState, getHandType(gameState, cards).cards, "Flush")) return {"plusMult": 10};
      },
      "cost": 4
    },

    "Drunkard": {
      getDesc(gameState) { return "+1 discard each round" },
      "rarity": "Common",
      onBuy(gameState) {gameState.defaultDiscards++;},
      onDestroy(gameState) {gameState.defaultDiscards--;},
      "cost": 4
    },

    "The Duo": {
      "rarity": "Rare",
      getDesc(gameState) { return "X2 Mult if played hand contains a Pair" },
      onScore(gameState, cards) {
        if (cardsContain(gameState, getHandType(gameState, cards).cards, "Pair")) return {"timesMult": 2};
      },
      "cost": 8
    },

    "Dusk": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Retrigger all played cards in final hand of round" },
      onCardScored(gameState, card) {
        if (gameState.blind.hands < 1) {
          return {"retriggers": 1};
        }
      },
      "cost": 5
    },

    "Egg": {
      getDesc(gameState) { return "Gains $3 of sell value at end of round" },
      "rarity": "Common",
      "addedSellValue": 0, // TODO
      onRoundEnd(gameState) {this.addedSellValue += 3;},
      "cost": 4
    },

    "Erosion": {
      "rarity": "Uncommon",
      getDesc(gameState) { return `+4 Mult for each card below ${gameState.deckStartSize} in your full deck` },
      onScore() {
        return {"plusMult": 4*(gameState.deckStartSize - gameState.fullDeck.size)}
      },
      "cost": 6
    },

    "Even Steven": {
      getDesc(gameState) { return "Played cards with even rank give +4 Mult when scored (10, 8, 6, 4, 2)" },
      "rarity": "Common",
      onCardScored(gameState, card) {
        if (isRank(gameState, card, 2) || isRank(gameState, card, 4) || isRank(gameState, card, 6) || isRank(gameState, card, 8) || isRank(gameState, card, 10))
          return {"plusMult": 4};
      },
      "cost": 4
    },

    "Faceless Joker": {
      getDesc(gameState) { return "Earn $5 if 3 or more face cards are discarded at the same time" },
      "rarity": "Common",
      onDiscard(gameState, cards) {
        if (cards.filter(card => isFaceCard(card)).length >= 3) {
          gameState += 5;
        }
      },
      "cost": 4
    },

    "The Family": {
      "rarity": "Rare",
      getDesc(gameState) { return " X4 Mult if played hand contains a Four of a Kind" },
      onScore(gameState, cards) {
        if (cardsContain(gameState, getHandType(gameState, cards).cards, "Four of a Kind")) return {"timesMult": 4};
      },
      "cost": 8
    },

    "Fibonacci": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Each played Ace, 2, 3, 5, or 8 gives +8 Mult when scored" },
      onCardScored(gameState, card) {
        if (isRank(gameState, card, "Ace") || isRank(gameState, card, 2) || isRank(gameState, card, 3) || isRank(gameState, card, 5) || isRank(gameState, card, 8))
          return {"plusMult": 8};
      },
      "cost": 8
    },

    "Flash Card": {
      "rarity": "Uncommon",
      getDesc(gameState) { return `This Joker gains +2 Mult per reroll in the shop\n(Currently +${this.properties.plusMult})` },
      "properties": {
        "plusMult": 0
      },
      onReroll(gameState) {this.properties.plusMult += 2},
      onScore(gameState, card) {return {"plusMult": this.properties.plusMult};},
      "cost": 5
    },

    "Flower Pot": {
      "rarity": "Uncommon",
      getDesc(gameState) { return " X3 Mult if poker hand contains a Diamond card, Club card, Heart card, and Spade card" },
      onScore(gameState, cards) {
        let tempSuits = structuredClone(suits);
        let wilds = 0;
        getHandType(gameState, cards).cards.forEach(card => {
          if (card.enhancement.toLowerCase() == "wildcard" && card.disabled) {
            wilds++;
          } else {
            if (tempSuits.contains(card.suit)) tempSuits.splice(tempSuits.indexOf(card.suit), 1);
          }
        })
        if (tempSuits.length - wilds < 1) return {"timesMult": 3}
      },
      "cost": 6
    },

    "Fortune Teller": {
      getDesc(gameState) { return `+1 Mult per Tarot card used this run\n(Currently +${this.properties.plusMult})` },
      "rarity": "Common",
      "properties": {
        "plusMult": 0
      },
      onScore(gameState, cards) {return {"plusMult": this.properties.plusMult};}, // TODO: this run (replace properties)
      "cost": 6
    },

    "Four Fingers": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "All Flushes and Straights can be made with 4 cards" },
      "cost": 7
    },

    "Gift Card": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Add $1 of sell value to every Joker and Consumable card at end of round" },
      onRoundEnd(gameState) {
        gameState.jokers.forEach(joker => {
          if (!joker.addedSellValue) joker.addedSellValue = 0;
          joker.addedSellValue++
        });
        gameState.consumables.forEach(consumable => {
          if (!consumable.addedSellValue) consumable.addedSellValue = 0;
          consumable.addedSellValue++;
        });
      },
      "cost": 6
    },

    "Glass Joker": {
      "rarity": "Uncommon",
      getDesc(gameState) { return `This Joker gains X0.75 Mult for every Glass Card that is destroyed\n(Currently X${this.properties.timesMult})` },
      "properties": {"timesMult": 1},
      onGlassBreak(gameState) {this.properties.timesMult += 0.75}, // TODO
      onScore(gameState, cards) {return {"timesMult": this.properties.timesMult}},
      "cost": 6
    },

    "Gluttonous Joker": {
      getDesc(gameState) { return "Played cards with Club suit give +3 Mult when scored" },
      "rarity": "Common",
      onCardScored(gameState, card) {
        if (isSuit(gameState, card, "Clubs")) {
          return {"plusMult": 3};
        }
      },
      "cost": 5
    },

    "Golden Joker": {
      getDesc(gameState) { return "Earn $4 at end of round" },
      "rarity": "Common",
      onRoundEnd(gameState) {return {"money": 4};},
      "cost": 6
    },

    "Greedy Joker": {
      getDesc(gameState) { return "Played cards with Diamond suit give +3 Mult when scored" },
      "rarity": "Common",
      onCardScored(gameState, card) {
        if (isSuit(gameState, card, "Diamonds")) {
          return {"plusMult": 3};
        }
      },
      "cost": 5
    },

    "Green Joker": {
      getDesc(gameState) { return `+1 Mult per hand played, -1 Mult per discard\n(Currently +${this.properties.plusMult})` },
      "rarity": "Common",
      "properties": {
        "plusMult": 0
      },
      onHandPlayed(gameState, cards) {this.properties.plusMult++;},
      onDiscard(gameState, cards) {this.properties.plusMult = Math.max (0, this.properties.plusMult - 1);},
      onScore(gameState, cards) {return {"plusMult": this.properties.plusMult};},
      "cost": 4
    },

    "Gros Michel": {
      getDesc(gameState) { return "+15 Mult, 1 in 6 chance this card is destroyed at end of round" },
      "rarity": "Common",
      onScore(gameState, cards) {return {"plusMult": 15};},
      onRoundEnd(gameState) {
        if (random(gameState, 1, 6)) {
          if (gameState.bannedCards.includes("Cavendish"))
            gameState.bannedCards.splice(gameState.indexOf("Cavendish"), 1);
          if (!gameState.bannedCard.includes("Gros Michel"))
            gameState.bannedCard.push("Gros Michel");
          
          return {"destroy": true};
        }
      },
      "cost": 5
    },

    "Hack": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Retrigger each played 2, 3, 4, or 5" },
      onCardScored(gameState, card) {
        if (isRank(gameState, card, 2) || isRank(gameState, card, 3) || isRank(gameState, card, 4) || isRank(gameState, card, 5))
          return {"retriggers": 1};
      },
      "cost": 6
    },

    "Half Joker": {
      getDesc(gameState) { return "+20 Mult if played hand contains 3 or fewer cards" },
      "rarity": "Common",
      onScore(gameState, cards) {
        if (cards.length <= 3) {
          return {"plusMult": 20};
        }
      },
      "cost": 5
    },

    "Hallucination": {
      getDesc(gameState) { return "1 in 2 chance to create a Tarot card when any Booster Pack is opened (Must have room)" },
      "rarity": "Common",
      onBoosterPack(gameState) {
        if (random(gameState, 1, 2))
          addConsumable(gameState, newCard(gameState, "Tarot Card"));
      },
      "cost": 4
    },

    "Hanging Chad": {
      getDesc(gameState) { return "Retrigger first played card used in scoring 2 additional times" },
      "rarity": "Common",
      onCardScored(gameState, card) {
        if (card.index == 0)
          return {"retriggers": 2};
      },
      "cost": 4
    },

    "Hiker": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Every played card permanently gains +5 Chips when scored" },
      onCardScored(gameState, card) {
        if (!card.extraChips) card.extraChips = 0;
        card.extraChips += 5;
      },
      "cost": 5
    },

    "Hit the Road": {
      "rarity": "Rare",
      getDesc(gameState) { return `This Joker gains X0.5 Mult for every Jack discarded this round\n(Currently X${this.properties.timesMult})` },
      "properties": {
        "timesMult": 1
      },
      onDiscard(gameState, cards) {
        this.properties.timesMult += cards.filter(card => isRank(gameState, card, "Jack")).length * 0.5;
      },
      onRoundEnd(gameState) {this.properties.timesMult = 1;},
      "cost": 8
    },

    "Hologram": {
      "rarity": "Uncommon",
      getDesc(gameState) { return `This Joker gains X0.25 Mult every time a playing card is added to your deck\n(Currently X${this.properties.timesMult})` },
      "properties": {
        "timesMult": 1
      },
      onCardAdded(gameState) {this.properties.timesMult += 0.25;}, // TODO: onCardAdded
      onScore(gameState, cards) {return {"timesMult": this.properties.timesMult}},
      "cost": 7
    },

    "Ice Cream": {
      getDesc(gameState) { return `+${this.properties.plusChips} Chips, -5 Chips for every hand played` },
      "rarity": "Common",
      "properties" : {"plusChips": 100},
      onScore(gameState, cards) {
        this.properties.plusChips -= 5;
        return {
          "plusChips": this.properties.plusChips + 5,
          "destroy": this.properties.plusChips <= 0
        }
      },
      "cost": 5
    },

    "The Idol": {
      "rarity": "Uncommon",
      getDesc(gameState) { return `Each played ${gameState.jokerProperties.idol.card.rank} of ${gameState.jokerProperties.idol.card.suit} gives X2 Mult when scored, Card changes every round` },
      "properties": {
        "card": {"rank": "Ace", "suit": "Spades"}
      }, // TODO: fix this to make all idols sync their periods
      onRoundEnd(gameState) {
        const possibleCards = gameState.fullDeck.filter(card => card.enhancement.toLowerCase().replaceAll(" ", "") != "stonecard");
        if (possibleCards.length < 1) return;
        gameState.jokerProperties.idol.card = structuredClone(possibleCards[Math.floor(Math.random() * possibleCards.length)]);
      },
      onCardScored(gameState, card) {
        if (isSuit(gameState, card, gameState.jokerProperties.idol.card.suit) && isRank(gameState, card, gameState.jokerProperties.idol.card.rank)) {
          return {"timesMult": 2};
        }
      },
      "cost": 6
    },

    "Invisible Joker": {
      "rarity": "Rare",
      getDesc(gameState) { return `After 2 rounds, sell this card to Duplicate a random Joker\n(${this.properties.roundsRemaining > 0 ? `Rounds remaining: ${this.properties.roundsRemaining}` : "Active!"})` },
      "properties": {
        "roundsRemaining": 2
      },
      onRoundEnd(gameState) {
        this.properties.roundsRemaining = Math.max(0, this.properties.roundsRemaining-1);
      },
      onSell(gameState) {
        if (this.properties.roundsRemaining < 1) {
          let invis = false;
          let jokers = [];
          gameState.jokers.forEach(joker => {
            if (joker.name.toLowerCase().replaceAll(" ", "") == "invisiblejoker" && !invis) {
              invis = true;
            } else {
              jokers.push(structuredClone(joker));
            }
          });
          if (jokers.length) {
            const randomJoker = jokers[Math.floor(Math.random() * jokers.length)];
            if (randomJoker.name.toLowerCase().replaceAll(" ", "") == "invisiblejoker") randomJoker.properties.roundsRemaining = 2;
            if (randomJoker.edition.toLowerCase().replaceAll(" ", "") == "negative") delete randomJoker.edition;
            randomJoker.copied = true;
            gameState.jokers.push(randomJoker);
          }
        }
      },
      "cost": 8
    },

    "Joker": { // Jimbo!
      getDesc(gameState) { return "+4 Mult" },
      "rarity": "Common",
      onScore(gameState, cards) {return {"plusMult": 4};},
      "cost": 2
    },

    "Jolly Joker": {
      getDesc(gameState) { return "+8 Mult if played hand contains a Pair" },
      "rarity": "Common",
      onScore(gameState, cards) {
        if (cardsContain(gameState, getHandType(gameState, cards).cards, "Pair")) return {"plusMult": 8};
      },
      "cost": 3
    },

    "Juggler": {
      getDesc(gameState) { return "+1 hand size" },
      "rarity": "Common",
      onBuy(gameState) {
        gameState.defaultDiscards++;
      },
      onDestroy(gameState) {
        gameState.defaultDiscards--;
      },
      "cost": 4
    },

    "Loyalty Card": {
      "rarity": "Uncommon",
      getDesc(gameState) { return `X4 Mult every 6 hands played\n(${this.properties.roundsRemaining > 0 ? `Rounds remaining: ${this.properties.roundsRemaining}` : "Active!"} rounds left)` },
      "properties": {
        "roundsRemaining": 6
      },
      onScore(gameState, cards) {
        const oldRounds = this.properties.roundsRemaining;
        this.properties.roundsRemaining = (oldRounds + 8) % 7;
        if (oldRounds < 1) {
          return {"timesMult": 4};
        }
      },
      "cost": 5
    },

    "Luchador": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Sell this card to disable the current Boss Blind" },
      onSell(gameState) {
        // TODO
      },
      "cost": 5
    },

    "Lucky Cat": {
      "rarity": "Uncommon",
      getDesc(gameState) { return `This Joker gains X0.25 Mult every time a Lucky card successfully triggers\n(Currently X${this.properties.timesMult})` },
      "properties": {
        "timesMult": 1
      },
      onScore(gameState, cards) {return {"timesMult": this.properties.timesMult};},
      onLuckyTrigger(gameState) {
        this.properties.timesMult += 0.25;
      },
      "cost": 6
    },

    "Lusty Joker": {
      getDesc(gameState) { return "Played cards with Heart suit give +3 Mult when scored" },
      "rarity": "Common",
      onCardScored(gameState, card) {
        if (isSuit(gameState, card, "Hearts")) return {"plusMult": 3};
      },
      "cost": 5
    },

    "Mad Joker": {
      getDesc(gameState) { return "+10 Mult if played hand contains a Two Pair" },
      "rarity": "Common",
      onScore(gameState, cards) {
        if (cardsContain(gameState, getHandType(gameState, cards).cards, "Two Pair")) return {"plusMult": 10};
      },
      "cost": 4
    },

    "Madness": {
      "rarity": "Uncommon",
      getDesc(gameState) { return `When Small Blind or Big Blind is selected, gain X0.5 Mult and destroy a random Joker\n(Currently X${this.timesMult})` },
      "properties": {
        "timesMult": 1
      },
      onBlindStart(gameState) {
        this.properties.timesMult += 0.5;
        // TODO
      },
      onScore(gameState, cards) {
        return {"timesMult": this.properties.timesMult};
      },
      "cost": 7
    },

    "Mail-In Rebate": {
      getDesc(gameState) { return `Earn $5 for each discarded ${this.jokerProperties.rebate.rank}, rank changes every round` },
      "rarity": "Common",
      onDiscard(gameState, cards) {
        cards.forEach(card => {
          if (isSuit(gameState, card, this.jokerProperties.rebate.rank)) { // TODO
            gameState.money += 5;
          }
        })
      },
      "cost": 4
    },

    "Marble Joker": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Adds one Stone card to deck when Blind is selected" },
      onBlindStart(gameState) {
        drawCard(gameState, newCard(gameState, "Playing Card", false, true));
      },
      "cost": 6
    },

    "Matador": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Earn $8 if played hand triggers the Boss Blind ability" },
      "cost": 7
      // TODO
    },

    "Merry Andy": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "+3 discards each round, -1 hand size" },
      onBlindStart(gameState) {
        gameState.blind.discards += 3; // TODO: make sure
      },
      onBuy(gameState) {
        gameState.handSize--;
      },
      onDestroy(gameState) {
        gameState.handSize++;
      },
      "cost": 7
    },

    "Midas Mask": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "All played face cards become Gold cards when scored" }, // TODO: make sure this triggers at the right time & counts only scored cards
      onCardScored(gameState, card) {
        if (isFaceCard(card)) {
          card.enhancement = "Gold Card";
        }
      },
      "cost": 7
    },

    "Mime": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Retrigger all card held in hand abilities" },
      onCardHeld(gameState, card) {
        return {"retriggers": 1};
      }, // TODO : Auto copy mime at end
      "cost": 5
    },

    "Misprint": {
      getDesc(gameState) { return "+? Mult" }, // TODO: decide if i wanna change description
      "rarity": "Common",
      onScore(gameState, cards) {
        return {"plusMult": Math.floor(Math.random() * 24)};
      },
      "cost": 4
    },

    "Mr. Bones": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Prevents Death if chips scored are at least 25% of required chips, self destructs" },
      "cost": 5
      // TODO
    },

    "Mystic Summit": {
      getDesc(gameState) { return "+15 Mult when 0 discards remaining" },
      "rarity": "Common",
      onScore(gameState, cards) {
        if (gameState.blind.discards < 1) {
          return {"plusMult": 15};
        }
      },
      "cost": 5
    },

    "Obelisk": {
      "rarity": "Rare",
      getDesc(gameState) { return `This Joker gains X0.2 Mult per consecutive hand played without playing your most played poker hand\n(Currently X${this.properties.timesMult})` },
      "properties": {
        "timesMult": 1
      },
      onHandPlayed(gameState, cards) {
        const mostHandPlays = Math.max(...Object.values(gameState.handPlays));
        if (gameState.handPlays[getHandType(gameState, cards).handType] >= mostHandPlays) {
          this.properties.timesMult = 1;
        } else {
          this.properties.timesMult += 0.2;
        }
      },
      onScore(gameState, cards) {
        return {"timesMult": this.properties.timesMult};
      },
      "cost": 8
    },

    "Odd Todd": {
      getDesc(gameState) { return "Played cards with odd rank give +31 Chips when scored (A, 9, 7, 5, 3)" },
      "rarity": "Common",
      onCardScored(gameState, card) {
      if (isRank(gameState, card, "Ace") || isRank(gameState, card, 9) || isRank(gameState, card, 7) || isRank(gameState, card, 5) || isRank(gameState, card, 3))
        return {"multChips": 31};
      },
      "cost": 4
    },

    "Onyx Agate": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Played cards with Club suit give +7 Mult when scored" },
      onCardScored(gameState, card) {
        if (isRank(gameState, card, "Clubs")) return {"plusMult": 7};
      },
      "cost": 7
    },

    "Oops! All 6s": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Doubles all listed probabilities (ex: 1 in 3 -> 2 in 3)" },
      "cost": 4
    },

    "The Order": {
      "rarity": "Rare",
      getDesc(gameState) { return " X3 Mult if played hand contains a Straight" },
      onScore(gameState, cards) {
        if (cardsContain(gameState, getHandType(gameState, cards).cards, "Straight")) return {"timesMult": 3};
      },
      "cost": 8
    },

    "Pareidolia": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "All cards are considered face cards" },
      "cost": 5
    },

    "Perkeo": {
      "rarity": "Legendary",
      getDesc(gameState) { return "Creates a Negative copy of 1 random consumable card in your possession at the end of the shop" },
      "cost": 20,

      // TODO: check if cards are more likely if theres more of them
    },

    "Photograph": {
      getDesc(gameState) { return "First played face card gives X2 Mult when scored" },
      "rarity": "Common",
      "properties": {
        "index": undefined
      },
      onHandPlayed(gameState, cards) {
        this.properties.index = undefined;
        getHandType(gameState, cards).cards.forEach((card, idx) => {
          if (isFaceCard(gameState, card) && !this.properties.index) {
            this.properties.index = idx;
          }
        })
      },
      onCardScored(gameState, card) {
        if (card.index == this.properties.index)
          return {"timesMult": 2};
      },
      "cost": 5
    },

    "Popcorn": {
      getDesc(gameState) { return `+${plusMult} Mult -4 Mult per round played` },
      "rarity": "Common",
      "properties": {
        "plusMult": 20
      },
      onScore(gameState, cards) {
        this.properties.plusMult -= 4;
        return {
          "plusMult": this.properties.plusMult + 4,
          "destroy": this.properties.plusMult <= 0
        };
      },
      "cost": 5
    },

    "Raised Fist": {
      getDesc(gameState) { return "Adds double the rank of lowest ranked card held in hand to Mult" },
      "rarity": "Common",
      onScore(gameState, cards) {
        return {"plusMult": (gameState.blind.hand.length ? Math.min(...gameState.blind.hand) : 0) * 2};
      },
      "cost": 5
    },

    "Ramen": {
      "rarity": "Uncommon",
      getDesc(gameState) { return `X${this.properties.timesMult} Mult, loses X0.01 Mult per card discarded` },
      "properties": {
        "timesMult": 2
      },
      onDiscard(gameState, cards) {
        this.properties.timesMult -= 0.01 * cards.length;
        return {"destroy": this.properties.timesMult <= 0};
      },
      onScore(gameState, cards) {
        return {"timesMult": this.properties.timesMult};
      },
      "cost": 6
    },

    "Red Card": {
      getDesc(gameState) { return `This Joker gains +3 Mult when any Booster Pack is skipped\n(Currently +${this.properties.plusMult})` },
      "rarity": "Common",
      "properties": {
        "plusMult": 0
      },
      onBoosterPackSkipped(gameState) { // TODO
        this.properties.plusMult += 3;
      },
      onScore(gameState, cards) {
        return {"plusMult": this.properties.plusMult};
      },
      "cost": 5
    },

    "Reserved Parking": {
      getDesc(gameState) { return "Each face card held in hand has a 1 in 2 chance to give $1" },
      "rarity": "Common",
      onCardHeld(gameState, card) {
        if (isFaceCard(gameState, card) && random(gameState, 1, 2)) {
          gameState.money++;
        }
      },
      "cost": 6
    },

    "Ride the Bus": {
      getDesc(gameState) { return `This Joker gains +1 Mult per consecutive hand played without a scoring face card\n(Currently +${plusMult})` },
      "rarity": "Common",
      "properties": {
        "plusMult": 0
      },
      onHandPlayed(gameState, cards) {
        let hasFaceCard = false;
        getHandType(cards).cards.forEach(card => {
          if (isFaceCard(card)) hasFaceCard = true;
        })
        if (hasFaceCard) {
          this.properties.plusMult = 0;
        } else {
          this.properties.plusMult++;
        }
      },
      onScore(gameState, cards) {
        return {"plusMult": this.properties.plusMult};
      },
      "cost": 6
    },

    "Riff-Raff": {
      getDesc(gameState) { return "When Blind is selected, create 2 Common Jokers (Must have room)" },
      "rarity": "Common",
      onBlindStart(gameState) {
        // TODO
      },
      "cost": 6
    },

    "Showman": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Joker, Tarot, Planet, and Spectral cards may appear multiple times" },
      "cost": 5
    },

    "Rocket": {
      "rarity": "Uncommon",
      getDesc(gameState) { return `Earn $${this.properties.money} at end of round. Payout increases by $2 when Boss Blind is defeated` },
      "properties": {
        "money": 1
      },
      onRoundEnd(gameState) {
        if (blindName != "smallblind" && blindName != "bigblind") // TODO: find out order & replace "blindName"
          this.properties.money += 2;
        return {"money": this.properties.money};
      },
      "cost": 6
    },

    "Rough Gem": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Played cards with Diamond suit earn $1 when scored" },
      onCardScored(gameState, card) {
        if (isSuit(gameState, card, "Diamonds")) gameState.money++;
      },
      "cost": 7
    },

    "Runner": {
      getDesc(gameState) { return `Gains +15 Chips if played hand contains a Straight\n(Currently +${this.properties.plusChips})` },
      "rarity": "Common",
      "properties": {
        "plusChips": 0
      },
      onHandPlayed(gameState, cards) {
        if (cardsContain(gameState, getHandType(gameState, cards).cards, "Straight")) this.properties.plusChips += 15; 
      },
      onScore(gameState, cards) {
        return {"plusChips": this.properties.plusChips};
      },
      "cost": 5
    },

    "Satellite": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Earn $1 at end of round per unique Planet card used this run" },
      onRoundEnd(gameState) {
        return {"money": gameState.jokerProperties.satellite}; // TODO: jokerProperties
      },
      "cost": 6
    },

    "Scary Face": {
      getDesc(gameState) { return "Played face cards give +30 Chips when scored" },
      "rarity": "Common",
      onCardScored(gameState, card) {
        if (isFaceCard(gameState, card)) return {"plusChips": 30};
      },
      "cost": 4
    },

    "Scholar": {
      getDesc(gameState) { return "Played Aces give +20 Chips and +4 Mult when scored" },
      "rarity": "Common",
      onCardScored(gameState, card) {
        if (isSuit(gameState, card, "Ace")) return {"plusChips": 20, "plusMult": 4};
      },
      "cost": 4
    },

    "Séance": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "If poker hand is a Straight Flush, create a random Spectral card (Must have room)" },
      onHandPlayed(gameState, cards) {
        if (getHandType(cards).handType == "Straight Flush") addConsumable(gameState, newCard(gameState, "Spectral Card"));
      },
      "cost": 6
    },

    "Seeing Double": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "X2 Mult if played hand has a scoring Club card and a scoring card of any other suit" },
      onScore(gameState, cards) {
        // TODO
        getHandType(cards).cards.forEach()
      },
      "cost": 6
    },

    "Seltzer": {
      "rarity": "Uncommon",
      getDesc(gameState) { return `Retrigger all cards played for the next ${this.properties.retriggers} hand${this.properties.retriggers.length == 1 ? "" : "s"}` },
      "properties": {
        "retriggers": 10
      },
      onCardScored(gameState, card) {
        return {"retriggers": 1};
      },
      onScore(gameState, cards) {
        this.properties.retriggers--;
        if (this.properties.retriggers < 1) return {"destroy": true};
      },
      "cost": 6
    },

    "Shoot the Moon": {
      getDesc(gameState) { return "Each Queen held in hand gives +13 Mult" },
      "rarity": "Common",
      onCardHeld(gameState, card) {
        if (isSuit(gameState, card, "Queen")) return {"plusMult": 13};
      },
      "cost": 5
    },

    "Shortcut": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Allows Straights to be made with gaps of 1 rank (ex: 10 8 6 5 3)" },
      "cost": 7
    },

    "Sixth Sense": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "If first hand of round is a single 6, destroy it and create a Spectral card (Must have room)" },
      onHandPlayed(gameState, cards) {
        if (cards.length == 1 && isRank(gameState, cards[0], "6")) {
          addConsumable(gameState, newCard(gameState, "Spectral Card"));
          gameState.fullDeck.forEach((card, idx) => {
            if (card == cards[0]) gameState.fullDeck.splice(idx, 1);
          });
        }
      },
      "cost": 6
    },

    "Sly Joker": {
      getDesc(gameState) { return "+50 Chips if played hand contains a Pair" },
      "rarity": "Common",
      onScore(gameState, cards) {
        if (cardsContain(gameState, getHandType(gameState, cards).cards, "Pair")) return {"plusChips": 50};
      },
      "cost": 3
    },

    "Smeared Joker": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Hearts and Diamonds count as the same suit, Spades and Clubs count as the same suit" },
      "cost": 7
    },

    "Smiley Face": {
      getDesc(gameState) { return "Played face cards give +5 Mult when scored" },
      "rarity": "Common",
      onCardScored(gameState, card) {
        if (isFaceCard(gameState, card)) return {"plusMult": 5};
      },
      "cost": 4
    },

    "Sock and Buskin": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Retrigger all played face cards" },
      onCardScored(gameState, card) {
        if (isFaceCard(gameState, card)) return {"retriggers": 1};
      },
      "cost": 6
    },

    "Space Joker": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "1 in 4 chance to upgrade level of played poker hand" },
      onHandPlayed(gameState, cards) {
        if (random(gameState, 1, 4)) {
          gameState.handLevels[getHandType(gameState, cards).handType]++;
        }
      },
      "cost": 5
    },

    "Splash": {
      getDesc(gameState) { return "Every played card counts in scoring" },
      "rarity": "Common",
      "cost": 3
    },

    "Square Joker": {
      getDesc(gameState) { return `This Joker gains +4 Chips if played hand has exactly 4 cards\n(Currently +${this.properties.plusChips})` },
      "rarity": "Common",
      "properties": {
        "plusChips": 0
      },
      onHandPlayed(gameState, cards) {
        if (cards.length == 4) {
          this.properties.plusChips += 4;
        }
      },
      onScore(gameState, cards) {
        return {"plusChips": this.properties.plusChips};
      },
      "cost": 4
    },

    "Steel Joker": {
      "rarity": "Uncommon",
      getDesc(gameState) { return `Gives X0.2 Mult for each Steel Card in your full deck\n(Currently X${gameState.fullDeck.filter(card => card.enhancement == "Steel Card").length*0.2+1})` },
      onScore(gameState, cards) {
        const steelCards = gameState.fullDeck.filter(card => card.enhancement == "Steel Card").length;
        return {"timesMult": 1 + (0.2*steelCards)}
      },
      "cost": 7
    },

    "Joker Stencil": {
      "rarity": "Uncommon",
      getDesc(gameState) { return " X1 Mult for each empty Joker slot, Joker Stencil included" },
      onScore(gameState, cards) {
        return {"timesMult": gameState.jokerCount-gameState.jokers.filter(joker => !joker.name == "Joker Stencil").length} // TODO: check how it works with debuffed joker stencils and if should use jokerCount() instead
      },
      "cost": 8
    },

    "Stone Joker": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Gives +25 Chips for each Stone Card in your full deck" },
      onScore(gameState, cards) {
        const stoneCards = gameState.fullDeck.filter(card => card.enhancement == "Stone Card").length;
        return {"plusChips": 25*stoneCards}
      },
      "cost": 6
    },

    "Stuntman": {
      "rarity": "Rare",
      getDesc(gameState) { return "+250 Chips, -2 hand size" },
      onBuy(gameState) {
        gameState.handSize -= 2;
      }, // TODO: check how copying works if can copy
      onDestroy(gameState) {
        gameState.handSize += 2;
      },
      onScore(gameState, cards) {
        return {"plusChips": 250};
      },
      "cost": 7
    },

    "Supernova": {
      getDesc(gameState) { return "Adds the number of times poker hand has been played this run to Mult" },
      "rarity": "Common",
      onScore(gameState, cards) {
        return {"plusMult": gameState.handPlays[getHandType(cards).handType]};
      },
      "cost": 5
    },

    "Superposition": {
      getDesc(gameState) { return "Create a Tarot card if poker hand contains an Ace and a Straight (Must have room)" },
      "rarity": "Common",
      onHandPlayed(gameState, cards) { // TODO: check if aces are counted if they arent scored
        if (getHandType(gameState).cards.filter(card => card.rank).length > 0 && cardsContain(gameState, cards, "Straight")) {
          addConsumable(gameState, newCard(gameState, "Tarot Card"));
        }
      },
      "cost": 4
    },

    "Swashbuckler": {
      getDesc(gameState) { return "Adds the sell value of all other owned Jokers to Mult" },
      "rarity": "Common",
      "cost": 4
      // TODO: check if it includes duplicated swashbucklers
    },

    "Throwback": {
      "rarity": "Uncommon",
      getDesc(gameState) { return `X0.25 Mult for each Blind skipped this run\n(Currently X${this.properties.timesMult})` },
      "properties": {
        "timesMult": 1
      },
      onBlindSkipped() {
        this.timesMult += 0.25
      },
      onScore(gameState, cards) {
        return {"timesMult": this.properties.timesMult}
      },
      "cost": 6
    },

    "Golden Ticket": {
      getDesc(gameState) { return "Played Gold cards earn $4 when scored" },
      "rarity": "Common",
      onCardScored(gameState, card) {
        if (card.enhancement == "Gold Card") gameState.money += 4;
      },
      "cost": 5
    },

    "To the Moon": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "Earn an extra $1 of interest for every $5 you have at end of round" },
      onBlindEnd() {
        return {"money": Math.floor(gameState.money/5)};
      },
      "cost": 5
    },

    "To Do List": {
      getDesc(gameState) { return "Earn $4 if poker hand is a [poker hand], poker hand changes at end of round" },
      "rarity": "Common",
      "cost": 4
      // TODO ha fitting
    },

    "Trading Card": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "If first discard of round has only 1 card, destroy it and earn $3" },
      onDiscard(gameState, cards) {
        // TODO: check if first discard
        if (cards.length == 1) {
          gameState.money += 3;
          gameState.fullDeck.forEach((card, idx) => {
            if (card == cards[0]) gameState.fullDeck.splice(idx, 1);
          });
        }
      },
      "cost": 6
    },

    "The Tribe": {
      "rarity": "Rare",
      getDesc(gameState) { return "X2 Mult if played hand contains a Flush" },
      onScore(gameState, cards) {
        if (cardsContain(gameState, getHandType(gameState, cards).cards, "Flush")) return {"timesMult": 2};
      },
      "cost": 8
    },

    "Triboulet": {
      "rarity": "Legendary",
      getDesc(gameState) { return "Played Kings and Queens each give X2 Mult when scored" },
      onScore(gameState, card) {
        if (isRank(gameState, card, "King") || isRank(gameState, card, "Queen")) return {"timesMult": 2};
      },
      "cost": 20
    },

    "The Trio": {
      "rarity": "Rare",
      getDesc(gameState) { return "X3 Mult if played hand contains a Three of a Kind" },
      onScore(gameState, cards) {
        if (cardsContain(gameState, getHandType(gameState, cards).cards, "Three of a Kind")) return {"timesMult": 3};
      },
      "cost": 8
    },

    "Troubadour": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "+2 hand size, -1 hand each round" },
      onBuy(gameState) {
        gameState.handSize += 2;
        gameState.defaultHands--;
      }, // TODO check if it works like this
      onDestroy(gameState) {
        gameState.handSize -= 2;
        gameState.defaultHands++;
      },
      "cost": 6
    },

    "Spare Trousers": {
      "rarity": "Uncommon",
      getDesc(gameState) { return `This Joker gains +2 Mult if played hand contains a Two Pair\n(Currently +${this.properties.plusMult})` },
      "properties": {
        "plusMult": 0
      },
      onHandPlayed(gameState, cards) {
        if (cardsContain(gameState, cards, "Two Pair")) this.properties.plusMult
      },
      "cost": 6
    },

    "Turtle Bean": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "+5 hand size, reduces by 1 every round" },
      "cost": 6
      // TODO: check how works
    },

    "Vagabond": {
      "rarity": "Rare",
      getDesc(gameState) { return "Create a Tarot card if hand is played with $4 or less" },
      onHandPlayed(gameState, cards) { // TODO: (must have room)
        if (gameState.money <= 4) addConsumable(gameState, newCard(gameState, "Tarot Card"));
      },
      "cost": 8
    },

    "Vampire": {
      "rarity": "Uncommon",
      getDesc(gameState) { return "This Joker gains X0.1 Mult per scoring Enhanced card played, removes card Enhancement" },
      "properties": {
        "timesMult": 1
      },
      onHandPlayed(gameState, cards) {
        getHandType(gameState, cards).cards.forEach(card => {
          if (card.enhancement) {
            delete card.enhancement;
            this.properties.timesMult += 0.1;
          }
        })
      },
      onScore(gameState, cards) {
        return {"timesMult": this.properties.timesMult};
      },
      "cost": 7
    },

    "Walkie Talkie": {
      getDesc(gameState) { return "Each played 10 or 4 gives +10 Chips and +4 Mult when scored" },
      "rarity": "Common",
      onCardScored(gameState, card) {
        if (isRank(gameState, card, "10") || isRank(gameState, card, "4")) {
          return {"plusMult": 4, "plusChips": 10};
        }
      },
      "cost": 4
    },

    "Wee Joker": {
      "rarity": "Rare",
      getDesc(gameState) { return `This Joker gains +8 Chips when each played 2 is scored\n(Currently ${this.properties.plusChips})` },
      "properties": {
        "plusChips": 0
      },
      onCardScored(gameState, card) {
        if (isSuit(gameState, card, "2")) {
          this.properties.plusChips += 8;
        }
      },
      onScore(gameState, cards) {
        return {"plusChips": this.properties.plusChips};
      },
      "cost": 8
    },

    "Wily Joker": {
      getDesc(gameState) { return "+100 Chips if played hand contains a Three of a Kind" },
      "rarity": "Common",
      onScore(gameState, cards) {
        if (cardsContain(gameState, getHandType(gameState, cards).cards, "Three of a Kind")) return {"plusChips": 100};
      },
      "cost": 4
    },

    "Wrathful Joker": {
      getDesc(gameState) { return "Played cards with Spade suit give +3 Mult when scored" },
      "rarity": "Common",
      onCardScored(gameState, card) {
        if (isSuit(gameState, card, "Spades")) {
          return {"plusMult": 3};
        }
      },
      "cost": 5
    },

    "Yorick": {
      "rarity": "Legendary",
      getDesc(gameState) { return "This Joker gains X1 Mult every 23 cards discarded" }, // TODO: add info
      "properties": {
        "discardsLeft": 23,
        "timesMult": 1
      },
      onDiscard(gameState, cards) {
        const newDiscards = (this.properties.discardsLeft - cards.length);
        if (newDiscards < 1) {
          this.properties.timesMult++;
          this.properties.discardsLeft += newDiscards + 23;
        }
      },
      "cost": 20
    },
    
    "Zany Joker": {
      getDesc(gameState) { return "+12 Mult if played hand contains a Three of a Kind" },
      "rarity": "Common",
      onScore(gameState, cards) {
        if (cardsContain(gameState, getHandType(gameState, cards).cards, "Three of a Kind")) return {"timesMult": 12};
      }
    },
    "cost": 4
};

const blinds = [
  {
      "name": "The Hook",
      "debuff": "Discards 2 random\ncards per hand played",
      "minimumAnte": 1,
      "scoreMult": 2,
      "primaryColor": "#9f2909",
      "primaryShadow": "#651200",
      "secondaryColor": "#522a1e",
      "tertiaryColor": "#372a25",
      "isNormalBoss": true
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
      "isNormalBoss": true
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
      "isNormalBoss": true
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
      "isNormalBoss": true
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
      "isNormalBoss": true
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
      "isNormalBoss": true
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
      "isNormalBoss": true
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
      "isNormalBoss": true
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
      "isNormalBoss": true
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
      "isNormalBoss": true
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
      "isNormalBoss": true
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
      "isNormalBoss": true
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
      "isNormalBoss": true
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
      "isNormalBoss": true
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
      "isNormalBoss": true
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
      "isNormalBoss": true
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
      "isNormalBoss": true
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
      "isNormalBoss": true
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
      "isNormalBoss": true
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
      "isNormalBoss": true
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
      "isNormalBoss": true
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
      "isNormalBoss": true
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
      "isNormalBoss": true
  }
]

function newGame(deck = "Red Deck", stake = "White Stake") {
    let game = {
        "endless": false,
        stake,
        "state": "blind",
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
        "tags": [],
        deck,
        "vouchers": [],
        "anteBlinds": [],
        "blindBases": [300, 800, 2000, 5000, 11000, 20000, 35000, 50000],
        "handLevels": {
          "High Card": 1,
          "Pair": 1,
          "Two Pair": 1,
          "Three of a Kind": 1,
          "Straight": 1,
          "Flush": 1,
          "Full House": 1,
          "Four of a Kind": 1,
          "Straight Flush": 1,
          "Five of a Kind": 1,
          "Flush House": 1,
          "Flush Five": 1
        }, 
        "blackHolesUsed": 0,
        "handPlays": {
          "High Card": 0,
          "Pair": 0,
          "Two Pair": 0,
          "Three of a Kind": 0,
          "Straight": 0,
          "Flush": 0,
          "Full House": 0,
          "Four of a Kind": 0,
          "Straight Flush": 0,
          "Five of a Kind": 0,
          "Flush House": 0,
          "Flush Five": 0
        },   
        "shopWeights": {
          "Joker": {
            "odds": 20
          },
          "Tarot Card": {
            "odds": 4
          },
          "Planet Card": {
            "odds": 4
          },
          "Playing Card": {
            "odds": 0,
            "enhancement": 0,
            "edition": 0
          },
          "Spectral Card": {
            "odds": 0
          }
        },
        "editions": {
          "Foil": {
            "cost": 2,
            "odds": 2,
            "playingCardOdds": 4
          },
          "Holographic": {
            "cost": 2,
            "odds": 1.4,
            "playingCardOdds": 8
          },
          "Polychrome": {
            "cost": 2,
            "odds": 0.3,
            "playingCardOdds": 1.2
          },
          "Negative": {
            "cost": 2,
            "odds": 0.3,
            "playingCardOdds": 0 
          },
        },
        "shopSlots": 2,
        "discount": 1,
        "rerollBase": 5,
        "currentReroll": 5,
        "interestCap": 5,
        "shop": {
          "filled": false,
          "cards": [],
          "packs": [],
          "vouchers": []
        },
        "possibleVouchers": [
          "Overstock",
          "Clearance Sale",
          "Hone",
          "Reroll Surplus",
          "Crystal Ball",
          "Telescope",
          "Grabber",
          "Wasteful",
          "Tarot Merchant",
          "Planet Merchant",
          "Seed Money",
          "Blank",
          "Magic Trick",
          "Hieroglyph",
          "Director's Cut",
          "Paint Brush"
        ], 
        "firstShop": true,
        "bannedPacks": [],
        "bannedBlinds": [],
        "seenBlinds": [],
        "bannedCards": ["Cavendish"]
    };

    // Fill default deck
    game.fullDeck = cards["Playing Card"];



    switch (deck.toLowerCase().replaceAll(" ", "")) {
        case "reddeck":
            game.defaultDiscards++;
            break;
        case "bluedeck":
            game.defaultHands++;
            break;
        case "yellowdeck":
            game.money += 10;
            break;
        case "greendeck":
            break;
        case "blackdeck":
            game.jokerSlots++;
            game.defaultHands--;
            break;
        case "magicdeck":
            addVoucher(game, "Crystal Ball");
            game.consumables.push({"name": "The Fool"});
            game.consumables.push({"name": "The Fool"});
            break;
        case "nebuladeck":
            addVoucher(game, "Telescope");
            game.consumableSlots--;
            break;
        case "ghostdeck":
            game.consumables.push({"name": "Hex"});
            game.shopWeights["Spectral Card"].odds = 2;
            break;
        case "abandoneddeck":
            game.fullDeck = game.fullDeck.filter(card => !['Jack', 'Queen', 'King'].includes(card.rank));
            break;
        case "checkereddeck":
            game.fullDeck = game.fullDeck.map(card => {
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
            addVoucher(game, "Tarot Merchant");
            addVoucher(game, "Planet Merchant");
            addVoucher(game, "Overstock");
            break;
        case "painteddeck":
            game.jokerSlots--;
            game.handSize++;
            break;
        case "anaglyphdeck":
            break;
        case "plasmadeck":
            break;
        case "erraticdeck":
            for (let i = 0; i < 52; i++) {
                let card = {};
                card.suit = suits[Math.floor(Math.random() * suits.length)];
                card.rank = ranks[Math.floor(Math.random() * ranks.length)];
                card.chips = card.rank;
                if (["Jack", "Queen", "King"].includes(card.rank)) card.chips = 10;
                if (card.rank == "Ace") card.chips = 11;
                card.chips = BigInt(card.chips);
                return card;
            }
            break;
        default:
            throw new Error("Invalid deck");
    }

    switch (stake.toLowerCase()) {
        case "goldstake":
        case "orangestake":
        case "purplestake":
            game.defaultDiscards--;
            game.blindBases = [300n, 1000n, 3200n, 9000n, 25000n, 60000n, 110000n, 200000n];
            break;
        case "bluestake":
            game.defaultDiscards--;
        case "blackstake":
        case "greenstake":
            game.blindBases = [300n, 900n, 2600n, 8000n, 20000n, 36000n, 60000n, 100000n];
            break;
        case "redstake":
        case "whitestake":
            break;
        default:
            throw new Error("Invalid stake");
    }

    newBlinds(game);

    game.deckStartSize = game.fullDeck.length;

    return game;
}

function bigIntToScientific(n, significantDigits = 3) {
    const str = n.toString();
    const exponent = str.length - 1;
    const digits = str.slice(0, significantDigits);
    const mantissa = digits[0] + '.' + digits.slice(1);
    return `${mantissa}e${exponent}`;
}

function newBlinds(gameState) {
  const bossKey = gameState.ante > 0 && gameState.ante % 8 == 0 ? "isFinisherBoss" : "isNormalBoss" 
  let allowedBlinds = blinds.filter(blind => blind[bossKey] && blind.minimumAnte <= gameState.blind && !gameState.seenBlinds.includes(blind.name) && !gameState.bannedBlinds.includes(blind.name));
  if (allowedBlinds.length < 1) {
      gameState.seenBlinds = [];
      allowedBlinds = blinds.filter(blind => blind[bossKey] && blind.minimumAnte <= gameState.blind && !gameState.bannedBlinds.includes(blind.name));
  }
  
  const newBlind = allowedBlinds[Math.floor(Math.random() * allowedBlinds.length)];
  gameState.seenBlinds.push(newBlind.name);

  gameState.currentBlinds = [
      {"name": "Small Blind"},
      {"name": "Big Blind"},
      newBlind
  ];

  adjustBlinds(gameState);
}

function powBigInt(base, exp) { // TODO fix ns and stuff
    let result = 1;
    base = BigInt(base);
    exp = BigInt(exp);
    while (exp > 0n) {
        if (exp % 2n === 1n) result *= base;
        base *= base;
        exp /= 2n;
    }
    return result;
}
  
function log10BigInt(n) {
    let digits = 0n;
    while (n >= 10n) {
        n /= 10n;
        digits++;
    }
    return digits;
}

function adjustBlinds(gameState) {
    let base;
    if (gameState.ante < 1) {
        base = 100n;
    } else if (gameState.ante <= 8) {
        base = gameState.blindBases[gameState.ante-1];
    } else {
        const a = gameState.blindBases[7];
        const c = gameState.ante - 8;
        const d = 1 + 0.2 * c;
        const b = 1.6;

        const inner = b + Math.pow(k * c, d);
        const exponent = Math.pow(inner, c);
        base = BigInt(Math.floor(Number(a) * exponent));

        const digits = log10BigInt(result) - 1n;
        const roundingFactor = powBigInt(10n, digits);
        base -= result % roundingFactor;
    }
    gameState.currentBlinds[0] = base;
    gameState.currentBlinds[1] = base * 15n / 10n;
    gameState.currentBlinds[2] = base * gameState.currentBlinds[2].scoreMult;
}

function addVoucher(gameState, voucher) {
  gameState.vouchers.push(voucher);
  delete gameState.possibleVouchers[voucher];

  switch (voucher.toLowerCase().replaceAll(" ", "")) {
    case "overstock":
      gameState.possibleVouchers.push("Overstock Plus");
    case "overstockplus":
      gameState.shopSlots++;
      break;
    case "clearancesale":
      gameState.possibleVouchers.push("Liquidation");
      gameState.discount = 0.75;
      break;
    case "liquidation":
      gameState.discount = 0.5;
      break;
    case "hone":
      gameState.possibleVouchers.push("Hone");
      gameState.editions["Foil"].odds = 4;
      gameState.editions["Holographic"].odds = 2.8;
      gameState.editions["Polychrome"].odds = 0.9;
      gameState.editions["Foil"].playingCardOdds = 8;
      gameState.editions["Holographic"].playingCardOdds = 5.6;
      gameState.editions["Polychrome"].playingCardOdds = 2.4;
      break;
    case "glowup":
      gameState.editions["Foil"].odds = 8;
      gameState.editions["Holographic"].odds = 5.6;
      gameState.editions["Polychrome"].odds = 2.1;
      gameState.editions["Foil"].playingCardOdds = 16;
      gameState.editions["Holographic"].playingCardOdds = 11.2;
      gameState.editions["Polychrome"].playingCardOdds = 4.8;
      break;
    case "rerollsurplus":
      gameState.possibleVouchers.push("Reroll Glut");
    case "rerollglut":
      gameState.rerollBase -= 2;
      gameState.currentReroll -= 2;
      if (gameState.currentReroll < 0) gameState.currentReroll = 0;
      break;
    case "crystalball":
      gameState.possibleVouchers.push("Omen Globe");
      gameState.consumableSlots++;
      break;
    case "omenglobe":
      break;
    case "telescope":
      gameState.possibleVouchers.push("Observatory");
      break;
    case "observatory":
      break;
    case "grabber":
      gameState.possibleVouchers.push("Nacho Tong");
    case "nachotong":
      gameState.defaultHands++;
      break;
    case "wasteful":
      gameState.possibleVouchers.push("Wasteful");
    case "recyclomancy":
      gameState.defaultDiscards++;
      break;
    case "tarotmerchant":
      gameState.possibleVouchers.push("Tarot Tycoon");
      gameState.shopWeights["Tarot"].odds = 9.6;
      break;
    case "tarottycoon":
      gameState.shopWeights["Tarot"].odds = 32;
      break;
    case "planetmerchant":
      gameState.possibleVouchers.push("Planet Tycoon");
      gameState.shopWeights["Planet"].odds = 9.6;
      break;
    case "planettycoon":
      gameState.shopWeights["Planet"].odds = 32;
      break;
    case "seedmoney":
      gameState.possibleVouchers.push("Money Tree");
      gameState.interestcap = 10;
      break;
    case "moneytree":
      gameState.interestcap = 20;
      break;
    case "blank":
      gameState.possibleVouchers.push("Antimatter");
      break;
    case "antimatter":
      gameState.jokerSlots++;
      break;
    case "magictrick":
      gameState.possibleVouchers.push("Illusion");
      gameState.shopWeights["Playing Card"].odds = 4;
      break;
    case "illusion":
      gameState.shopWeights["Playing Card"].enhancement = 40;
      gameState.shopWeights["Playing Card"].edition = 20;
      break;
    case "hieroglyph":
      gameState.possibleVouchers.push("Petroglyph");
      gameState.ante--;
      gameState.defaultHands--;
      break;
    case "petroglyph":
      gameState.ante--;
      gameState.defaultDiscards--;
      break;
    case "director'scut":
      gameState.possibleVouchers.push("Retcon");
      break;
    case "retcon":
      break;
    case "paintbrush":
      gameState.possibleVouchers.push("Palette");
    case "palette":
      gameState.handSize++;
      break;
    default:
      throw new Error("Invalid voucher");
  }
}

function newCard(gameState, cardType, certificate = false, stone = false) {
  let card;
  const rarity = pickByPercentage([
    {"type": "Common", "odds": 70},
    {"type": "Uncommon", "odds": 25},
    {"type": "Rare", "odds": 5},
  ]);
  const jokerNames = gameState.jokers.map(joker => joker.name.toLowerCase());
  do {
    if (cardType == "Joker") {
      const jokersOfRarity = jokers.filter(joker => rarity == joker.rarity);
      do {
        card = jokersOfRarity[Math.floor(Math.random() * jokersOfRarity.length)];
      } while (jokersOfRarity.length != 0 && jokerCount(gameState, "showman") > 0 && jokerNames.includes(card.name));
    } else if (cardType == "Planet Card") {
      do {
        const pokerHand = Object.keys(pokerHands)[Math.floor(Math.random() * Object.keys(pokerHands).length)];
        card = {name: pokerHands[pokerHand].planet, handType: pokerHand}
      } while (!pokerHands[card.handType].unlocked && gameState.handPlays[card.handType] < 1);
    } else {
      let remainingCards = cards[cardType];
      if (cardType != "Playing Cards") {
        const newCards = remainingCards.filter(card => !gameState.consumables.map(card => card.name).includes(card.name) || jokerCount(gameState, "showman") > 0);
        remainingCards = newCards.length < 1 ? remainingCards : newCards;
      }
      card = remainingCards[Math.floor(Math.random() * remainingCards.length)];
    }
  } while (gameState.bannedCards.includes(card.name));

  card = structuredClone(card); // Seperate card object from where it got it from

  if (cardType == "Spectral Card" || cardType == "Tarot Card" || cardType == "Planet Card") return card;
  if (cardType == "Playing Card") {
    const hasEdition = Math.random() <= gameState.shopWeights["Playing Card"].edition / 100;
    const hasEnhancement = Math.random() <= gameState.shopWeights["Playing Card"].enhancement / 100;
    const hasSeal = Math.random() <= 0.2;

    if (hasEdition && !certificate && !stone) {
      card.edition = pickByPercentage(gameState.editions, "playingCardOdds");
    }
    if (hasEnhancement && !certificate && !stone) {
      card.enhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
    }
    if (hasSeal || certificate && !stone) {
      card.seal = seals[Math.floor(Math.random() * seals.length)];
    }
    if (stone) {
      card.enhancement = "Stone Card";
    }
  }
  if (cardType == "Joker") {
    card.edition = pickByPercentage(gameState.editions);
  }
  return card;
}

function fillCards(gameState) {
  while (gameState.shop.cards.length < gameState.shopSlots) {
    const cardType = pickWeightedRandom(shopWeights);
    game.shop.cards.push(newCard(gameState, cardType));
  }
}

function rerollShop(gameState) {
  gameState.shop.cards = [];
  if (gameState.shop.filled) {
    gameState.money -= gameState.currentReroll;
    gameState.currentReroll++;
  }
  fillCards(gameState);
}

function pickByPercentage(input, value = 'odds') {
  const isArray = Array.isArray(input);
  const entries = isArray
    ? input.map((item, i) => [i, item])
    : Object.entries(input);

  const totalChance = entries.reduce((sum, [_, item]) => sum + item[value], 0);
  const random = Math.random() * 100;

  if (random >= totalChance) return null;

  let accumulated = 0;
  for (const [key, item] of entries) {
    accumulated += item[value];
    if (random < accumulated) {
      return isArray ? item : key;
    }
  }

  return null;
}

function pickWeightedRandom(input, value = "odds") {
  const isArray = Array.isArray(input);
  const entries = isArray
    ? input.map((item, i) => [i, item])
    : Object.entries(input);

  const totalWeight = entries.reduce((sum, [_, item]) => sum + item[value], 0);
  let random = Math.random() * totalWeight;

  for (const [key, item] of entries) {
    if (random < item[value]) {
      return isArray ? item : key;
    }
    random -= item[value];
  }

  return null;
}


function addVoucherToShop(gameState) {
  const newVouchers = gameState.possibleVouchers.filter(voucher => !gameState.shop.vouchers.includes(voucher));
  if (newVouchers.length < 1) return;
  gameState.shop.vouchers.push(newVouchers[Math.floor(Math.random() * newVouchers.length)]);
}

function newShop(gameState, newAnte) {
  gameState.shop.packs = [];

  // Reroll voucher if new ante
  if (newAnte) {
    gameState.shop.vouchers = [];
    addVoucherToShop();
  }

  // Reset to last voucher if had more than one
  if (gameState.shop.vouchers.length > 1) {
    gameState.shop.vouchers.length = 1;
  }

  // Add vouchers for voucher tags
  for (let i = gameState.tags.length - 1; i >= 0; i--) {
    if (gameState.tags[i].toLowerCase().replaceAll(" ", "") == "vouchertag") {
      gameState.tags.splice(i, 1);
      addVoucherToShop;
    }
  }

  // Fill booster packs
  const allowedPacks = boosterPacks.filter(pack => !gameState.bannedPacks.includes(pack.name));
  if (gameState.firstShop && !gameState.bannedPacks.includes("Buffoon Pack")) gameState.shop.packs[0] = {"name": "Buffoon Pack", "amount": 2, "choices": 1, "odds": 1.2};
  while (gameState.shop.packs.length < 2) {
    gameState.shop.packs.push(pickWeightedRandom(allowedPacks));
  }
  
  // Fill cards
  rerollShop(gameState);
  gameState.shop.filled = true;
}

function goNext(gameState) {
  if (gameState.state != "shop") return;
  gameState.state = "blindSelect";
}

function blindChoose(gameState, skip = false) {
  if (gameState.state != "blindSelect") return;
  const blindIdx = gameState.currentBlinds.filter(blind => blind.completed).length;
  if (skip && blindIdx != 2) {
    gameState.currentBlinds[blindIdx].completed = true;
    gameState.currentBlinds[blindIdx].skipped = true;
  } else {
    gameState.state = "blind";
    blindSetup(gameState);
  }
}

function fillHand(gameState) {
  for (let i = 0; i < gameState.handSize; i++) {
    drawCard(gameState);
  }
}

function blindSetup(gameState) {
  const blindIdx = gameState.currentBlinds.filter(blind => blind.completed).length;
  gameState.blind = structuredClone(blinds.filter(blind => blind.name == gameState.currentBlinds[blindIdx].name)[0]); // TODO: blindScore, reward
  gameState.blind.hands = gameState.defaultHands;
  gameState.blind.discards = gameState.defaultDiscards;
  gameState.blind.firstDiscard = true;
  gameState.blind.firstHand = true;
  gameState.blind.roundScore = 0n;
  gameState.blind.hand = [];
  gameState.blind.handPlays = 0;
  gameState.remainingCards = [...gameState.fullDeck];
  fillHand(gameState);
}

function handleJoker(gameState, joker, func, params) {
  let response;
  if (joker[func]) response = joker[func](gameState, ...params);
  return response;
}

function handleJokers(gameState, func, params = []) {
  let returnArray = [];
  let retriggers = 0;
  gameState.jokers.filter(joker => !joker.debuffed).forEach(joker => {
    let response = handleJoker(gameState, joker, func, params);
    if (response && response.length) returnArray.push(response);
    if (response.retriggers) retriggers += response.retriggers;
  })
  return {"responses": returnArray.filter(Boolean), retriggers };
}

const decimalAccuracy = 100000000;

function handleMult(gameState, chips, mult, responseArray) {
  responseArray.forEach(response => {
    if (response.plusChips && response.plusChips > 0) chips += BigInt(response.plusChips);
    if (response.plusMult && response.plusMult > 0) mult += BigInt(response.plusMult * decimalAccuracy);
    if (response.timesMult && response.timesMult > 1) mult = mult * BigInt(Math.round(response.timesMult * 100)) / 100n;
  })
  
  return {chips, mult};
}

function destroyJoker(gameState, jokerIdx) {
  const joker = gameState.jokers[jokerIdx];
  if (joker.onDestroy) joker.onDestroy(gameState);
  if (joker.edition.toLowerCase().replaceAll(" ", "") == "negative") gameState.jokerSlots--;
  gameState.jokers.splice(jokerIdx, 1);
}

function playHand(gameState, indexes) { // Pass the indexes starting at 0
  if (gameState.state != "blind" || !indexes.length || [...new Set(indexes)].length != indexes.length || Math.min(...indexes) < 0 || Math.max(...indexes) > gameState.hand.length-1) return;
  let cards = [];
  indexes.forEach(index => {
    cards.push(gameState.hand[index]);
    delete gameState.hand[index];
  })
  cards = cards.filter(Boolean);
  this.gameState.blind.cards = cards;

  const handType = getHandType(gameState, cards).handType;
  const pokerHand = pokerHands[handType]

  let chips = pokerHand.base.chips + pokerHand.addition.chips * BigInt(handLevels[handType]); // Base chips & mult
  let mult = (pokerHand.base.chips + pokerHand.addition.chips * BigInt(handLevels[handType])) * BigInt(decimalAccuracy); // Multiply all mult by decimalAccuracy, reset at the final calculation

  const handPlayedResponses = handleJokers(gameState, "onHandPlayed", cards).responses; // Hand played jokers
  ({ chips, mult } = handleMult(gameState, chips, mult, handPlayedResponses));

  cards.forEach((card, idx) => { // Loop through played cards
    if (card.debuffed) return;
    card.index = idx;
    let playedCardResponses = [];
    let retriggers = 0;
    let trigger = 0;
    while (trigger <= retriggers) {
      if (card.enhancement && enhancements[card.enhancement].onCardScored) { // Handle enhancement
        playedCardResponses.push(enhancements[card.enhancement].onCardScored(gameState, card));
      }
      if (card.seal && seals[card.seal].onCardScored) { // Handle seal
        playedCardResponses.push(seals[card.seal].onCardScored(gameState, card));
      }
      if (card.edition) { // Handle edition
        if (card.edition.toLowerCase().replaceAll(" ", "") == "foil") playedCardResponses.push({"plusChips": 50});
        if (card.edition.toLowerCase().replaceAll(" ", "") == "holographic") playedCardResponses.push({"plusMult": 10});
        if (card.edition.toLowerCase().replaceAll(" ", "") == "polychrome") playedCardResponses.push({"timesMult": 1.5});
      }
      const handledJokers = handleJokers(gameState, "onCardScored", card);
      retriggers = handledJokers.retriggers;
      playedCardResponses.push(...handledJokers.responses); // Handle jokers
      trigger++;
    }
    ({ chips, mult } = handleMult(gameState, chips, mult, playedCardResponses));
  })

  gameState.blind.hand.forEach((card, idx) => { // Loop through held cards
    if (card.debuffed) return;
    card.index = idx;
    let heldCardResponses = [];
    let retriggers = 0;
    let trigger = 0;
    while (trigger <= retriggers) {
      if (card.enhancement && enhancements[card.enhancement].onCardHeld) { // Handle enhancement
        heldCardResponses.push(enhancements[card.enhancement].onCardHeld(gameState, card));
      }
      if (card.seal && seals[card.seal].onCardHeld) { // Handle seal
        heldCardResponses.push(seals[card.seal].onCardHeld(gameState, card));
      }
      if (card.edition) { // Handle edition
        switch (card.edition.toLowerCase.replaceAll(" ", "")) {
          case "foil":
            returnArray.push({"plusChips": 50});
            break;
          case "holographic":
            returnArray.push({"plusMult": 10});
            break;
          case "polychrome":
            returnArray.push({"timesMult": 1.5});
            break;
          case "negative":
            break;
          default:
            throw new Error("Invalid edition")
        }
      }
      const handledJokers = handleJokers(gameState, "onCardHeld", card);
      retriggers = handledJokers.retriggers;
      heldCardResponses.push(...handledJokers.responses); // Handle jokers
      trigger++;
    }
    ({ chips, mult } = handleMult(gameState, chips, mult, heldCardResponses));
  })

  let jokerResponses = [];
  gameState.jokers.forEach((joker, idx) => { // Handle joker scoring
    joker.index = idx;
    if (joker.rarity.toLowerCase().replaceAll(" ", "") == "uncommon" && jokerCount(gameState, "baseballcard")) {
      for (let i = 0; i < jokerCount(gameState, "baseballcard"); i++) {
        jokerResponses.push({"timesMult": 1.5});
      }
    }
    if (joker.debuffed) return;
    if (joker.edition && joker.edition.toLowerCase.replaceAll(" ", "") == "foil") jokerResponses.push({"plusChips": 50});
    if (joker.edition && joker.edition.toLowerCase.replaceAll(" ", "") == "holographic") jokerResponses.push({"plusMult": 10});
    const handledJoker = handleJoker(gameState, joker, "onScore", cards);
    jokerResponses.push(handledJoker);
    if (joker.edition && joker.edition.toLowerCase.replaceAll(" ", "") == "polychrome") jokerResponses.push({"timesMult": 1.5});
    if (handledJoker.destroy) destroyJoker(gameState, idx); // TODO: make sure it doesnt happen with bp/bs
  })

  gameState.blind.roundScore += Math.floor(chips * mult / decimalAccuracy);
  gameState.blind.firstHand = false;
  if (gameState.blind.roundScore >= gameState.blind.blindScore) blindEnd(gameState);
}

function blindEnd(gameState) {
  gameState.jokers.forEach((joker, idx) => {
    const handledJoker = handleJoker(gameState, joker, "onScore", cards);
    if (handledJoker.destroy) destroyJoker(gameState, idx); // TODO: make sure it doesnt happen with bp/bs
  });
}

module.export = {
    newGame,
    rerollShop,
    goNext,
    blindChoose,
    playHand
}