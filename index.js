const suits = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
// const suits = ['Spades', 'Spades', 'Spades', 'Spades'];
const ranks = ['Ace', 'King', 'Queen', 'Jack', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

function objectClone(obj, seen = new Map()) {
  if (typeof obj !== 'object' || obj === null) return obj;

  if (seen.has(obj)) {
      return seen.get(obj);
  }

  const clone = Array.isArray(obj) ? [] : {};
  seen.set(obj, clone);

  for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'function') {
          clone[key] = value;
      } else {
          clone[key] = objectClone(value, seen);
      }
  }

  return clone;
}


const tags = [
  {
    "name": "Uncommon Tag", 
    "minAnte": 1,
    "desc": "Shop has a free Uncommon Joker"
  },
  {
    "name": "Rare Tag",
    "minAnte": 1,
    "desc": "Shop has a free Rare Joker"
  },
  {
    "name": "Negative Tag",  
    "minAnte": 2,
    "desc": "Next base edition shop Joker is free and becomes Negative"
  },
  {
    "name": "Foil Tag",  
    "minAnte": 1,
    "desc": "Next base edition shop Joker is free and becomes Foil"
  },
  {
    "name": "Holographic Tag",  
    "minAnte": 1,
    "desc": "Next base edition shop Joker is free and becomes Holographic"
  },
  {
    "name": "Polychrome Tag",  
    "minAnte": 1,
    "desc": "Next base edition shop Joker is free and becomes Polychrome"
  },
  {
    "name": "Investment Tag",  
    "minAnte": 1,
    "desc": "After defeating the Boss Blnd, gain $25"
  },
  {
    "name": "Voucher Tag",  
    "minAnte": 1,
    "desc": "Adds one Voucher to the next shop"
  },
  {
    "name": "Boss Tag",  
    "minAnte": 1,
    "desc": "Rerolls the Boss Blind",
    onBuy(gameState) {
      gameState.currentBlinds[2] = getBossBlind(gameState);
    }
  },
  {
    "name": "Standard Tag",  
    "minAnte": 2,
    "desc": "Gives a free Mega Standard Pack",
    onBuy(gameState) {
      buyPack(gameState, boosterPacks.find(pack => pack.name == "Mega Standard Pack"), true);
    }
  },
  {
    "name": "Charm Tag",  
    "minAnte": 1,
    "desc": "Gives a free Mega Arcana Pack",
    onBuy(gameState) {
      buyPack(gameState, boosterPacks.find(pack => pack.name == "Mega Arcana Pack"), true);
    }
  },
  {
    "name": "Meteor Tag",  
    "minAnte": 2,
    "desc": "Gives a free Mega Celestial Pack",
    onBuy(gameState) {
      buyPack(gameState, boosterPacks.find(pack => pack.name == "Mega Celestial Pack"), true);
    }
  },
  {
    "name": "Buffoon Tag",  
    "minAnte": 2,
    "desc": "Gives a free Mega Buffoon Pack",
    onBuy(gameState) {
      buyPack(gameState, boosterPacks.find(pack => pack.name == "Mega Buffoon Pack"), true);
    }
  },
  {
    "name": "Handy Tag",  
    "minAnte": 2,
    getDesc(gameState) {return `Gives $1 per played hand this run (Will give $${gameState.playedHands})`}
  }, 
  {
    "name": "Garbage Tag",  
    "minAnte": 2,
    getDesc(gameState) {return `Gives $1 per unused discard this run (Will give $${gameState.unusedDiscards})`}
  },
  {
    "name": "Ethereal Tag",  
    "minAnte": 2,
    "desc": "Gives a free Spectral Pack",
    onBuy(gameState) {
      buyPack(gameState, boosterPacks.find(pack => pack.name == "Spectral Pack"), true);
    }
  },
  {
    "name": "Coupon Tag",  
    "minAnte": 1,
    "desc": "Initial cards and booster packs in next shop are free"
  },
  {
    "name": "Double Tag",  
    "minAnte": 1,
    "desc": "Gives a copy of the next selected Tag Double Tag excluded"
  },
  {
    "name": "Juggle Tag",  
    "minAnte": 1,
    "desc": "+3 hand size next round"
  },
  {
    "name": "D6 Tag",  
    "minAnte": 1,
    "desc": "Rerolls in next shop start at $0"
  },
  {
    "name": "Top-Up Tag",  
    "minAnte": 2,
    "desc": "Create up to 2 Common Jokers (Must have room)",
    onBuy(gameState) {
      for (let i = 0; i < 2; i++) {
        if (gameState.jokers.length < gameState.jokerSlots) {
          addNewJoker(gameState, newCard(gameState, "Joker", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, true));
        }
      }
    }
  },
  {
    "name": "Speed Tag",  
    "minAnte": 1,
    getDesc(gameState) {return `Gives $5 per skipped blind this run (Will give $${gameState.skippedBlinds * 5})`},
    onBuy(gameState) {
      gameState.money += gameState.skippedBlinds * 5;
    }
  },
  {
    "name": "Orbital Tag",  
    "minAnte": 2,
    getDesc(gameState) {return `Upgrade ${this.properties.handType} by 3 levels`},
    onBuy(gameState) {
      gameState.handLevels[this.properties.handType] += 3;
    },
    "properties": {
      "handType": undefined
    }
  },
  {
    "name": "Economy Tag",  
    "minAnte": 1,
    "desc": "Doubles your money (Max of $40)",
    onBuy(gameState) {
      gameState.money += Math.max(Math.min(gameState.money, 40), 0);
    }
  }
]

const seals = {
  "Red Seal": {onCardScored(gameState, card) {return {"retriggers": 1}}},
  "Gold Seal": {onCardScored(gameState, card) {gameState.money += 4}},
  "Blue Seal": {onEndCards(gameState, card) {
    addConsumable(gameState, {name: pokerHands[gameState.lastHand].planet, handType: gameState.lastHand})
  }},
  "Purple Seal": {onCardDiscarded(gameState, card) {
    addConsumable(gameState, newCard(gameState, "Tarot Card"));
  }}
}

const voucherDescs = {
  "Overstock": "+1 card slot available in shop",
  "Overstock Plus": "+1 card slot available in shop",
  "Hone": "Foil, Holographic, and Polychrome cards appear 2x more often",
  "Glow Up": "Foil, Holographic, and Polychrome cards appear 4x more often",
  "Clearance Sale": "All cards and packs in shop are 25% off",
  "Liquidation": "All cards and packs in shop are 50% off",
  "Reroll Surplus": "Rerolls cost $2 less",
  "Reroll Glut": "Rerolls cost $2 less",
  "Crystal Ball": "+1 consumable slot",
  "Omen Globe": "Spectral cards may appear in any of the Arcana Packs",
  "Grabber": "Permanently gain +1 hand per round",
  "Nacho Tong": "Permanently gain +1 hand per round",
  "Telescope": "Celestial Packs always contain the Planet card for your most played poker hand",
  "Observatory": "Planet cards in your consumable area give X1.5 Mult for their specified poker hand",
  "Wasteful": "Permanently gain +1 discard each round",
  "Recyclomancy": "Permanently gain +1 discard each round",
  "Tarot Merchant": "Tarot cards appear 2X more frequently in the shop",
  "Tarot Tycoon": "Tarot cards appear 4X more frequently in the shop",
  "Seed Money": "Raise the cap on interest earned in each round to $10",
  "Money Tree": "Raise the cap on interest earned in each round to $20",
  "Planet Merchant": "Planet cards appear 2X more frequently in the shop",
  "Planet Tycoon": "Planet cards appear 4X more frequently in the shop",
  "Blank": "Does nothing?",
  "Antimatter": "+1 Joker Slot",
  "Magic Trick": "Playing cards can be purchased from the shop",
  "Illusion": "Playing cards in shop may have an Enhancement, Edition, and/or a Seal",
  "Director's Cut": "Reroll Boss Blind 1 time per Ante. $10 per roll",
  "Retcon": "Reroll Boss Blind unlimited times. $10 per roll",
  "Hieroglyph": "-1 Ante. -1 hand each round",
  "Petroglyph": "-1 Ante. -1 discard each round",
  "Paint Brush": "+1 hand size",
  "Palette": "+1 hand size"
}

const enhancements = {
  "Bonus Card": {onCardScored(gameState, card) {return {"plusChips": 30};}},
  "Mult Card": {onCardScored(gameState, card) {return {"plusMult": 4};}},
  "Wild Card": {},
  "Glass Card": {onCardScored(gameState, card) {return {"plusChips": 2, "destroy": random(gameState, 1, 4)};}},
  "Steel Card": {onCardHeld(gameState, card) {return {"timesMult": 1.5};}},
  "Stone Card": {onCardScored(gameState, card) {return {"plusChips": 50};}},
  "Gold Card": {onEndCards(gameState, card) {gameState.money += 3}},
  "Lucky Card": {onCardScored(gameState, card) {
    const money = random(gameState, 1, 15);
    const mult = random(gameState, 1, 5);
    if (money) gameState.money += 20;
    if (money || mult) handleJokers(gameState, "onLuckyTrigger");
    return {"plusMult": mult ? 20 : 0};
  }}
}

const packTypes = {
  "Arcana Pack": {"Tarot Card": {"odds": 0.8}, "Spectral Card": {"odds": 0}},
  "Celestial Pack": {"Planet Card": {"odds": 1}},
  "Standard Pack": {"Playing Card": {"odds": 1}},
  "Buffoon Pack": {"Joker": {"odds": 1}},
  "Spectral Pack": {"Spectral Card": {"odds": 1}},
}

const cards = {
  "Tarot Card": [
    {
      name: "The Fool",
      getDesc(gameState) {return `Creates the last Tarot or Planet card used during this run (The Fool excluded)\n(${this.getLastText(gameState)})`},
      onUse(gameState, cards) {
        if (!gameState.theFool || gameState.theFool.name == "The Fool") return {"error": "Invalid last card"};
        gameState.consumables.push(objectClone(gameState.theFool));
      },
      getLastText(gameState) {
        if (!gameState.theFool || gameState.theFool.name == "The Fool") return "None";
        return gameState.theFool.name;
      }
    },
    {
      name: "The Magician",
      desc: "Enhances 2 selected cards to Lucky Cards",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        if (cards.length < 1 || cards.length > 2) return {"error": "Select 1-2 cards", "cardMax": 2};
        for (const card of cards) {
          card.enhancement = "Lucky Card";
        }
      }
    },
    {
      name: "The High Priestess",
      desc: "Creates up to 2 random Planet cards (Must have room)",
      onUse(gameState, cards) {
        for (let i = 0; i < 2; i++) {
          if (gameState.consumables.length < gameState.consumableSlots) {
            gameState.consumables.push(newCard(gameState, "Planet Card"));
          }
        }
      }
    },
    {
      name: "The Empress",
      desc: "Enhances 2 selected cards to Mult Cards",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        if (cards.length < 1 || cards.length > 2) return {"error": "Select 1-2 cards", "cardMax": 2};
        for (const card of cards) {
          card.enhancement = "Mult Card";
        }
      }
    },
    {
      name: "The Emperor",
      desc: "Creates up to 2 random Tarot cards (Must have room)",
      onUse(gameState, cards) {
        for (let i = 0; i < 2; i++) {
          if (gameState.consumables.length < gameState.consumableSlots) {
            gameState.consumables.push(newCard(gameState, "Tarot Card"));
          }
        }
      }
    },
    {
      name: "The Hierophant",
      desc: "Enhances 2 selected cards to Bonus Cards",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        if (cards.length < 1 || cards.length > 2) return {"error": "Select 1-2 cards", "cardMax": 2};
        for (const card of cards) {
          card.enhancement = "Bonus Card";
        }
      }
    },
    {
      name: "The Lovers",
      desc: "Enhances 1 selected card into a Wild Card",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        if (cards.length != 1) return {"error": "Select 1 card", "cardMax": 1};
        cards[0].enhancement = "Wild Card";
        console.log(cards[0]);
        console.log(gameState.cardArea);
      }
    },
    {
      name: "The Chariot",
      desc: "Enhances 1 selected card into a Steel Card",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        if (cards.length != 1) return {"error": "Select 1 card", "cardMax": 1};
        cards[0].enhancement = "Steel Card";
      }
    },
    {
      name: "Justice",
      desc: "Enhances 1 selected card into a Glass Card",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        if (cards.length != 1) return {"error": "Select 1 card", "cardMax": 1};
        cards[0].enhancement = "Glass Card";
      }
    },
    {
      name: "The Hermit",
      desc: "Doubles money (Max of $20)",
      onUse(gameState, cards) {
        gameState.money += Math.max(Math.min(gameState.money, 20), 0);
      }
    },
    {
      name: "The Wheel of Fortune",
      desc: "1 in 4 chance to add Foil, Holographic, or Polychrome edition to a random Joker",
      onUse(gameState, cards) {
        const possibleJokers = gameState.jokers.filter(joker => !joker.edition);
        if (!possibleJokers?.length) return {"error": "No valid jokers"};
        if (!random(gameState, 1, 4)) return; // Nope!
        const targetJoker = possibleJokers[Math.floor(Math.random() * possibleJokers.length)];
        let tempEditions = objectClone(gameState.editions);
        delete tempEditions.negative;
        targetJoker.edition = pickWeightedRandom(tempEditions);
      }
    },
    {
      name: "Strength",
      desc: "Increases rank of up to 2 selected cards by 1",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        if (cards.length < 1 || cards.length > 2) return {"error": "Select 1-2 cards", "cardMax": 2};
        for (const card of cards) {
          let newIdx = ranks.indexOf(card.rank)-1;
          if (newIdx < 0) newIdx = ranks.length-1;
          card.rank = ranks[newIdx];
        }
      }
    },
    {
      name: "The Hanged Man",
      desc: "Destroys up to 2 selected cards",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        if (cards.length < 1 || cards.length > 2) return {"error": "Select 1-2 cards", "cardMax": 2};
        for (const card of cards) {
          deleteCard(gameState, card);
        }
      }
    },
    {
      name: "Death",
      desc: "Select 2 cards, convert the left card into the right card (Drag to rearrange)",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        if (cards.length != 2) return {"error": "Select 2 cards", "cardMax": 2};
        for (const key in cards[0]) delete cards[0][key];
        Object.assign(cards[0], objectClone(cards[1]));
      }
    },
    {
      name: "Temperance",
      getDesc(gameState){return `Gives the total sell value of all current Jokers (Max of $50)\n(Currently ${this.calcMoney(gameState)})`},
      onUse(gameState, cards) {
        gameState.money += this.calcMoney(gameState);
      },
      calcMoney(gameState) {
        let total = 0;
        gameState.jokers.map(joker => roundHalfDown(calcCost(gameState, joker)/2) + +(joker.addedSellValue || 0)).forEach(cost => total += cost);
        return Math.max(Math.min(total, 50), 0);
      }
    },
    {
      name: "The Devil",
      desc: "Enhances 1 selected card into a Gold Card",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        if (cards.length != 1) return {"error": "Select 1 card", "cardMax": 1};
        cards[0].enhancement = "Gold Card";
      }
    },
    {
      name: "The Tower",
      desc: "Enhances 1 selected card into a Stone Card",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        if (cards.length != 1) return {"error": "Select 1 card", "cardMax": 1};
        cards[0].enhancement = "Stone Card";
      }
    },
    {
      name: "The Star",
      desc: "Converts up to 3 selected cards to Diamonds",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        if (cards.length < 1 || cards.length > 3) return {"error": "Select 1-3 cards", "cardMax": 3};
        for (const card of cards) {
          card.suit = "Diamonds";
        }
      }
    },
    {
      name: "The Moon",
      desc: "Converts up to 3 selected cards to Clubs",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        if (cards.length < 1 || cards.length > 3) return {"error": "Select 1-3 cards", "cardMax": 3};
        for (const card of cards) {
          card.suit = "Clubs";
        }
      }
    },
    {
      name: "The Sun",
      desc: "Converts up to 3 selected cards to Hearts",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        if (cards.length < 1 || cards.length > 3) return {"error": "Select 1-3 cards", "cardMax": 3};
        for (const card of cards) {
          card.suit = "Hearts";
        }
      }
    },
    {
      name: "Judgement",
      desc: "Creates a random Joker card (Must have room)",
      onUse(gameState, cards) {
        if (gameState.jokers.length >= gameState.jokerSlots) return {"error": "No empty joker slots"};
        addNewJoker(gameState, newCard(gameState, "Joker", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, true));
      }
    },
    {
      name: "The World",
      desc: "Converts up to 3 selected cards to Spades",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        if (cards.length < 1 || cards.length > 3) return {"error": "Select 1-3 cards", "cardMax": 3};
        for (const card of cards) {
          card.suit = "Spades";
        }
      }
    }
  ],
  "Spectral Card": [
    {
      name: "Familiar",
      desc: "Destroy 1 random card in your hand, but add 3 random Enhanced face cards to your hand",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        deleteCard(gameState, gameState.cardArea[Math.floor(Math.random() * gameState.cardArea.length)]);
        for (let i = 0; i < 3; i++) {
          drawCard(gameState, newCard(gameState, "Playing Card", false, false, undefined, true, true, "Face"));
        }
      }
    },
    {
      name: "Grim",
      desc: "Destroy 1 random card in your hand, but add 2 random Enhanced Aces to your hand",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        deleteCard(gameState, gameState.cardArea[Math.floor(Math.random() * gameState.cardArea.length)]);
        for (let i = 0; i < 2; i++) {
          drawCard(gameState, newCard(gameState, "Playing Card", false, false, undefined, true, true, "Ace"));
        }
      }
    },
    {
      name: "Incantation",
      desc: "Destroy 1 random card in your hand, but add 4 random Enhanced numbered cards to your hand",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        deleteCard(gameState, gameState.cardArea[Math.floor(Math.random() * gameState.cardArea.length)]);
        for (let i = 0; i < 4; i++) {
          drawCard(gameState, newCard(gameState, "Playing Card", false, false, undefined, true, true, "Number"));
        }
      }
    },
    {
      name: "Talisman",
      desc: "Add a Gold Seal to 1 selected card in your hand",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        if (cards.length != 1) return {"error": "Select exactly one card", "cardMax": 1};
        cards[0].seal = "Gold Seal";
      }
    },
    {
      name: "Aura",
      desc: "Add Foil, Holographic, or Polychrome effect to 1 selected card in hand",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        if (cards.length != 1) return {"error": "Select exactly one card", "cardMax": 1};
        let tempEditions = objectClone(gameState.editions);
        delete tempEditions.negative;
        cards[0].edition = pickWeightedRandom(tempEditions);
      }
    },
    {
      name: "Wraith",
      desc: "Creates a random Rare Joker (must have room), sets money to $0",
      onUse(gameState, cards) {
        if (gameState.jokers.length >= gameState.jokerSlots) return {"error": "No empty joker slots"};
        gameState.money = 0;
        addNewJoker(gameState, newCard(gameState, "Joker", false, false, "Rare", undefined, undefined, undefined, undefined, undefined, undefined, true));
      }
    },
    {
      name: "Sigil",
      desc: "Converts all cards in hand to a single random suit",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        const suit = suits[Math.floor(Math.random() * suits.length)];
        gameState.cardArea.forEach(card => card.suit = suit);
      }
    },
    {
      name: "Ouija",
      desc: "Converts all cards in hand to a single random rank\n-1 hand size",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        const rank = ranks[Math.floor(Math.random() * ranks.length)];
        gameState.cardArea.forEach(card => card.rank = rank);
        gameState.handSize--;
      }
    },
    {
      name: "Ectoplasm",
      getDesc(gameState) { return `Add Negative to a random Joker.\n-${this.properties.handSize} hand size` },
      "properties": {
        "handSize": 1
      },
      onUse(gameState, cards) {
        const possibleJokers = gameState.jokers.filter(joker => !joker.edition);
        if (possibleJokers.length < 1) return {"error": "No valid Jokers"};
        possibleJokers[Math.floor(Math.random() * possibleJokers.length)].edition = "Negative";
        gameState.jokerSlots++;
        gameState.handSize -= this.properties.handSize;
        this.properties.handSize += this.properties.handSize + 1;
      }
    },
    {
      name: "Immolate",
      desc: "Destroys 5 random cards in hand, gain $20",
      onUse(gameState, cards) {
        const cardArea = gameState.cardArea;
        if (!cardArea?.length) return {"error": "No cards"};
        for (let i = 0; i < 5; i++) {
          deleteCard(gameState, cardArea[Math.floor(Math.random() * cardArea.length)]);
          if (cardArea.length < 1) break;
        }
        gameState.money += 20;
      }
    },
    {
      name: "Ankh",
      desc: "Create a copy of a random Joker, destroy all other Jokers",
      onUse(gameState, cards) {
        if (!gameState.jokers.length) return {"error": "No Jokers"};
        const targetJoker = gameState.jokers[Math.floor(Math.random() * gameState.jokers.length)];
        gameState.jokers.forEach(joker => {if (joker != targetJoker) destroyJoker(gameState, joker)});
        const jokerClone = objectClone(targetJoker);
        if (jokerClone.edition.toLowerCase().replaceAll(" ", "") == "negative") delete jokerClone.edition;
        addNewJoker(gameState, jokerClone);
      }
    },
    {
      name: "Deja Vu",
      desc: "Add a Red Seal to 1 selected card in your hand",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        if (cards.length != 1) return {"error": "Select exactly one card", "cardMax": 1};
        cards[0].seal = "Red Seal";
      }
    },
    {
      name: "Hex",
      desc: "Add Polychrome to a random Joker, and destroy all other Jokers",
      onUse(gameState, cards) {
        const possibleJokers = gameState.jokers.filter(joker => !joker.edition);
        if (!possibleJokers?.length) return {"error": "No valid jokers"};
        const targetJoker = possibleJokers[Math.floor(Math.random() * possibleJokers.length)];
        targetJoker.edition = "Polychrome";
        gameState.jokers.forEach(joker => {if (joker != targetJoker) destroyJoker(gameState, joker)})
      }
    },
    {
      name: "Trance",
      desc: "Add a Blue Seal to 1 selected card in your hand",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        if (cards.length != 1) return {"error": "Select exactly one card", "cardMax": 1};
        cards[0].seal = "Blue Seal";
      }
    },
    {
      name: "Medium",
      desc: "Add a Purple Seal to 1 selected card card in your hand",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        if (cards.length != 1) return {"error": "Select exactly one card", "cardMax": 1};
        cards[0].seal = "Purple Seal";
      }
    },
    {
      name: "Cryptid",
      desc: "Create 2 copies of 1 selected card in your hand",
      onUse(gameState, cards) {
        if (!gameState.cardArea?.length) return {"error": "No cards"};
        if (cards.length != 1) return {"error": "Select exactly one card", "cardMax": 1};
        drawCard(gameState, cards[0]);
        drawCard(gameState, cards[0]);
      }
    },
    {
      name: "The Soul",
      desc: "Creates a Legendary Joker (Must have room)",
      onUse(gameState, cards) {
        if (gameState.jokers.length >= gameState.jokerSlots) return {"error": "No joker slots"};
        addNewJoker(gameState, newCard(gameState, "Joker", false, false, "Legendary"));
      }
    },
    {
      name: "Black Hole",
      desc: "Upgrade every poker hand by 1 level",
      onUse(gameState, card) {
        Object.keys(gameState.handLevels).forEach(hand => gameState.handLevels[hand]++);
      }
    }
  ]
}

function deleteCard(gameState, card) {
  gameState.cardArea?.forEach((loopCard, idx) => {
    if (loopCard == card) gameState.cardArea.splice(idx, 1);
  })
  gameState.fullDeck.forEach((loopCard, idx) => {
    if (loopCard == card) gameState.fullDeck.splice(idx, 1);
  })
  gameState.blind?.remainingCards.forEach((loopCard, idx) => {
    if (loopCard == card) gameState.blind.remainingCards.splice(idx, 1);
  })
}

cards["Playing Card"] = suits.flatMap(suit =>
  ranks.map(rank => {
      let chips = 0;
      if (rank === 'Ace') chips = 11n;
      else if (['Jack', 'Queen', 'King'].includes(rank)) chips = 10n;
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
      mult: 12n,
      chips: 120n
    },
    addition: {
      mult: 3n,
      chips: 35n
    },
    planet: "Planet X",
    unlocked: false
  },
  "Flush House": {
    base: {
      mult: 14n,
      chips: 140n
    },
    addition: {
      mult: 4n,
      chips: 40n
    },
    planet: "Ceres",
    unlocked: false
  },
  "Flush Five": {
    base: {
      mult: 16n,
      chips: 160n
    },
    addition: {
      mult: 3n,
      chips: 50n
    },
    planet: "Eris",
    unlocked: false
  }
};



const boosterPacks = [
  {"name": "Arcana Pack", "amount": 3, "choices": 1, "odds": 4, "cost": 4, "types": 4},
  {"name": "Jumbo Arcana Pack", "amount": 5, "choices": 1, "odds": 2, "cost": 6, "types": 2},
  {"name": "Mega Arcana Pack", "amount": 5, "choices": 2, "odds": 0.5, "cost": 8, "types": 2},
  
  {"name": "Celestial Pack", "amount": 3, "choices": 1, "odds": 4, "cost": 4, "types": 4},
  {"name": "Jumbo Celestial Pack", "amount": 5, "choices": 1, "odds": 2, "cost": 6, "types": 2},
  {"name": "Mega Celestial Pack", "amount": 5, "choices": 2, "odds": 0.5, "cost": 8, "types": 2},
  
  {"name": "Standard Pack", "amount": 3, "choices": 1, "odds": 4, "cost": 4, "types": 4},
  {"name": "Jumbo Standard Pack", "amount": 5, "choices": 1, "odds": 2, "cost": 6, "types": 2},
  {"name": "Mega Standard Pack", "amount": 5, "choices": 2, "odds": 0.5, "cost": 8, "types": 2},

  {"name": "Buffoon Pack", "amount": 2, "choices": 1, "odds": 1.2, "cost": 4, "types": 2},
  {"name": "Jumbo Buffoon Pack", "amount": 4, "choices": 1, "odds": 0.6, "cost": 4, "cost": 6, "types": 1},
  {"name": "Mega Buffoon Pack", "amount": 4, "choices": 2, "odds": 0.15, "cost": 8, "types": 1},

  {"name": "Spectral Pack", "amount": 2, "choices": 1, "odds": 0.6, "cost": 4, "types": 2},
  {"name": "Jumbo Spectral Pack", "amount": 4, "choices": 1, "odds": 0.3, "cost": 6, "types": 1},
  {"name": "Mega Spectral Pack", "amount": 4, "choices": 2, "odds": 0.07, "cost": 8, "types": 1}
];

function jokerCount(gameState, jokerName) {
  return gameState.jokers.filter(joker => !joker.debuffed && joker.name.toLowerCase().replaceAll(" ", "") == jokerName).length;
}

function random(gameState, odds, outOf) {
  return Math.floor(Math.random() * odds) + 1 <= outOf * Math.pow(2, jokerCount(gameState, "Oops! All 6s"));
}

function isSuit(gameState, card, suit) {
  if (card.edition?.toLowerCase().replaceAll(" ", "") == "stonecard") return false;
  if (card.edition?.toLowerCase().replaceAll(" ", "") == "wildcard" && !card.debuffed) return true;
  const redHands = ["hearts", "diamonds"];
  const blackHands = ["spades", "clubs"];
  if (jokerCount(gameState, "smearedjoker") && ((redHands.contains(card.suit.toLowerCase()) && redHands.contains(suit.toLowerCase())) || (blackHands.contains(card.suit.toLowerCase()) && blackHands.contains(suit.toLowerCase())))) return true;
  return card.suit.toLowerCase() == suit.toLowerCase();
}

function isFaceCard(gameState, card) {
  if (card.edition?.toLowerCase().replaceAll(" ", "") == "stonecard") return false;
  if (jokerCount(gameState, "pareidolia") > 0) {
    return true;
  }
  return isRank(gameState, card, "King") || isRank(gameState, card, "Queen") || isRank(gameState, card, "Jack"); 
}

function isRank(gameState, card, rank) {
  if (card.edition?.toLowerCase().replaceAll(" ", "") == "stonecard") return false;
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
      if (tempReturnCards.length >= (hasFourFingers ? 4 : 5)) {
        if (returnCards.length <= tempReturnCards.length) {
          returnCards = tempReturnCards;
        }
      }
    });
    if (returnCards.length >= (hasFourFingers ? 4 : 5)) return returnCards;
  }
  if (handType == "twopair") {
    let pairs = 0;
    let returnCards = [];
    ranks.forEach(rank => {if (cards.filter(card => isRank(gameState, card, rank)).length >= 2) {
      pairs++;
      returnCards.push(cards.filter(card => isRank(gameState, card, rank)));
    }});
    if (pairs >= 2) return returnCards;
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
  if (handType == "highcard") return [cards.filter(card => !card.enhancement?.toLowerCase().replaceAll(" ", "") == "stonecard").map(card => rankToValue(card.rank)).sort((a,b) => a-b)[0] || cards[0]];
  if (handType == "straightflush") {
    if (cardsContain(gameState, cards, "Straight") && cardsContain(gameState, cards, "Flush"))
    return cards;
  }
  if (handType == "flushhouse") {
    if (cardsContain(gameState, cards, "Full House") && cardsContain(gameState, cards, "Flush"))
    return cards;
  }
  if (handType == "flushfive") {
    if (cardsContain(gameState, cards, "Five of a Kind") && cardsContain(gameState, cards, "Flush"))
    return cards;
  }
  return false;
}

function getHandType(gameState, cards) { // TODO: go through all uses and check if should include debuffed cards
  const sort = Object.keys(pokerHands)
    .toSorted((a, b) => {
      const aValue = pokerHands[a].base.mult + pokerHands[a].base.chips;
      const bValue = pokerHands[b].base.mult + pokerHands[b].base.chips;
      
      if (aValue < bValue) return 1;
      if (aValue > bValue) return -1;
      return 0;
    });
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
      if (gameState.cardArea)
        gameState.cardArea.push(card);
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

const jokers = [
  {
    "name": "8 Ball",
    getDesc(gameState) { return "1 in 4 chance for each played 8 to create a Tarot card when scored\n(Must have room)" },
    "rarity": "Common",
    onCardScored(gameState, card) {
      if (isRank(gameState, card, "8")) {
        if (random(gameState, 1, 4)) {
          addConsumable(gameState, newCard(gameState, "Tarot Card"));
        }
      }
    },
    "cost": 5,
  },
  {
    "name": "Abstract Joker",
    getDesc(gameState) { return "+3 Mult for each Joker card" },
    "rarity": "Common",
    onScore(gameState, cards) {
      return {"plusMult": gameState.jokers.length * 3};
    },
    "cost": 4,
  },
  {
    "name": "Acrobat",
    "rarity": "Uncommon",
    getDesc(gameState) {return "X3 Mult on final hand of round"},
    onScore(gameState, cards) {
      if (gameState.blind.hands < 1) {
        return {"timesMult": 3};
      }
    },
    "cost": 6,
  },
  {
    "name": "Ancient Joker",
    "rarity": "Rare",
    getDesc(gameState) {return `Each played card with ${gameState.jokerProperties.ancient.suit} gives X1.5 Mult when scored, suit changes at end of round`},
    onCardScored(gameState, card) {
      if (isSuit(gameState, card, gameState.jokerProperties.ancient.suit)) {
        return {"timesMult": 1.5};
      }
    },
    "cost": 8,
  },
  {
    "name": "Arrowhead",
    "rarity": "Uncommon",
    getDesc(gameState) { return "Played cards with Spade suit give +50 Chips when scored" },
    onCardScored(gameState, card) {
      if (isSuit(gameState, card, "Spades")) {
        return {"plusChips": 50};
      }
    },
    "cost": 7,
  },
  {
    "name": "Astronomer",
    "rarity": "Uncommon",
    getDesc(gameState) { return "All Planet cards and Celestial Packs in the shop are free" },
    "cost": 8,
    "noCopy": true,
  },
  {
    "name": "Banner",
    getDesc(gameState) { return "+30 Chips for each remaining discard" },
    "rarity": "Common",
    onScore(gameState, cards) {
      return {"plusChips": 30 * gameState.blind.discards};
    },
    "cost": 5,
  },
  {
    "name": "Baron",
    "rarity": "Rare",
    getDesc(gameState) { return "Each King held in hand gives X1.5 Mult" },
    onHeld(gameState, card) {
      if (isRank(gameState, card, "King")) {
        return {"timesMult": 1.5};
      }
    },
    "cost": 8,
  },
  {
    "name": "Baseball Card",
    "rarity": "Rare",
    getDesc(gameState) { return "Uncommon Jokers each give X1.5 Mult" },
    "cost": 8,
  },
  {
    "name": "Blackboard",
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
    "cost": 6,
  },
  {
    "name": "Bloodstone",
    "rarity": "Uncommon",
    getDesc(gameState) { return "1 in 2 chance for played cards with the Heart suit to give X1.5 Mult when scored" },
    onCardScored(gameState, card) {
      if (isSuit(gameState, card, "Hearts")) {
        if (random(gameState, 1, 2)) {
          return {"timesMult": 1.5};
        }
      }
    },
    "cost": 7,
  },
  {
    "name": "Blue Joker",
    getDesc(gameState) { return `+2 Chips for each remaining card in deck\n(Currently +${2*(gameState.blind?.remainingCards.length || gameState.fullDeck.length)})` },
    "rarity": "Common",
    onScore(gameState, cards) {return {"plusChips": 2 * (gameState.blind?.remainingCards.length || gameState.fullDeck.length)}},
    "cost": 5,
  },
  {
    "name": "Blueprint",
    "rarity": "Rare",
    getDesc(gameState) { return "Copies ability of Joker to the right" },
    "cost": 10,
  },
  {
    "name": "Bootstraps",
    "rarity": "Uncommon",
    getDesc(gameState) { return "+2 Mult for every $5 you have" },
    onScore(gameState, cards) {return {"plusMult": 2*Math.floor(gameState.money/5)}},
    "cost": 7,
  },
  {
    "name": "Brainstorm",
    "rarity": "Rare",
    getDesc(gameState) { return "Copies the ability of leftmost Joker" },
    "cost": 10,
  },
  {
    "name": "Bull",
    "rarity": "Uncommon",
    getDesc(gameState) { return "+2 Chips for each $1 you have" },
    onScore(gameState, cards) {return {"plusChips": 2*gameState.money}},
    "cost": 6,
  },
  {
    "name": "Burglar",
    "rarity": "Uncommon",
    getDesc(gameState) { return "When Blind is selected, gain +3 Hands and lose all discards" },
    onBlindStart(gameState) {
      gameState.blind.discards = 0;
      gameState.blind.hands += 3;
    },
    "cost": 6,
  },
  {
    "name": "Burnt Joker",
    "rarity": "Rare",
    getDesc(gameState) { return "Upgrade the level of the first discarded poker hand each round" },
    onDiscard(gameState, cards) {
      if (gameState.blind.firstDiscard) {
        gameState.handLevels[getHandType(gameState, cards).handType]++;
      }
    },
    "cost": 8,
  },
  {
    "name": "Business Card",
    getDesc(gameState) { return "Played face cards have a 1 in 2 chance to give $2 when scored" },
    "rarity": "Common",
    onCardScored(gameState, card) {
      if (isFaceCard(gameState, card)) {
        if (random(gameState, 1, 2)) {
          gameState.money += 2;
        }
      }
    },
    "cost": 4,
  },
  {
    "name": "Canio",
    "rarity": "Legendary",
    getDesc(gameState) { return `This Joker gains X1 Mult when a face card is destroyed\n(Currently X${this.properties.timesMult})` },
    "properties": {"timesMult":1},
    onScore(gameState, cards) {return {"timesMult": this.properties.timesMult}},
    onCardsDestroyed(gameState, cards) {
      cards.forEach(card => {
        if (isFaceCard(card)) timesMult++;
      })
    },
    "cost": 20,
  },
  {
    "name": "Campfire",
    "rarity": "Rare",
    getDesc(gameState) { return `This Joker gains X0.25 Mult for each card sold, resets when Boss Blind is defeated\n(Currently X${this.properties.timesMult})` },
    "properties": {"timesMult":1},
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
    "cost": 9,
  },
  {
    "name": "Card Sharp",
    "rarity": "Uncommon",
    getDesc(gameState) { return " X3 Mult if played poker hand has already been played this round" },
    onScore(gameState, cards) {
      if (gameState.blind.handPlays.includes(getHandType(gameState, cards).handType)) {
        return {"timesMult": 3};
      }
    },
    "cost": 6,
  },
  {
    "name": "Cartomancer",
    "rarity": "Uncommon",
    getDesc(gameState) { return "Create a Tarot card when Blind is selected (Must have room)" },
    onBlindStart(gameState) {addConsumable(gameState, newCard(gameState, "Tarot"))},
    "cost": 6,
  },
  {
    "name": "Castle",
    getDesc(gameState) { return `This Joker gains +3 Chips per discarded ${gameState.jokerProperties.castle.suit} card, suit changes every round\n(Currently +${this.properties.plusChips})` },
    "rarity": "Common",
    "properties": {"plusChips":0},
    onCardScored(gameState, card) {return {"plusChips": plusChips};},
    onDiscard(gameState, cards) {
      cards.forEach(card => {
        if (isSuit(gameState, card, gameState.jokerProperties.castle.suit)) {
          this.properties.plusChips += 3;
        }
      });
    },
    "cost": 6,
    "noPerishable": true,
  },
  {
    "name": "Cavendish",
    getDesc(gameState) { return "X3 Mult, 1 in 1000 chance this card is destroyed at end of round" },
    "rarity": "Common",
    onScore(gameState, cards) {return {"timesMult": 3}},
    onRoundEnd(gameState) {
      if (random(gameState, 1, 1000)) return {"destroy": true};
    },
    "cost": 4,
    "noEternal": true,
  },
  {
    "name": "Ceremonial Dagger",
    "rarity": "Uncommon",
    getDesc(gameState) { return `When Blind is selected, destroy Joker to the right and permanently add double its sell value to this Mult\n(Currently +${this.properties.plusMult})` },
    "properties": {"plusMult":0},
    onScore(gameState, cards) {return {"plusMult": this.properties.plusMult}},
    onBlindStart(gameState) {
      let index;
      gameState.jokers.forEach((joker, idx) => {if (joker == this) index = idx});
      if (gameState.jokers[index + 1] && !gameState.jokers[index + 1].stickers?.includes("Eternal")) {
        const card = gameState.jokers[index + 1];
        this.properties.plusMult += Math.max(1, roundHalfDown(calcCost(gameState, card)/2)+(card.addedSellValue || 0)) * 2;
        destroyJoker(gameState, card);
      }
    },
    "cost": 6,
    "noPerishable": true,
  },
  {
    "name": "Certificate",
    "rarity": "Uncommon",
    getDesc(gameState) { return "When round begins, add a random playing card with a random seal to your hand" },
    onBlindStart(gameState) {
      drawCard(gameState, newCard(gameState, "Playing Card", true));
    },
    "cost": 6,
  },
  {
    "name": "Chaos the Clown",
    getDesc(gameState) { return "1 free Reroll per shop" },
    "rarity": "Common",
    "cost": 4,
    "noCopy": true,
    "properties": {
      "beenUsed": false
    },
    onBlindStart(gameState) {
      this.properties.beenUsed = false;
    },
    onBuy(gameState) {
      if (!gameState.shop.chaosUsed) {
        gameState.rerollCost = 0;
        gameState.shop.chaosUsed = true;
      }
    },
    onSell(gameState) {
      if (gameState.jokers.filter(joker => joker != this && joker.name == "Chaos the Clown" && !joker.properties.beenUsed) < 1) {
        gameState.rerollCost = gameState.currentReroll;
        gameState.shop.chaosUsed = false;
      }
    }
  },
  {
    "name": "Chicot",
    "rarity": "Legendary",
    getDesc(gameState) { return "Disables effect of every Boss Blind" },
    "cost": 20,
    "noCopy": true,
  },
  {
    "name": "Clever Joker",
    getDesc(gameState) { return "+80 Chips if played hand contains a Two Pair" },
    "rarity": "Common",
    onScore(gameState, cards) {
      if (cardsContain(gameState, getHandType(gameState, cards).cards, "Two Pair")) return {"plusChips": 80};
    },
    "cost": 4,
  },
  {
    "name": "Cloud 9",
    "rarity": "Uncommon",
    getDesc(gameState) { return `Earn $1 for each 9 in your full deck at end of round\n(Currently $${gameState.fullDeck.filter(card => isRank(gameState, card, 9)).length})` },
    onRoundEnd(gameState) {
      return {"money": 
        gameState.fullDeck.filter(card => isRank(gameState, card, 9)).length
      };
    },
    "cost": 7,
    "noCopy": true,
  },
  {
    "name": "Constellation",
    "rarity": "Uncommon",
    getDesc(gameState) { return `This Joker gains X0.1 Mult every time a Planet card is used\n(Currently X${this.properties.timesMult})` },
    "properties": {"timesMult":1},
    onPlanetCardUsed(gameState) {this.properties.timesMult += 0.1},
    onScore(gameState, card) {return {"timesMult": this.properties.timesMult};},
    "cost": 6,
    "noPerishable": true,
  },
  {
    "name": "Crafty Joker",
    getDesc(gameState) { return "+80 Chips if played hand contains a Flush" },
    "rarity": "Common",
    onScore(gameState, cards) {
      if (cardsContain(gameState, getHandType(gameState, cards).cards, "Flush")) return {"plusChips": 80};
    },
    "cost": 4,
  },
  {
    "name": "Crazy Joker",
    getDesc(gameState) { return "+12 Mult if played hand contains a Straight" },
    "rarity": "Common",
    onScore(gameState, cards) {
      if (cardsContain(gameState, getHandType(gameState, cards).cards, "Straight")) return {"plusMult": 12};
    },
    "cost": 4,
  },
  {
    "name": "Credit Card",
    getDesc(gameState) { return "Go up to -$20 in debt" },
    "rarity": "Common",
    "cost": 1,
    "noCopy": true,
    onBuy(gameState) {
      gameState.moneyLimit -= 20;
    },
    onDestroy(gameState) {
      gameState.moneyLimit += 20;
    }
  },
  {
    "name": "Delayed Gratification",
    getDesc(gameState) { return "Earn $2 per discard if no discards are used by end of the round" },
    "rarity": "Common",
    onRoundEnd(gameState) {
      if (gameState.blind.firstDiscard) return {"money": gameState.blind.discards * 2};
    },
    "cost": 4,
    "noCopy": true,
  },
  {
    "name": "Devious Joker",
    getDesc(gameState) { return "+100 Chips if played hand contains a Straight" },
    "rarity": "Common",
    onScore(gameState, cards) {
      if (cardsContain(gameState, getHandType(gameState, cards).cards, "Straight")) return {"plusChips": 100};
    },
    "cost": 4,
  },
  {
    "name": "Diet Cola",
    "rarity": "Uncommon",
    getDesc(gameState) { return "Sell this card to create a free Double Tag" },
    onSell(gameState) {
      if (!gameState.bannedTags.includes("Double Tag")) {
        const tag = tags.find(loopTag => loopTag.name == "Double Tag");
        gameState.tags.push(objectClone(tag));
      }
    },
    "cost": 6,
    "noEternal": true,
  },
  {
    "name": "DNA",
    "rarity": "Rare",
    getDesc(gameState) { return "If first hand of round has only 1 card, add a permanent copy to deck and draw it to hand" },
    onHandPlayed(gameState, cards) {
      if (cards.length == 1 && gameState.blind.firstHand) {
        drawCard(gameState, objectClone(cards[0]));
      }
    },
    "cost": 8,
  },
  {
    "name": "Driver's License",
    "rarity": "Rare",
    getDesc(gameState) { return `X3 Mult if you have at least 16 Enhanced cards in your full deck\n(${gameState.fullDeck.filter(card => card.enhancement).length}/16` },
    onScore(gameState, cards) {
      if (gameState.fullDeck.filter(card => card.enhancement).length >= 16) {
        return {"timesMult": 3}
      }
    },
    "cost": 7,
  },
  {
    "name": "Droll Joker",
    getDesc(gameState) { return "+10 Mult if played hand contains a Flush" },
    "rarity": "Common",
    onScore(gameState, cards) {
      if (cardsContain(gameState, getHandType(gameState, cards).cards, "Flush")) return {"plusMult": 10};
    },
    "cost": 4,
  },
  {
    "name": "Drunkard",
    getDesc(gameState) { return "+1 discard each round" },
    "rarity": "Common",
    onBuy(gameState) {gameState.defaultDiscards++;},
    onDestroy(gameState) {gameState.defaultDiscards--;},
    "cost": 4,
    "noCopy": true,
  },
  {
    "name": "The Duo",
    "rarity": "Rare",
    getDesc(gameState) { return "X2 Mult if played hand contains a Pair" },
    onScore(gameState, cards) {
      if (cardsContain(gameState, getHandType(gameState, cards).cards, "Pair")) return {"timesMult": 2};
    },
    "cost": 8,
  },
  {
    "name": "Dusk",
    "rarity": "Uncommon",
    getDesc(gameState) { return "Retrigger all played cards in final hand of round" },
    onCardScored(gameState, card) {
      if (gameState.blind.hands < 1) {
        return {"retriggers": 1};
      }
    },
    "cost": 5,
  },
  {
    "name": "Egg",
    getDesc(gameState) { return "Gains $3 of sell value at end of round" },
    "rarity": "Common",
    "addedSellValue": 0,
    onRoundEnd(gameState) {this.addedSellValue += 3;},
    "cost": 4,
    "noCopy": true,
  },
  {
    "name": "Erosion",
    "rarity": "Uncommon",
    getDesc(gameState) { return `+4 Mult for each card below ${gameState.deckStartSize} in your full deck` },
    onScore() {
      return {"plusMult": 4*(gameState.deckStartSize - gameState.fullDeck.size)}
    },
    "cost": 6,
  },
  {
    "name": "Even Steven",
    getDesc(gameState) { return "Played cards with even rank give +4 Mult when scored (10, 8, 6, 4, 2)" },
    "rarity": "Common",
    onCardScored(gameState, card) {
      if (isRank(gameState, card, 2) || isRank(gameState, card, 4) || isRank(gameState, card, 6) || isRank(gameState, card, 8) || isRank(gameState, card, 10))
        return {"plusMult": 4};
    },
    "cost": 4,
  },
  {
    "name": "Faceless Joker",
    getDesc(gameState) { return "Earn $5 if 3 or more face cards are discarded at the same time" },
    "rarity": "Common",
    onDiscard(gameState, cards) {
      if (cards.filter(card => isFaceCard(card)).length >= 3) {
        gameState += 5;
      }
    },
    "cost": 4,
  },
  {
    "name": "The Family",
    "rarity": "Rare",
    getDesc(gameState) { return " X4 Mult if played hand contains a Four of a Kind" },
    onScore(gameState, cards) {
      if (cardsContain(gameState, getHandType(gameState, cards).cards, "Four of a Kind")) return {"timesMult": 4};
    },
    "cost": 8,
  },
  {
    "name": "Fibonacci",
    "rarity": "Uncommon",
    getDesc(gameState) { return "Each played Ace, 2, 3, 5, or 8 gives +8 Mult when scored" },
    onCardScored(gameState, card) {
      if (isRank(gameState, card, "Ace") || isRank(gameState, card, 2) || isRank(gameState, card, 3) || isRank(gameState, card, 5) || isRank(gameState, card, 8))
        return {"plusMult": 8};
    },
    "cost": 8,
  },
  {
    "name": "Flash Card",
    "rarity": "Uncommon",
    getDesc(gameState) { return `This Joker gains +2 Mult per reroll in the shop\n(Currently +${this.properties.plusMult})` },
    "properties": {"plusMult":0},
    onReroll(gameState) {this.properties.plusMult += 2},
    onScore(gameState, card) {return {"plusMult": this.properties.plusMult};},
    "cost": 5,
    "noPerishable": true,
  },
  {
    "name": "Flower Pot",
    "rarity": "Uncommon",
    getDesc(gameState) { return " X3 Mult if poker hand contains a Diamond card, Club card, Heart card, and Spade card" },
    onScore(gameState, cards) {
      let tempSuits = objectClone(suits);
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
    "cost": 6,
  },
  {
    "name": "Fortune Teller",
    getDesc(gameState) { return `+1 Mult per Tarot card used this run\n(Currently +${this.properties.plusMult})` },
    "rarity": "Common",
    "properties": {"plusMult":0},
    onScore(gameState, cards) {return {"plusMult": this.properties.plusMult};},
    "cost": 6,
  },
  {
    "name": "Four Fingers",
    "rarity": "Uncommon",
    getDesc(gameState) { return "All Flushes and Straights can be made with 4 cards" },
    "cost": 7,
    "noCopy": true,
  },
  {
    "name": "Gift Card",
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
    "cost": 6,
    "noCopy": true,
  },
  {
    "name": "Glass Joker",
    "rarity": "Uncommon",
    getDesc(gameState) { return `This Joker gains X0.75 Mult for every Glass Card that is destroyed\n(Currently X${this.properties.timesMult})` },
    "properties": {"timesMult":1},
    onGlassBreak(gameState) {this.properties.timesMult += 0.75},
    onScore(gameState, cards) {return {"timesMult": this.properties.timesMult}},
    "cost": 6,
  },
  {
    "name": "Gluttonous Joker",
    getDesc(gameState) { return "Played cards with Club suit give +3 Mult when scored" },
    "rarity": "Common",
    onCardScored(gameState, card) {
      if (isSuit(gameState, card, "Clubs")) {
        return {"plusMult": 3};
      }
    },
    "cost": 5,
    "noPerishable": true,
  },
  {
    "name": "Golden Joker",
    getDesc(gameState) { return "Earn $4 at end of round" },
    "rarity": "Common",
    onRoundEnd(gameState) {return {"money": 4};},
    "cost": 6,
    "noCopy": true,
  },
  {
    "name": "Greedy Joker",
    getDesc(gameState) { return "Played cards with Diamond suit give +3 Mult when scored" },
    "rarity": "Common",
    onCardScored(gameState, card) {
      if (isSuit(gameState, card, "Diamonds")) {
        return {"plusMult": 3};
      }
    },
    "cost": 5,
  },
  {
    "name": "Green Joker",
    getDesc(gameState) { return `+1 Mult per hand played, -1 Mult per discard\n(Currently +${this.properties.plusMult})` },
    "rarity": "Common",
    "properties": {"plusMult":0},
    onHandPlayed(gameState, cards) {this.properties.plusMult++;},
    onDiscard(gameState, cards) {this.properties.plusMult = Math.max (0, this.properties.plusMult - 1);},
    onScore(gameState, cards) {return {"plusMult": this.properties.plusMult};},
    "cost": 4,
    "noPerishable": true,
  },
  {
    "name": "Gros Michel",
    getDesc(gameState) { return "+15 Mult, 1 in 6 chance this card is destroyed at end of round" },
    "rarity": "Common",
    onScore(gameState, cards) {return {"plusMult": 15};},
    onRoundEnd(gameState) {
      if (random(gameState, 1, 6)) {
        if (gameState.bannedCards.includes("Cavendish"))
          gameState.bannedCards.splice(gameState.bannedCards.indexOf("Cavendish"), 1);
        if (!gameState.bannedCards.includes("Gros Michel"))
          gameState.bannedCards.push("Gros Michel");
        
        return {"destroy": true};
      }
    },
    "cost": 5,
    "noEternal": true,
  },
  {
    "name": "Hack",
    "rarity": "Uncommon",
    getDesc(gameState) { return "Retrigger each played 2, 3, 4, or 5" },
    onCardScored(gameState, card) {
      if (isRank(gameState, card, 2) || isRank(gameState, card, 3) || isRank(gameState, card, 4) || isRank(gameState, card, 5))
        return {"retriggers": 1};
    },
    "cost": 6,
  },
  {
    "name": "Half Joker",
    getDesc(gameState) { return "+20 Mult if played hand contains 3 or fewer cards" },
    "rarity": "Common",
    onScore(gameState, cards) {
      if (cards.length <= 3) {
        return {"plusMult": 20};
      }
    },
    "cost": 5,
  },
  {
    "name": "Hallucination",
    getDesc(gameState) { return "1 in 2 chance to create a Tarot card when any Booster Pack is opened (Must have room)" },
    "rarity": "Common",
    onBoosterPack(gameState) {
      if (random(gameState, 1, 2))
        addConsumable(gameState, newCard(gameState, "Tarot Card"));
    },
    "cost": 4,
  },
  {
    "name": "Hanging Chad",
    getDesc(gameState) { return "Retrigger first played card used in scoring 2 additional times" },
    "rarity": "Common",
    onCardScored(gameState, card) {
      if (card.index == 0)
        return {"retriggers": 2};
    },
    "cost": 4,
  },
  {
    "name": "Hiker",
    "rarity": "Uncommon",
    getDesc(gameState) { return "Every played card permanently gains +5 Chips when scored" },
    onCardScored(gameState, card) {
      if (!card.extraChips) card.extraChips = 0;
      card.extraChips += 5;
    },
    "cost": 5,
  },
  {
    "name": "Hit the Road",
    "rarity": "Rare",
    getDesc(gameState) { return `This Joker gains X0.5 Mult for every Jack discarded this round\n(Currently X${this.properties.timesMult})` },
    "properties": {"timesMult":1},
    onDiscard(gameState, cards) {
      this.properties.timesMult += cards.filter(card => isRank(gameState, card, "Jack")).length * 0.5;
    },
    onRoundEnd(gameState) {this.properties.timesMult = 1;},
    "cost": 8,
  },
  {
    "name": "Hologram",
    "rarity": "Uncommon",
    getDesc(gameState) { return `This Joker gains X0.25 Mult every time a playing card is added to your deck\n(Currently X${this.properties.timesMult})` },
    "properties": {"timesMult":1},
    onCardAdded(gameState) {this.properties.timesMult += 0.25;},
    onScore(gameState, cards) {return {"timesMult": this.properties.timesMult}},
    "cost": 7,
    "noPerishable": true,
  },
  {
    "name": "Ice Cream",
    getDesc(gameState) { return `+${this.properties.plusChips} Chips, -5 Chips for every hand played` },
    "rarity": "Common",
    "properties": {"plusChips":100},
    onScore(gameState, cards) {
      this.properties.plusChips -= 5;
      return {
        "plusChips": this.properties.plusChips + 5,
        "destroy": this.properties.plusChips <= 0
      }
    },
    "cost": 5,
    "noEternal": true,
  },
  {
    "name": "The Idol",
    "rarity": "Uncommon",
    getDesc(gameState) { return `Each played ${gameState.jokerProperties.idol.card.rank} of ${gameState.jokerProperties.idol.card.suit} gives X2 Mult when scored, Card changes every round` },
    "properties": {"card":{"rank":"Ace","suit":"Spades"}},
    onCardScored(gameState, card) {
      if (isSuit(gameState, card, gameState.jokerProperties.idol.card.suit) && isRank(gameState, card, gameState.jokerProperties.idol.card.rank)) {
        return {"timesMult": 2};
      }
    },
    "cost": 6,
  },
  {
    "name": "Invisible Joker",
    "rarity": "Rare",
    getDesc(gameState) { return `After 2 rounds, sell this card to Duplicate a random Joker\n(${this.properties.roundsRemaining > 0 ? `Rounds remaining: ${this.properties.roundsRemaining}` : "Active!"})` },
    "properties": {"roundsRemaining":2},
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
            jokers.push(objectClone(joker));
          }
        });
        if (jokers.length) {
          const randomJoker = jokers[Math.floor(Math.random() * jokers.length)];
          if (randomJoker.name.toLowerCase().replaceAll(" ", "") == "invisiblejoker") randomJoker.properties.roundsRemaining = 2;
          if (randomJoker.edition.toLowerCase().replaceAll(" ", "") == "negative") delete randomJoker.edition;
          randomJoker.copied = true;
          addNewJoker(gameState, randomJoker);
        }
      }
    },
    "cost": 8,
    "noEternal": true,
    "noCopy": true,
  },
  {
    "name": "Joker",
    getDesc(gameState) { return "+4 Mult" },
    "rarity": "Common",
    onScore(gameState, cards) {return {"plusMult": 4};},
    "cost": 2,
  },
  {
    "name": "Jolly Joker",
    getDesc(gameState) { return "+8 Mult if played hand contains a Pair" },
    "rarity": "Common",
    onScore(gameState, cards) {
      if (cardsContain(gameState, getHandType(gameState, cards).cards, "Pair")) return {"plusMult": 8};
    },
    "cost": 3,
  },
  {
    "name": "Juggler",
    getDesc(gameState) { return "+1 hand size" },
    "rarity": "Common",
    onBuy(gameState) {
      gameState.handSize++;
    },
    onDestroy(gameState) {
      gameState.handSize--;
    },
    "cost": 4,
    "noCopy": true,
  },
  {
    "name": "Loyalty Card",
    "rarity": "Uncommon",
    getDesc(gameState) { return `X4 Mult every 6 hands played\n(${this.properties.roundsRemaining > 0 ? `Rounds remaining: ${this.properties.roundsRemaining}` : "Active!"} rounds left)` },
    "properties": {"roundsRemaining":6},
    onScore(gameState, cards) {
      const oldRounds = this.properties.roundsRemaining;
      this.properties.roundsRemaining = (oldRounds + 8) % 7;
      if (oldRounds < 1) {
        return {"timesMult": 4};
      }
    },
    "cost": 5,
  },
  {
    "name": "Luchador",
    "rarity": "Uncommon",
    getDesc(gameState) { return "Sell this card to disable the current Boss Blind" },
    onSell(gameState) {
      // TODO
    },
    "cost": 5,
    "noEternal": true,
  },
  {
    "name": "Lucky Cat",
    "rarity": "Uncommon",
    getDesc(gameState) { return `This Joker gains X0.25 Mult every time a Lucky card successfully triggers\n(Currently X${this.properties.timesMult})` },
    "properties": {"timesMult":1},
    onScore(gameState, cards) {return {"timesMult": this.properties.timesMult};},
    onLuckyTrigger(gameState) {
      this.properties.timesMult += 0.25;
    },
    "cost": 6,
    "noPerishable": true,
  },
  {
    "name": "Lusty Joker",
    getDesc(gameState) { return "Played cards with Heart suit give +3 Mult when scored" },
    "rarity": "Common",
    onCardScored(gameState, card) {
      if (isSuit(gameState, card, "Hearts")) return {"plusMult": 3};
    },
    "cost": 5,
  },
  {
    "name": "Mad Joker",
    getDesc(gameState) { return "+10 Mult if played hand contains a Two Pair" },
    "rarity": "Common",
    onScore(gameState, cards) {
      if (cardsContain(gameState, getHandType(gameState, cards).cards, "Two Pair")) return {"plusMult": 10};
    },
    "cost": 4,
  },
  {
    "name": "Madness",
    "rarity": "Uncommon",
    getDesc(gameState) { return `When Small Blind or Big Blind is selected, gain X0.5 Mult and destroy a random Joker\n(Currently X${this.properties.timesMult})` },
    "properties": {"timesMult":1},
    onBlindStart(gameState) {
      this.properties.timesMult += 0.5;
      const possibleJokers = gameState.jokers.filter(joker => joker != this && !joker.stickers?.includes("Eternal"));
      if (possibleJokers?.length) {
        destroyJoker(gameState, possibleJokers[Math.floor(Math.random() * possibleJokers.length)]);
      }
    },
    onScore(gameState, cards) {
      return {"timesMult": this.properties.timesMult};
    },
    "cost": 7,
    "noPerishable": true,
  },
  {
    "name": "Mail-In Rebate",
    getDesc(gameState) { return `Earn $5 for each discarded ${gameState.jokerProperties.rebate.rank}, rank changes every round` },
    "rarity": "Common",
    onDiscard(gameState, cards) {
      cards.forEach(card => {
        if (isSuit(gameState, card, gameState.jokerProperties.rebate.rank)) {
          gameState.money += 5;
        }
      })
    },
    "cost": 4,
  },
  {
    "name": "Marble Joker",
    "rarity": "Uncommon",
    getDesc(gameState) { return "Adds one Stone card to deck when Blind is selected" },
    onBlindStart(gameState) {
      drawCard(gameState, newCard(gameState, "Playing Card", false, true));
    },
    "cost": 6,
  },
  {
    "name": "Matador",
    "rarity": "Uncommon",
    getDesc(gameState) { return "Earn $8 if played hand triggers the Boss Blind ability" },
    "cost": 7,
  },
  {
    "name": "Merry Andy",
    "rarity": "Uncommon",
    getDesc(gameState) { return "+3 discards each round, -1 hand size" },
    onBlindStart(gameState) {
      gameState.blind.discards += 3;
    },
    onBuy(gameState) {
      gameState.handSize--;
    },
    onDestroy(gameState) {
      gameState.handSize++;
    },
    "cost": 7,
    "noCopy": true,
  },
  {
    "name": "Midas Mask",
    "rarity": "Uncommon",
    getDesc(gameState) { return "All played face cards become Gold cards when scored" },
    onCardScored(gameState, card) {
      if (isFaceCard(card)) {
        card.enhancement = "Gold Card";
      }
    },
    "cost": 7,
    "noCopy": true,
  },
  {
    "name": "Mime",
    "rarity": "Uncommon",
    getDesc(gameState) { return "Retrigger all card held in hand abilities" },
    onCardHeld(gameState, card) {
      return {"retriggers": 1};
    },
    "cost": 5,
  },
  {
    "name": "Misprint",
    getDesc(gameState) { return "+? Mult" },
    "rarity": "Common",
    onScore(gameState, cards) {
      return {"plusMult": Math.floor(Math.random() * 24)};
    },
    "cost": 4,
  },
  {
    "name": "Mr. Bones",
    "rarity": "Uncommon",
    getDesc(gameState) { return "Prevents Death if chips scored are at least 25% of required chips, self destructs" },
    "cost": 5,
    onMrBones(gameState) {
      return {"destroy": true};
    }
  },
  {
    "name": "Mystic Summit",
    getDesc(gameState) { return "+15 Mult when 0 discards remaining" },
    "rarity": "Common",
    onScore(gameState, cards) {
      if (gameState.blind.discards < 1) {
        return {"plusMult": 15};
      }
    },
    "cost": 5,
    "noEternal": true,
    "noCopy": true,
  },
  {
    "name": "Obelisk",
    "rarity": "Rare",
    getDesc(gameState) { return `This Joker gains X0.2 Mult per consecutive hand played without playing your most played poker hand\n(Currently X${this.properties.timesMult})` },
    "properties": {"timesMult":1},
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
    "cost": 8,
    "noPerishable": true,
  },
  {
    "name": "Odd Todd",
    getDesc(gameState) { return "Played cards with odd rank give +31 Chips when scored (A, 9, 7, 5, 3)" },
    "rarity": "Common",
    onCardScored(gameState, card) {
    if (isRank(gameState, card, "Ace") || isRank(gameState, card, 9) || isRank(gameState, card, 7) || isRank(gameState, card, 5) || isRank(gameState, card, 3))
      return {"plusChips": 31};
    },
    "cost": 4,
  },
  {
    "name": "Onyx Agate",
    "rarity": "Uncommon",
    getDesc(gameState) { return "Played cards with Club suit give +7 Mult when scored" },
    onCardScored(gameState, card) {
      if (isRank(gameState, card, "Clubs")) return {"plusMult": 7};
    },
    "cost": 7,
  },
  {
    "name": "Oops! All 6s",
    "rarity": "Uncommon",
    getDesc(gameState) { return "Doubles all listed probabilities (ex: 1 in 3 -> 2 in 3)" },
    "cost": 4,
    "noCopy": true,
  },
  {
    "name": "The Order",
    "rarity": "Rare",
    getDesc(gameState) { return " X3 Mult if played hand contains a Straight" },
    onScore(gameState, cards) {
      if (cardsContain(gameState, getHandType(gameState, cards).cards, "Straight")) return {"timesMult": 3};
    },
    "cost": 8,
  },
  {
    "name": "Pareidolia",
    "rarity": "Uncommon",
    getDesc(gameState) { return "All cards are considered face cards" },
    "cost": 5,
    "noCopy": true,
  },
  {
    "name": "Perkeo",
    "rarity": "Legendary",
    getDesc(gameState) { return "Creates a Negative copy of 1 random consumable card in your possession at the end of the shop" },
    "cost": 20,
  },
  {
    "name": "Photograph",
    getDesc(gameState) { return "First played face card gives X2 Mult when scored" },
    "rarity": "Common",
    "properties": {},
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
    "cost": 5,
  },
  {
    "name": "Popcorn",
    getDesc(gameState) { return `+${this.properties.plusMult} Mult -4 Mult per round played` },
    "rarity": "Common",
    "properties": {"plusMult":20},
    onScore(gameState, cards) {
      this.properties.plusMult -= 4;
      return {
        "plusMult": this.properties.plusMult + 4,
        "destroy": this.properties.plusMult <= 0
      };
    },
    "cost": 5,
    "noEternal": true,
  },
  {
    "name": "Raised Fist",
    getDesc(gameState) { return "Adds double the rank of lowest ranked card held in hand to Mult" },
    "rarity": "Common",
    onScore(gameState, cards) {
      return {"plusMult": (gameState.blind.hand.length ? Math.min(...gameState.blind.hand) : 0) * 2};
    },
    "cost": 5,
  },
  {
    "name": "Ramen",
    "rarity": "Uncommon",
    getDesc(gameState) { return `X${this.properties.timesMult} Mult, loses X0.01 Mult per card discarded` },
    "properties": {"timesMult":2},
    onDiscard(gameState, cards) {
      this.properties.timesMult -= 0.01 * cards.length;
      return {"destroy": this.properties.timesMult <= 0};
    },
    onScore(gameState, cards) {
      return {"timesMult": this.properties.timesMult};
    },
    "cost": 6,
    "noEternal": true,
  },
  {
    "name": "Red Card",
    getDesc(gameState) { return `This Joker gains +3 Mult when any Booster Pack is skipped\n(Currently +${this.properties.plusMult})` },
    "rarity": "Common",
    "properties": {"plusMult":0},
    onBoosterPackSkipped(gameState) {
      this.properties.plusMult += 3;
    },
    onScore(gameState, cards) {
      return {"plusMult": this.properties.plusMult};
    },
    "cost": 5,
    "noPerishable": true,
  },
  {
    "name": "Reserved Parking",
    getDesc(gameState) { return "Each face card held in hand has a 1 in 2 chance to give $1" },
    "rarity": "Common",
    onCardHeld(gameState, card) {
      if (isFaceCard(gameState, card) && random(gameState, 1, 2)) {
        gameState.money++;
      }
    },
    "cost": 6,
  },
  {
    "name": "Ride the Bus",
    getDesc(gameState) { return `This Joker gains +1 Mult per consecutive hand played without a scoring face card\n(Currently +${this.properties.plusMult})` },
    "rarity": "Common",
    "properties": {"plusMult":0},
    onHandPlayed(gameState, cards) {
      let hasFaceCard = false;
      getHandType(gameState, cards).cards.forEach(card => {
        if (isFaceCard(gameState, card)) hasFaceCard = true;
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
    "cost": 6,
    "noPerishable": true,
  },
  {
    "name": "Riff-Raff",
    getDesc(gameState) { return "When Blind is selected, create 2 Common Jokers (Must have room)" },
    "rarity": "Common",
    onBlindStart(gameState) {
      for (let i = 0; i < 2; i++) {
        if (gameState.jokers.length < gameState.jokerSlots) {
          addNewJoker(gameState, newCard(gameState, "Joker", false, false, "Common", undefined, undefined, undefined, undefined, undefined, undefined, true));
        }
      }
    },
    "cost": 6,
  },
  {
    "name": "Showman",
    "rarity": "Uncommon",
    getDesc(gameState) { return "Joker, Tarot, Planet, and Spectral cards may appear multiple times" },
    "cost": 5,
    "noCopy": true,
  },
  {
    "name": "Rocket",
    "rarity": "Uncommon",
    getDesc(gameState) { return `Earn $${this.properties.money} at end of round. Payout increases by $2 when Boss Blind is defeated` },
    "properties": {"money":1},
    onRoundEnd(gameState) {
      let currentBlindIdx = gameState.currentBlinds.filter(blind => blind.completed).length;
      if (currentBlindIdx == 2)
        this.properties.money += 2;
      return {"money": this.properties.money};
    },
    "cost": 6,
    "noPerishable": true,
    "noCopy": true,
  },
  {
    "name": "Rough Gem",
    "rarity": "Uncommon",
    getDesc(gameState) { return "Played cards with Diamond suit earn $1 when scored" },
    onCardScored(gameState, card) {
      if (isSuit(gameState, card, "Diamonds")) gameState.money++;
    },
    "cost": 7,
  },
  {
    "name": "Runner",
    getDesc(gameState) { return `Gains +15 Chips if played hand contains a Straight\n(Currently +${this.properties.plusChips})` },
    "rarity": "Common",
    "properties": {"plusChips":0},
    onHandPlayed(gameState, cards) {
      if (cardsContain(gameState, getHandType(gameState, cards).cards, "Straight")) this.properties.plusChips += 15; 
    },
    onScore(gameState, cards) {
      return {"plusChips": this.properties.plusChips};
    },
    "cost": 5,
    "noPerishable": true,
  },
  {
    "name": "Satellite",
    "rarity": "Uncommon",
    getDesc(gameState) { return "Earn $1 at end of round per unique Planet card used this run" },
    onRoundEnd(gameState) {
      return {"money": gameState.jokerProperties.satellite.planets.length};
    },
    "cost": 6,
    "noCopy": true,
  },
  {
    "name": "Scary Face",
    getDesc(gameState) { return "Played face cards give +30 Chips when scored" },
    "rarity": "Common",
    onCardScored(gameState, card) {
      if (isFaceCard(gameState, card)) return {"plusChips": 30};
    },
    "cost": 4,
  },
  {
    "name": "Scholar",
    getDesc(gameState) { return "Played Aces give +20 Chips and +4 Mult when scored" },
    "rarity": "Common",
    onCardScored(gameState, card) {
      if (isSuit(gameState, card, "Ace")) return {"plusChips": 20, "plusMult": 4};
    },
    "cost": 4,
  },
  {
    "name": "Séance",
    "rarity": "Uncommon",
    getDesc(gameState) { return "If poker hand is a Straight Flush, create a random Spectral card (Must have room)" },
    onHandPlayed(gameState, cards) {
      if (getHandType(gameState, cards).handType == "Straight Flush") addConsumable(gameState, newCard(gameState, "Spectral Card"));
    },
    "cost": 6,
  },
  {
    "name": "Seeing Double",
    "rarity": "Uncommon",
    getDesc(gameState) { return "X2 Mult if played hand has a scoring Club card and a scoring card of any other suit" },
    onScore(gameState, cards) {
      const newCards = getHandType(gameState, cards).cards;
      let suitCounts = {"Clubs": 0, "Spades": 0, "Hearts": 0, "Diamonds": 0};
      newCards.forEach(card => {
        if (card.enhancement != "Wild Card") {
          suits.forEach(suit => {
            if (isSuit(gameState, card, suit)) suitCounts[suit]++;
          })
        }
      })
      newCards.forEach(card => {
        if (card.enhancement == "Wild Card") {
          for (const suit of Object.keys(suitCounts)) {
            if (isSuit(gameState, card, suit) && suitCounts[suit] == 0) {
              suitCounts[suit]++;
              break;
            }
          }
        }
      })

      if ((suitCounts["Spades"] > 0 || suitCounts["Hearts"] > 0 || suitCounts["Diamonds"] > 0) && suitCounts["Clubs"] > 0)
        return {"timesMult": 2};
    },
    "cost": 6,
  },
  {
    "name": "Seltzer",
    "rarity": "Uncommon",
    getDesc(gameState) { return `Retrigger all cards played for the next ${this.properties.retriggers} hand${this.properties.retriggers.length == 1 ? "" : "s"}` },
    "properties": {"retriggers":10},
    onCardScored(gameState, card) {
      return {"retriggers": 1};
    },
    onScore(gameState, cards) {
      this.properties.retriggers--;
      if (this.properties.retriggers < 1) return {"destroy": true};
    },
    "cost": 6,
    "noEternal": true,
  },
  {
    "name": "Shoot the Moon",
    getDesc(gameState) { return "Each Queen held in hand gives +13 Mult" },
    "rarity": "Common",
    onCardHeld(gameState, card) {
      if (isSuit(gameState, card, "Queen")) return {"plusMult": 13};
    },
    "cost": 5,
  },
  {
    "name": "Shortcut",
    "rarity": "Uncommon",
    getDesc(gameState) { return "Allows Straights to be made with gaps of 1 rank (ex: 10 8 6 5 3)" },
    "cost": 7,
    "noCopy": true,
  },
  {
    "name": "Sixth Sense",
    "rarity": "Uncommon",
    getDesc(gameState) { return "If first hand of round is a single 6, destroy it and create a Spectral card (Must have room)" },
    onHandPlayed(gameState, cards) {
      if (cards.length == 1 && isRank(gameState, cards[0], "6")) {
        addConsumable(gameState, newCard(gameState, "Spectral Card"));
        deleteCard(gameState, cards[0]);
      }
    },
    "cost": 6,
    "noCopy": true,
  },
  {
    "name": "Sly Joker",
    getDesc(gameState) { return "+50 Chips if played hand contains a Pair" },
    "rarity": "Common",
    onScore(gameState, cards) {
      if (cardsContain(gameState, getHandType(gameState, cards).cards, "Pair")) return {"plusChips": 50};
    },
    "cost": 3,
  },
  {
    "name": "Smeared Joker",
    "rarity": "Uncommon",
    getDesc(gameState) { return "Hearts and Diamonds count as the same suit, Spades and Clubs count as the same suit" },
    "cost": 7,
    "noCopy": true,
  },
  {
    "name": "Smiley Face",
    getDesc(gameState) { return "Played face cards give +5 Mult when scored" },
    "rarity": "Common",
    onCardScored(gameState, card) {
      if (isFaceCard(gameState, card)) return {"plusMult": 5};
    },
    "cost": 4,
  },
  {
    "name": "Sock and Buskin",
    "rarity": "Uncommon",
    getDesc(gameState) { return "Retrigger all played face cards" },
    onCardScored(gameState, card) {
      if (isFaceCard(gameState, card)) return {"retriggers": 1};
    },
    "cost": 6,
  },
  {
    "name": "Space Joker",
    "rarity": "Uncommon",
    getDesc(gameState) { return "1 in 4 chance to upgrade level of played poker hand" },
    onHandPlayed(gameState, cards) {
      if (random(gameState, 1, 4)) {
        gameState.handLevels[getHandType(gameState, cards).handType]++;
      }
    },
    "cost": 5,
  },
  {
    "name": "Splash",
    getDesc(gameState) { return "Every played card counts in scoring" },
    "rarity": "Common",
    "cost": 3,
    "noCopy": true,
  },
  {
    "name": "Square Joker",
    getDesc(gameState) { return `This Joker gains +4 Chips if played hand has exactly 4 cards\n(Currently +${this.properties.plusChips})` },
    "rarity": "Common",
    "properties": {"plusChips":0},
    onHandPlayed(gameState, cards) {
      if (cards.length == 4) {
        this.properties.plusChips += 4;
      }
    },
    onScore(gameState, cards) {
      return {"plusChips": this.properties.plusChips};
    },
    "cost": 4,
    "noPerishable": true,
  },
  {
    "name": "Steel Joker",
    "rarity": "Uncommon",
    getDesc(gameState) { return `Gives X0.2 Mult for each Steel Card in your full deck\n(Currently X${gameState.fullDeck.filter(card => card.enhancement == "Steel Card").length*0.2+1})` },
    onScore(gameState, cards) {
      const steelCards = gameState.fullDeck.filter(card => card.enhancement == "Steel Card").length;
      return {"timesMult": 1 + (0.2*steelCards)}
    },
    "cost": 7,
  },
  {
    "name": "Joker Stencil",
    "rarity": "Uncommon",
    getDesc(gameState) { return " X1 Mult for each empty Joker slot, Joker Stencil included" },
    onScore(gameState, cards) {
      return {"timesMult": gameState.jokers.length-gameState.jokers.filter(joker => !joker.name == "Joker Stencil").length}
    },
    "cost": 8,
  },
  {
    "name": "Stone Joker",
    "rarity": "Uncommon",
    getDesc(gameState) { return "Gives +25 Chips for each Stone Card in your full deck" },
    onScore(gameState, cards) {
      const stoneCards = gameState.fullDeck.filter(card => card.enhancement?.toLowerCase().replaceAll(" ", "") == "stonecard").length;
      return {"plusChips": 25*stoneCards}
    },
    "cost": 6,
  },
  {
    "name": "Stuntman",
    "rarity": "Rare",
    getDesc(gameState) { return "+250 Chips, -2 hand size" },
    onBuy(gameState) {
      gameState.handSize -= 2;
    },
    onDestroy(gameState) {
      gameState.handSize += 2;
    },
    onScore(gameState, cards) {
      return {"plusChips": 250};
    },
    "cost": 7,
  },
  {
    "name": "Supernova",
    getDesc(gameState) { return "Adds the number of times poker hand has been played this run to Mult" },
    "rarity": "Common",
    onScore(gameState, cards) {
      return {"plusMult": gameState.handPlays[getHandType(gameState, cards).handType]};
    },
    "cost": 5,
  },
  {
    "name": "Superposition",
    getDesc(gameState) { return "Create a Tarot card if poker hand contains an Ace and a Straight (Must have room)" },
    "rarity": "Common",
    onHandPlayed(gameState, cards) {
      if (getHandType(gameState, cards).cards.filter(card => isRank(gameState, card, "Aces")).length > 0 && cardsContain(gameState, cards, "Straight")) {
        addConsumable(gameState, newCard(gameState, "Tarot Card"));
      }
    },
    "cost": 4,
  }, // TODO: no reason i put this here specifically but check stuff like stuntman for debuffing and rebuffing
  {
    "name": "Swashbuckler",
    getDesc(gameState) { return "Adds the sell value of all other owned Jokers to Mult" },
    onScore(gameState, cards) {
      let sellValue = 0;
      gameState.jokers.forEach(joker => {
        if (joker != this) {
          sellValue += roundHalfDown(calcCost(gameState, joker)/2) + +(joker.addedSellValue || 0);
        }
      })
      return {"plusMult": sellValue};
    },
    "rarity": "Common",
    "cost": 4,
  },
  {
    "name": "Throwback",
    "rarity": "Uncommon",
    getDesc(gameState) { return `X0.25 Mult for each Blind skipped this run\n(Currently X${gameState.skippedBlinds * 0.25 + 1})` },
    onScore(gameState, cards) {
      return {"timesMult": gameState.skippedBlinds * 0.25 + 1}
    },
    "cost": 6,
  },
  {
    "name": "Golden Ticket",
    getDesc(gameState) { return "Played Gold cards earn $4 when scored" },
    "rarity": "Common",
    onCardScored(gameState, card) {
      if (card.enhancement == "Gold Card") gameState.money += 4;
    },
    "cost": 5,
  },
  {
    "name": "To the Moon",
    "rarity": "Uncommon",
    getDesc(gameState) { return "Earn an extra $1 of interest for every $5 you have at end of round" },
    "cost": 5,
    "noCopy": true,
  },
  {
    "name": "To Do List",
    getDesc(gameState) { return `Earn $4 if poker hand is a ${gameState.jokerProperties.todo.handType}, poker hand changes at end of round` },
    "rarity": "Common",
    onHandPlayed(gameState, cards) {
      if (getHandType(gameState, cards).handType == gameState.jokerProperties.todo.handType) gameState.money += 4;
    },
    "cost": 4,
  },
  {
    "name": "Trading Card",
    "rarity": "Uncommon",
    getDesc(gameState) { return "If first discard of round has only 1 card, destroy it and earn $3" },
    onDiscard(gameState, cards) {
      if (cards.length == 1 && gameState.blind.firstDiscard) {
        gameState.money += 3;
        deleteCard(gameState, cards[0]);
      }
    },
    "cost": 6,
    "noCopy": true,
  },
  {
    "name": "The Tribe",
    "rarity": "Rare",
    getDesc(gameState) { return "X2 Mult if played hand contains a Flush" },
    onScore(gameState, cards) {
      if (cardsContain(gameState, getHandType(gameState, cards).cards, "Flush")) return {"timesMult": 2};
    },
    "cost": 8,
  },
  {
    "name": "Triboulet",
    "rarity": "Legendary",
    getDesc(gameState) { return "Played Kings and Queens each give X2 Mult when scored" },
    onScore(gameState, card) {
      if (isRank(gameState, card, "King") || isRank(gameState, card, "Queen")) return {"timesMult": 2};
    },
    "cost": 20,
  },
  {
    "name": "The Trio",
    "rarity": "Rare",
    getDesc(gameState) { return "X3 Mult if played hand contains a Three of a Kind" },
    onScore(gameState, cards) {
      if (cardsContain(gameState, getHandType(gameState, cards).cards, "Three of a Kind")) return {"timesMult": 3};
    },
    "cost": 8,
  },
  {
    "name": "Troubadour",
    "rarity": "Uncommon",
    getDesc(gameState) { return "+2 hand size, -1 hand each round" },
    onBuy(gameState) {
      gameState.handSize += 2;
      gameState.defaultHands--;
    },
    onDestroy(gameState) {
      gameState.handSize -= 2;
      gameState.defaultHands++;
    },
    "cost": 6,
    "noCopy": true,
  },
  {
    "name": "Spare Trousers",
    "rarity": "Uncommon",
    getDesc(gameState) { return `This Joker gains +2 Mult if played hand contains a Two Pair\n(Currently +${this.properties.plusMult})` },
    "properties": {"plusMult":0},
    onHandPlayed(gameState, cards) {
      if (cardsContain(gameState, cards, "Two Pair")) this.properties.plusMult
    },
    "cost": 6,
    "noPerishable": true,
  },
  {
    "name": "Turtle Bean",
    "rarity": "Uncommon",
    getDesc(gameState) { return `+${this.properties.plusHandSize} hand size, reduces by 1 every round` },
    "cost": 6,
    "noEternal": true,
    "noCopy": true,
    "properties": {
      "plusHandSize": 5
    },
    onBuy(gameState) {
      gameState.handSize += 5;
    },
    onRoundEnd(gameState) {
      this.properties.plusHandSize--;
      gameState.handSize--;
      if (this.properties.plusHandSize <= 0) return {"destroy": true};
    },
    onDestroy(gameState) {
      gameState.hands -= this.properties.plusHandSize;
    }
  },
  {
    "name": "Vagabond",
    "rarity": "Rare",
    getDesc(gameState) { return "Create a Tarot card if hand is played with $4 or less" },
    onHandPlayed(gameState, cards) {
      if (gameState.money <= 4) addConsumable(gameState, newCard(gameState, "Tarot Card"));
    },
    "cost": 8,
  },
  {
    "name": "Vampire",
    "rarity": "Uncommon",
    getDesc(gameState) { return "This Joker gains X0.1 Mult per scoring Enhanced card played, removes card Enhancement" },
    "properties": {"timesMult":1},
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
    "cost": 7,
    "noPerishable": true,
  },
  {
    "name": "Walkie Talkie",
    getDesc(gameState) { return "Each played 10 or 4 gives +10 Chips and +4 Mult when scored" },
    "rarity": "Common",
    onCardScored(gameState, card) {
      if (isRank(gameState, card, "10") || isRank(gameState, card, "4")) {
        return {"plusMult": 4, "plusChips": 10};
      }
    },
    "cost": 4,
  },
  {
    "name": "Wee Joker",
    "rarity": "Rare",
    getDesc(gameState) { return `This Joker gains +8 Chips when each played 2 is scored\n(Currently ${this.properties.plusChips})` },
    "properties": {"plusChips":0},
    onCardScored(gameState, card) {
      if (isSuit(gameState, card, "2")) {
        this.properties.plusChips += 8;
      }
    },
    onScore(gameState, cards) {
      return {"plusChips": this.properties.plusChips};
    },
    "cost": 8,
    "noPerishable": true,
  },
  {
    "name": "Wily Joker",
    getDesc(gameState) { return "+100 Chips if played hand contains a Three of a Kind" },
    "rarity": "Common",
    onScore(gameState, cards) {
      if (cardsContain(gameState, getHandType(gameState, cards).cards, "Three of a Kind")) return {"plusChips": 100};
    },
    "cost": 4,
  },
  {
    "name": "Wrathful Joker",
    getDesc(gameState) { return "Played cards with Spade suit give +3 Mult when scored" },
    "rarity": "Common",
    onCardScored(gameState, card) {
      if (isSuit(gameState, card, "Spades")) {
        return {"plusMult": 3};
      }
    },
    "cost": 5,
  },
  {
    "name": "Yorick",
    "rarity": "Legendary",
    getDesc(gameState) { return "This Joker gains X1 Mult every 23 cards discarded" },
    "properties": {"discardsLeft":23,"timesMult":1},
    onDiscard(gameState, cards) {
      const newDiscards = (this.properties.discardsLeft - cards.length);
      if (newDiscards < 1) {
        this.properties.timesMult++;
        this.properties.discardsLeft += newDiscards + 23;
      }
    },
    "cost": 20,
  },
  {
    "name": "Zany Joker",
    getDesc(gameState) { return "+12 Mult if played hand contains a Three of a Kind" },
    "rarity": "Common",
    onScore(gameState, cards) {
      if (cardsContain(gameState, getHandType(gameState, cards).cards, "Three of a Kind")) return {"timesMult": 12};
    },
    "cost": 4
  },
];

const blinds = [
  {
    "name": "Small Blind",
    "minimumAnte": 1,
    "scoreMult": 1,
    "primaryColor": "#0068ad",
    "primaryShadow": "#003f6f",
    "secondaryColor": "#0e435f",
    "tertiaryColor": "#0e435f"
  },
  {
    "name": "Big Blind",
    "minimumAnte": 1,
    "scoreMult": 1.5,
    "primaryColor": "#a56c00",
    "primaryShadow": "#6a4200",
    "secondaryColor": "#54451a",
    "tertiaryColor": "#54451a"
  },
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
  },

  {
    "name": "Violet Vessel",
    "debuff": "Very large blind",
    "minimumAnte": 8,
    "scoreMult": 6,
    "primaryColor": "#7d60e0",
    "primaryShadow": "#4d3a93",
    "secondaryColor": "#303550",
    "tertiaryColor": "#443f74",
    "isFinisherBoss": true
  },
  {
    "name": "Cerulean Bell",
    "debuff": "Forces 1 card to\nalways be selected",
    "minimumAnte": 8,
    "scoreMult": 2,
    "primaryColor": "#0091ff",
    "primaryShadow": "#005ca9",
    "secondaryColor": "#123f57",
    "tertiaryColor": "#055481",
    "isFinisherBoss": true
  },
  {
    "name": "Verdant Leaf",
    "debuff": "All cards debuffed\nuntil 1 Joker sold",
    "minimumAnte": 8,
    "scoreMult": 2,
    "primaryColor": "#429e78",
    "primaryShadow": "#24644a",
    "secondaryColor": "#25423c",
    "tertiaryColor": "#2c584b",
    "isFinisherBoss": true
  },
  {
    "name": "Amber Acorn",
    "debuff": "Flips and shuffles\nall Joker cards",
    "minimumAnte": 8,
    "scoreMult": 2,
    "primaryColor": "#ff9800",
    "primaryShadow": "#a96000",
    "secondaryColor": "#4b401d",
    "tertiaryColor": "#78560d",
    "isFinisherBoss": true
  },
  {
    "name": "Crimson Heart",
    "debuff": "One random Joker\ndisabled every hand",
    "minimumAnte": 8,
    "scoreMult": 2,
    "primaryColor": "#a41919",
    "primaryShadow": "#680707",
    "secondaryColor": "#392629",
    "tertiaryColor": "#532324",
    "isFinisherBoss": true
  },
  
]

function newGame(deck = "Red Deck", stake = "White Stake") {
    let game = {
      "endless": false,
      stake,
      "state": "blindSelect",
      "defaultDiscards": 3,
      "defaultHands": 4,
      "money": 4,
      "ante": 1,
      "round": 0,
      "jokerSlots": 5,
      "moneyLimit": 0,
      "jokers": [],
      // "jokers": [objectClone(jokers.find(card => card.name == "Chaos the Clown"))],
      "consumableSlots": 2,
      "playedHands": 0,
      "unusedDiscards": 0,
      "skippedBlinds": 0,
      "consumables": [],
      "handSize": 8,
      "tags": [],
      deck,
      "sortByRank": true,
      "vouchers": [],
      "anteBlinds": [],
      "blindBases": [300n, 800n, 2000n, 5000n, 11000n, 20000n, 35000n, 50000n],
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
        "Flush Five": 0,
        "Flush House": 0,
        "Five of a Kind": 0,
        "Straight Flush": 0,
        "Four of a Kind": 0,
        "Full House": 0,
        "Flush": 0,
        "Straight": 0,
        "Three of a Kind": 0,
        "Two Pair": 0,
        "Pair": 0,
        "High Card": 0
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
          "playingCardOdds": 2.8
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
      "jokerProperties": {
        "ancient": {
          "suit": ""
        },
        "castle": {
          "suit": ""
        },
        "idol": {
          "card": {"rank": "Ace", "suit": "Spades"}
        },
        "rebate": {
          "rank": "Ace"
        },
        "satellite": {
          "planets": []
        },
        "todo": {
          "handType": ""
        }
      },
      "hadShop": false,
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
      "bannedPacks": [],
      "bannedBlinds": [],
      "seenBlinds": [],
      "bannedTags": [],
      "bannedCards": ["Cavendish"],
      "typeOdds": {
        "eternal": 0,
        "rental": 0,
        "perishable": 0
      }
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
            const fool = objectClone(cards["Tarot Card"].find(card => card.name == "The Fool"));
            fool.cost = 3;
            game.consumables.push(objectClone(fool));
            game.consumables.push(fool);
            break;
        case "nebuladeck":
            addVoucher(game, "Telescope");
            game.consumableSlots--;
            break;
        case "ghostdeck":
            const hex = objectClone(cards["Spectral Card"].find(card => card.name == "Hex"));
            hex.cost = 4;
            game.consumables.push(hex);
            game.shopWeights["Spectral Card"].odds = 2;
            break;
        case "abandoneddeck":
            game.fullDeck = game.fullDeck.filter(card => !['Jack', 'Queen', 'King'].includes(card.rank));
            break;
        case "checkereddeck":
            game.fullDeck = game.fullDeck.map(card => {
                let newSuit = card.suit;
                if (card.suit === 'Clubs') newSuit = 'Spades';
                else if (card.suit === 'Diamonds') newSuit = 'Hearts';
                
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
            game.handSize += 2;
            break;
        case "anaglyphdeck":
            break;
        case "plasmadeck":
            break;
        case "erraticdeck":
            game.fullDeck = [];
          for (let i = 0; i < 52; i++) {
              let card = {};
              card.suit = suits[Math.floor(Math.random() * suits.length)];
              card.rank = ranks[Math.floor(Math.random() * ranks.length)];
              card.chips = card.rank;
              if (["Jack", "Queen", "King"].includes(card.rank)) card.chips = 10n;
              if (card.rank == "Ace") card.chips = 11n;
              card.chips = BigInt(card.chips);
              game.fullDeck.push(card);
          }
          break;
        default:
            throw new Error("Invalid deck");
    }

    switch (stake.toLowerCase().replaceAll(" ", "")) {
        case "goldstake":
          game.typeOdds.rental = 30;
        case "orangestake":
          game.typeOdds.perishable = 30;
        case "purplestake":
          game.defaultDiscards--;
          game.blindBases = [300n, 1000n, 3200n, 9000n, 25000n, 60000n, 110000n, 200000n];
          game.typeOdds.eternal = 30;
          break;
        case "bluestake":
            game.defaultDiscards--;
        case "blackstake":
          game.typeOdds.eternal = 30;
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

    updateJokerProps(game);

    game.deckStartSize = game.fullDeck.length;

    return game;
}

function bigIntToSci(n) {
  const str = n.toString();
  if (n >= 100000000000n) {
    const exponent = str.length - 1;
    const digits = str.slice(0, 4);
    const mantissa = digits[0] + '.' + digits.slice(1);
    return `${mantissa}e${exponent}`;
  }
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getBossBlind(gameState) {
  const bossKey = gameState.ante > 0 && gameState.ante % 8 == 0 ? "isFinisherBoss" : "isNormalBoss" 
  let allowedBlinds = blinds.filter(blind => blind[bossKey] && blind.minimumAnte <= gameState.ante && !gameState.seenBlinds.includes(blind.name) && !gameState.bannedBlinds.includes(blind.name));
  if (allowedBlinds.length < 1) {
      gameState.seenBlinds = [];
      allowedBlinds = blinds.filter(blind => blind[bossKey] && blind.minimumAnte <= gameState.ante && !gameState.bannedBlinds.includes(blind.name));
  }
  
  const newBlind = allowedBlinds[Math.floor(Math.random() * allowedBlinds.length)];
  newBlind.reward = bossKey == "isFinisherBoss" ? 7 : 5;
  gameState.seenBlinds.push(newBlind.name);
  return newBlind;
}

function newBlinds(gameState) {
  const newBlind = getBossBlind(gameState);

  const smallReward = gameState.stake.toLowerCase().replaceAll(" ", "") == "whitestake" ? 3 : 0;

  const randomTag = () => {
    const possibleTags = tags.filter(tag => !gameState.bannedTags.includes(tag.name) && tag.minAnte <= gameState.ante);
    let tag = objectClone(possibleTags[Math.floor(Math.random() * possibleTags.length)]);
    if (tag.name == "Orbital Tag") {
      const possibleHandTypes = Object.keys(pokerHands).filter(handType => pokerHands[handType].unlocked || gameState.handPlays[handType]);
      tag.properties.handType = possibleHandTypes[Math.floor(Math.random() * possibleHandTypes.length)];
    }
    return tag;
  }

  gameState.currentBlinds = [
    {"name": "Small Blind", "tag": randomTag(), "reward": smallReward},
    {"name": "Big Blind", "tag": randomTag(), "reward": 4},
    newBlind
  ];

  adjustBlinds(gameState);
}

function adjustBlinds(gameState) {
  let base;

  if (gameState.ante < 1) {
    base = 100n;
  } else if (gameState.ante <= 8) {
    base = gameState.blindBases[gameState.ante - 1];
  } else {
    // Functions taken from https://www.desmos.com/calculator/fsvcr75cdx
    const SCALE = BigInt(decimalAccuracy);
    const b = (16n * SCALE) / 10n;
    const r75 = (75n * SCALE) / 100n;
    const r02 = (2n * SCALE) / 10n;
    const start = BigInt(gameState.blindBases[7]);

    function powFixed(base, exp) {
      if (exp % SCALE !== 0n) throw new Error("Non-integer exponent");
      let result = SCALE;
      let b = base;
      let e = exp / SCALE;
      while (e > 0n) {
        if (e % 2n === 1n) result = (result * b) / SCALE;
        b = (b * b) / SCALE;
        e /= 2n;
      }
      return result;
    }

    function c(ante) {
      return BigInt(ante - 8);
    }

    function d(ante) {
      return SCALE + (c(ante) * r02) / SCALE;
    }

    function f(ante) {
      const cVal = c(ante);
      const dVal = d(ante);
      const base = (r75 * cVal);
      const inner = b + powFixed(base, dVal);
      return (start * powFixed(inner, cVal * SCALE)) / SCALE;
    }

    function g(ante) {
      const value = f(ante);
      const log10 = BigInt(value.toString().length - 1);
      const round = 10n ** (log10 - 1n);
      return value - (value % round);
    }

    base = g(gameState.ante);
  }

  const plasmaMult = gameState.deck.toLowerCase().replaceAll(" ", "") === "plasmadeck" ? 2n : 1n;
  gameState.currentBlinds[0].blindScore = base * plasmaMult;
  gameState.currentBlinds[1].blindScore = base * 15n / 10n * plasmaMult;
  const mult = BigInt(Math.round(gameState.currentBlinds[2].scoreMult * 10));
  gameState.currentBlinds[2].blindScore = base * mult / 10n * plasmaMult;
}

function powBigInt(base, exp) {
  let result = 1n;
  while (exp > 0n) {
    if (exp % 2n === 1n) result *= base;
    base *= base;
    exp /= 2n;
  }
  return result;
}

function powFixed(baseScaled, exp, scale) {
  let result = scale;
  for (let i = 0n; i < exp; i++) {
    result = result * baseScaled / scale;
  }
  return result;
}

function log10BigInt(n) {
  let log = 0n;
  while (n >= 10n) {
    n /= 10n;
    log++;
  }
  return log + 1n;
}


function sellCard(gameState, section, index) { // Pass index starting with 0
  section = section.toLowerCase().replaceAll(" ", "");
  if (section != "consumables" && section != "jokers") return "Invalid section";
  const card = gameState[section][index];
  if (!card) return "Invalid index";
  if (card.stickers?.includes("Eternal")) return "Joker is eternal";
  gameState.money += Math.max(1, roundHalfDown(calcCost(gameState, card)/2)+(card.addedSellValue || 0));
  handleJokers(gameState, "onCardSold");
  if (card.onSell) card.onSell(gameState);
  if (section == "consumables") {
    gameState[section].splice(index, 1);
  } else {
    destroyJoker(gameState, card);
  }
}

function addVoucher(gameState, voucher) {
  gameState.vouchers.push(voucher);
  gameState.vouchers.splice(gameState.vouchers.indexOf(voucher), 1);

  switch (voucher.toLowerCase().replaceAll(" ", "")) {
    case "overstock":
      gameState.possibleVouchers.push("Overstock Plus");
    case "overstockplus":
      gameState.shopSlots++;
      if (gameState.state == "shop")
        fillShopCards(gameState);
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
      packTypes["Arcana Pack"]["Spectral Card"].odds = 0.2;
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
      gameState.shopWeights["Tarot Card"].odds = 9.6;
      break;
    case "tarottycoon":
      gameState.shopWeights["Tarot Card"].odds = 32;
      break;
    case "planetmerchant":
      gameState.possibleVouchers.push("Planet Tycoon");
      gameState.shopWeights["Planet Card"].odds = 9.6;
      break;
    case "planettycoon":
      gameState.shopWeights["Planet Card"].odds = 32;
      break;
    case "seedmoney":
      gameState.possibleVouchers.push("Money Tree");
      gameState.interestCap = 10;
      break;
    case "moneytree":
      gameState.interestCap = 20;
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
    case "director'scut": // TODO
      gameState.possibleVouchers.push("Retcon");
      break;
    case "retcon": // TODO
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

function newCard(gameState, cardType, certificate = false, stone = false, jokerRarity = undefined, forceEnhancement = false, blockEdition = false, playingCardType = undefined, isBoosterPack = false, isShop = false, isCoupon = false, noStickers = false) {
  let card;
  let rarity = pickByPercentage([
    {"type": "Common", "odds": 70},
    {"type": "Uncommon", "odds": 25},
    {"type": "Rare", "odds": 5},
  ]).type;
  if (jokerRarity) rarity = jokerRarity;
  const jokerNames = gameState.jokers.map(joker => joker.name.toLowerCase());
  if (isShop) {
    for (const tag of gameState.tags) {
      if (tag.name == "Uncommon Tag") {
        cardType = "Joker";
        rarity = "Uncommon";
        gameState.tags.splice(gameState.tags.indexOf(tag), 1);
        break;
      }
      if (tag.name == "Rare Tag") {
        cardType = "Joker";
        rarity = "Rare";
        gameState.tags.splice(gameState.tags.indexOf(tag), 1);
        break;
      }
    }
  }
  do {
    if (cardType == "Joker") {
      const jokersOfRarity = jokers.filter(joker => rarity == joker.rarity);
      do {
        card = jokersOfRarity[Math.floor(Math.random() * jokersOfRarity.length)];
      } while (jokersOfRarity.length != 0 && jokerCount(gameState, "showman") <= 0 && (jokerNames.includes(card.name) || deepFind(gameState, (thing) => thing?.name == card.name)));
    } else if (cardType == "Planet Card") {
      if (gameState.vouchers.includes("Telescope") && isBoosterPack && !gameState.currentPack.contents.length) {
        const pokerHand = Object.keys(gameState.handPlays).sort((a, b) => {return gameState.handPlays[a] - gameState.handPlays[b]})[0];
        card = {name: pokerHands[pokerHand].planet, handType: pokerHand};
      }
      do {
        const pokerHand = Object.keys(pokerHands)[Math.floor(Math.random() * Object.keys(pokerHands).length)];
        card = {name: pokerHands[pokerHand].planet, handType: pokerHand}
      } while ((!pokerHands[card.handType].unlocked && gameState.handPlays[card.handType] < 1) || (!jokerCount(gameState, "showman") && deepFind(gameState, (thing) => thing?.name == card.name)));
    } else {
      let remainingCards = cards[cardType];
      if (cardType != "Playing Card") {
        const newCards = remainingCards.filter(card => (!gameState.consumables.map(card => card.name).includes(card.name) && !deepFind(gameState, (thing) => thing?.name == card.name)) || jokerCount(gameState, "showman") > 0);
        remainingCards = newCards.length < 1 ? remainingCards : newCards;
      } else if (playingCardType == "Number") {
        remainingCards.filter(card => {
          switch (card.rank.toLowerCase()) {
            case "ace":
            case "king":
            case "queen":
            case "jack":
              return false;
            default:
              return true;
          }
        })
      } else if (playingCardType == "Ace") {
        remainingCards.filter(card => card.rank.toLowerCase() == "ace");
      } else if (playingCardType == "Face") {
        remainingCards.filter(card => {
          switch (card.rank.toLowerCase()) {
            case "king":
            case "queen":
            case "jack":
              return true;
            default:
              return true;
          }
        })
      }
      card = remainingCards[Math.floor(Math.random() * remainingCards.length)];
    }
  } while (gameState.bannedCards.includes(card.name));

  card = objectClone(card); // Seperate card object from where it got it from

  if (isCoupon) card.coupon = true;

  if (cardType == "Playing Card") card.cost = 1;
  if (cardType == "Tarot Card" || cardType == "Planet Card") card.cost = 3;
  if (cardType == "Spectral Card") card.cost = 4;


  if (cardType == "Spectral Card" || cardType == "Tarot Card" || cardType == "Planet Card") return card;
  if (cardType == "Playing Card") {
    if (isBoosterPack) {
      const hasSeal = Math.random() <= 0.2;
      if (hasSeal) {
        card.seal = seals[Math.floor(Math.random() * seals.length)];
      }
      card.edition = pickByPercentage(gameState.editions, "playingCardOdds");
    } else {
      const hasEdition = Math.random() <= gameState.shopWeights["Playing Card"].edition / 100;

      if (hasEdition && !certificate && !stone && !blockEdition) {
        card.edition = pickWeightedRandom({"Holographic": {"odds": 2.8}}, {"Polychrome": {"odds": 1.2}}, {"Foil": {"odds": 4}});
      }
      if (certificate) {
        card.seal = seals[Math.floor(Math.random() * seals.length)];
      }
    }
    const hasEnhancement = Math.random() <= gameState.shopWeights["Playing Card"].enhancement / 100;
    if (hasEnhancement && !certificate && !stone || forceEnhancement) {
      card.enhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
    }
    if (stone) {
      card.enhancement = "Stone Card";
    }
  }
  if (cardType == "Joker") {
    const edition = pickByPercentage(gameState.editions);
    if (edition) {
      card.edition = edition;
    } else if (isShop) {
      for (const tag of gameState.tags) {
        if (tag.name == "Foil Tag") {
          card.edition = "Foil";
          gameState.tags.splice(gameState.tags.indexOf(tag), 1);
          break;
        }
        if (tag.name == "Holographic Tag") {
          card.edition = "Holographic";
          gameState.tags.splice(gameState.tags.indexOf(tag), 1);
          break;
        }
        if (tag.name == "Polychrome Tag") {
          card.edition = "Polychrome";
          gameState.tags.splice(gameState.tags.indexOf(tag), 1);
          break;
        }
        if (tag.name == "Negative Tag") {
          card.edition = "Negative";
          gameState.tags.splice(gameState.tags.indexOf(tag), 1);
          break;
        }
      }
    }

    card.stickers = [];

    if (!isBoosterPack && jokerRarity?.toLowerCase() != "legendary" && !noStickers) {
      const timeBasedSticker = pickByPercentage({"Eternal": {"odds": card.noEternal ? 0 : gameState.typeOdds.eternal}, "Perishable": {"odds": card.noPerishable ? 0 : gameState.typeOdds.perishable}});
      if (timeBasedSticker) card.stickers.push(timeBasedSticker);
      const isRental = pickByPercentage({"Rental": {"odds": gameState.typeOdds.rental}});
      if (isRental) card.stickers.push(isRental);
    }
  }
  return card;
}

function fillShopCards(gameState) {
  const coupon = gameState.tags.find(tag => tag.name == "Coupon Tag");
  if (coupon) gameState.tags.splice(gameState.tags.indexOf(coupon), 1);
  while (gameState.shop.cards.length < gameState.shopSlots) {
    const cardType = pickWeightedRandom(gameState.shopWeights);
    gameState.shop.cards.push(newCard(gameState, cardType, undefined, undefined, undefined, undefined, undefined, undefined, undefined, true, !!coupon));
  }
}

function rerollShop(gameState) {
  if (gameState.shop.filled && !gameState.shop.chaosUsed) {
    if (gameState.money-gameState.rerollCost < gameState.moneyLimit && gameState.rerollCost > 0) return "Not enough money";
    gameState.money -= gameState.rerollCost;
    gameState.currentReroll++;
  }
  handleJokers(gameState, "onReroll");
  gameState.shop.cards = [];
  fillShopCards(gameState);

  const chaos = gameState.jokers.find(joker => joker.name == "Chaos the Clown" && !joker.properties.beenUsed);
  if (chaos) {
    gameState.rerollCost = 0;
    gameState.shop.chaosUsed = true;
    chaos.properties.beenUsed = true;
  } else {
    gameState.shop.chaosUsed = false;
    gameState.rerollCost = gameState.currentReroll;
  }
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

function roundHalfDown(n) {
  const intPart = Math.floor(n);
  const decimal = n - intPart;
  if (decimal == 0.5) return intPart;
  return Math.round(n);
}


function addVoucherToShop(gameState) {
  const newVouchers = gameState.possibleVouchers.filter(voucher => !gameState.shop.vouchers.includes(voucher));
  if (newVouchers.length < 1) return "No tags";
  const voucherType = newVouchers[Math.floor(Math.random() * newVouchers.length)];
  gameState.shop.vouchers.push({"name": voucherType, "cost": 10, "desc": voucherDescs[voucherType]});
}

function capitalize(str) {
  if (!str) return str;
  str = str.toLowerCase();
  return str[0].toUpperCase() + str.slice(1);
}

function calcCost(gameState, card) {
  if ((card.name.toLowerCase().includes("celestial") || card.handType) && jokerCount(gameState, "astronomer")) return 0;
  if (card.stickers?.includes("Rental")) return 1;

  return card.coupon ? 0 : Math.max(1, roundHalfDown(card.cost + (gameState.editions[capitalize(card.edition)]?.cost || 0) * gameState.discount));
}

function addNewJoker(gameState, joker) {
  gameState.jokers.push(joker);
  if (joker.edition?.toLowerCase() == "negative") gameState.jokerSlots++;
  handleJoker(gameState, joker, "onBuy");
}

function buyCard(gameState, index) {
  const target = gameState.shop.cards[index];
  if (!target) return "Invalid index";
  if (gameState.money-calcCost(gameState, target) < gameState.moneyLimit && calcCost(gameState, target) > 0) return "Not enough money";
  if (target.rarity) { // Joker
    if (gameState.jokers.length >= gameState.jokerSlots) return "No empty joker slots";
    addNewJoker(gameState, target);
  } else if (!target.rank) { // Consumable
    if (gameState.consumables.length >= gameState.consumableSlots) return "No empty consumable slots";
    if (target.edition?.toLowerCase() == "negative") gameState.consumableSlots++;
    gameState.consumables.push(target);
  } else { // Playing Card
    drawCard(gameState, target);
  }
  gameState.money -= calcCost(gameState, target);
  delete target.coupon;
  gameState.shop.cards.splice(index, 1);
}

function buyPack(gameState, pack, free = false) {
  const target = pack;
  if (!target) return "Invalid index";
  if (gameState.money-calcCost(gameState, target) < gameState.moneyLimit && calcCost(gameState, target) > 0 && !free) return "Not enough money";
  gameState.oldState = gameState.state;
  gameState.state = "openingPack";
  handleJokers(gameState, "onBoosterPack");
  target.contents = [];
  const packOdds = packTypes[target.name.replaceAll("Mega", "").replaceAll("Jumbo", "").trim()];
  for (let i = 0; i < target.amount; i++) {
    const cardType = pickWeightedRandom(packOdds);
    target.contents.push(newCard(gameState, cardType, false, false, undefined, false, false, undefined, true));
  }
  gameState.currentPack = target;
  delete gameState.cardArea;
  if (target.name.toLowerCase().includes("spectral") || target.name.toLowerCase().includes("arcana")) {
    gameState.cardArea = [];
    for (let i = gameState.cardArea.length; i < gameState.handSize; i++) {
      const cardIdx = Math.floor(Math.random() * gameState.fullDeck.length);
      drawCard(gameState, gameState.fullDeck[cardIdx]);
      gameState.fullDeck.splice(cardIdx, 1);
    }
  }
  if (!free) {
    gameState.money -= calcCost(gameState, target);
    gameState.shop.packs.splice(gameState.shop.packs.indexOf(pack), 1);
  }
}

function usePlanet(gameState, card) {
  gameState.handLevels[card.handType]++;
  handleJokers(gameState, "onPlanetCardUsed");
  if (!gameState.jokerProperties.satellite.planets.includes(card.name))
    gameState.jokerProperties.satellite.planets.push(card.name);
}

function packSelect(gameState, index, selectedCards = []) {
  if (gameState.state != "openingPack") return "Not opening Pack";
  const target = gameState.currentPack.contents[index];
  if (!target) return "Invalid index";
  if (target.rarity) { // Joker
    if (gameState.jokers.length >= gameState.jokerSlots) return "No empty joker slots";
    addNewJoker(gameState, target);
  } else if (!target.rank) { // Consumable
    if (target.onUse) { // Spectral or Tarot
      const response = target.onUse(gameState, selectedCards);
      if (response) return response;
    } else { // Planet Card
      usePlanet(gameState, target);
    }
    if (target.handType || cards["Tarot Card"].find(tarot => tarot.name == target.name)) gameState.theFool = target;
  } else { // Playing Card
    drawCard(gameState, target);
  }
  gameState.currentPack.choices--;
  if (gameState.currentPack.choices < 1) {
    gameState.state = gameState.oldState;
    delete gameState.cardArea;
  }
}

function skipPack(gameState) {
  if (gameState.state != "openingPack") return "Not opening pack";
  handleJokers(gameState, "onBoosterPackSkipped");
  delete gameState.cardArea;
  gameState.state = gameState.oldState;
}

function buyVoucher(gameState, index) {
  const target = gameState.shop.vouchers[index];
  if (!target) return "Invalid index";
  if (gameState.money - calcCost(gameState, target) < gameState.moneyLimit && calcCost(gameState, target) > 0) return "Not enough money";
  gameState.money -= calcCost(gameState, target);
  addVoucher(gameState, target.name);
  gameState.shop.vouchers.splice(index, 1);
}

function shopBuy(gameState, section, index) { // Pass index starting at 0
  switch (section.toLowerCase().replaceAll(" ", "")) {
    case "cards":
      return buyCard(gameState, index);
    case "packs":
      return buyPack(gameState, gameState.shop.packs[index]);
    case "vouchers":
      return buyVoucher(gameState, index);
    default:
      throw new Error("Invalid section");
  }
}

function deepFind(obj, predicate) {
  if (typeof obj !== 'object' || obj === null) return undefined;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (predicate(obj[i], i)) return obj[i];
      if (typeof obj[i] === 'object' && obj[i] !== null) {
        const result = deepFind(obj[i], predicate);
        if (result !== undefined) return result;
      }
    }
  } else {
    for (const [key, value] of Object.entries(obj)) {
      if (predicate(value, key)) return value;

      if (typeof value === 'object' && value !== null) {
        const result = deepFind(value, predicate);
        if (result !== undefined) return result;
      }
    }
  }

  return undefined;
}

function restoreGameFunctions(game) {
  const sections = [game.jokers, game.consumables, game.shop?.cards, game.currentPack?.contents, game.tags];

  sections.forEach(section => {
    if (!Array.isArray(section)) return;
    section.forEach(consumable => {
      const ogConsumable = deepFind(cards, findConsumable => findConsumable.name == consumable.name) || deepFind(jokers, findConsumable => findConsumable.name == consumable.name) || deepFind(tags, findConsumable => findConsumable?.name == consumable.name);
      if (!ogConsumable) return;
      for (const [key, value] of Object.entries(ogConsumable)) {
        if (typeof value === "function") {
          consumable[key] = value;
        }
      }
    })
  })


  if (game.theFool) {
    const ogConsumable = game.theFool.name;
    if (!ogConsumable) return game;
    for (const [key, value] of Object.entries(ogConsumable)) {
      if (typeof value === "function") {
        game.theFool[key] = value;
      }
    }
  }

  if (game.blind?.hand) game.cardArea = game.blind.hand;

  return game;
}

function newShop(gameState) {
  let currentBlindIdx = gameState.currentBlinds.filter(blind => blind.completed).length;
  gameState.shop.packs = [];

  // Reroll voucher if new ante
  if (currentBlindIdx == 0 || !gameState.hadShop) {
    gameState.shop.vouchers = [];
    addVoucherToShop(gameState);
  }

  // Reset to last voucher if had more than one
  if (gameState.shop.vouchers.length > 1) {
    gameState.shop.vouchers.length = 1;
  }

  // Add vouchers for voucher tags
  for (let i = gameState.tags.length - 1; i >= 0; i--) {
    if (gameState.tags[i].name.toLowerCase().replaceAll(" ", "") == "vouchertag") {
      if (addVoucherToShop(gameState) != "No tags")
        gameState.tags.splice(i, 1);
    }
  }

  // Fill booster packs
  const allowedPacks = boosterPacks.filter(pack => !gameState.bannedPacks.includes(pack.name));
  if (!gameState.hadShop && !gameState.bannedPacks.includes("Buffoon Pack")) gameState.shop.packs[0] = {"name": "Buffoon Pack", "amount": 2, "choices": 1, "odds": 1.2, "cost": 4, "types": 1};
  while (gameState.shop.packs.length < 2) {
    gameState.shop.packs.push(pickWeightedRandom(allowedPacks));
  }
  if (gameState.tags.find(tag => tag.name == "Coupon Tag")) {
    gameState.shop.packs.forEach(pack => {
      pack.coupon = true;
    })
  }
  
  gameState.currentReroll = gameState.rerollBase;

  const d6 = gameState.tags.find(tag => tag.name == "D6 Tag");
  if (d6) {
    gameState.tags.splice(gameState.tags.indexOf(d6), 1);
    gameState.currentReroll = 0;
  }
  gameState.rerollCost = gameState.currentReroll;
  const chaos = gameState.jokers.find(joker => joker.name == "Chaos the Clown" && !joker.properties.beenUsed);
  if (chaos) {
    gameState.rerollCost = 0;
    gameState.shop.chaosUsed = true;
    chaos.properties.beenUsed = true;
  } else {
    gameState.shop.chaosUsed = false;
  }

  gameState.hadShop = true;

  gameState.shop.packs.forEach(pack => pack.type = Math.floor(Math.random() * pack.types + 1));

  // Fill cards
  gameState.shop.filled = false;
  rerollShop(gameState);
  gameState.shop.filled = true;
}

function goNext(gameState) {
  if (gameState.state != "shop") return "Not in Shop";
  gameState.state = "blindSelect";
}

function blindChoose(gameState, skip = false) {
  if (gameState.state != "blindSelect") return "Not selecting Blind";
  const blindIdx = gameState.currentBlinds.filter(blind => blind.completed).length;
  if (skip && blindIdx == 2) return "Cannot skip Boss Blind";
  if (skip) {
    gameState.currentBlinds[blindIdx].completed = true;
    gameState.currentBlinds[blindIdx].skipped = true;
    gameState.tags.push(gameState.currentBlinds[blindIdx].tag);
    if (gameState.currentBlinds[blindIdx].tag.name != "Double Tag") {
      gameState.tags.forEach((tag, i) => {
        if (tag.name == "Double Tag") {
          gameState.tags[i] = objectClone(gameState.currentBlinds[blindIdx].tag);
        }
      });
    }
    gameState.tags.forEach((tag, idx) => {
      if (tag.onBuy) {
        tag.onBuy(gameState);
        gameState.tags.splice(idx, 1);
      }
    })
    gameState.skippedBlinds++;
  } else {
    gameState.state = "blind";
    blindSetup(gameState);
  }
}

function fillHand(gameState) {
  for (let i = gameState.blind.hand.length; i < gameState.handSize; i++) {
    drawCard(gameState);
  }
  setHandSort(gameState, gameState.sortByRank);
}

function setHandSort(gameState, sortByRank) {
  if (gameState.state != "blind") return "Not in Blind";
  gameState.sortByRank = sortByRank;
  
  const bigger = gameState.sortByRank ? "rank" : "suit";
  const smaller = gameState.sortByRank ? "suit" : "rank";
  const biggerArr = gameState.sortByRank ? ranks : suits;
  const smallerArr = gameState.sortByRank ? suits : ranks;
  gameState.blind.hand.sort((a,b) => {
    if (biggerArr.indexOf(a[bigger]) < biggerArr.indexOf(b[bigger])) return -1;
    if (biggerArr.indexOf(a[bigger]) > biggerArr.indexOf(b[bigger])) return 1;
    if (smallerArr.indexOf(a[smaller]) < smallerArr.indexOf(b[smaller])) return -1;
    if (smallerArr.indexOf(a[smaller]) > smallerArr.indexOf(b[smaller])) return 1;
    return 0;
  })
}

function blindSetup(gameState) {
  const blindIdx = gameState.currentBlinds.filter(blind => blind.completed).length;
  gameState.blind = objectClone(blinds.find(blind => blind.name == gameState.currentBlinds[blindIdx].name));

  gameState.round++;
  gameState.blind.hands = gameState.defaultHands;
  gameState.blind.discards = gameState.defaultDiscards;
  gameState.blind.firstDiscard = true;
  gameState.blind.firstHand = true;
  gameState.blind.roundScore = 0n;
  gameState.blind.hand = [];
  gameState.cardArea = gameState.blind.hand;
  gameState.blind.handPlays = 0;
  gameState.blind.remainingCards = [...gameState.fullDeck];
  gameState.blind.blindScore = gameState.currentBlinds[blindIdx].blindScore;
  gameState.blind.juggleTagsUsed = 0;
  gameState.tags.forEach((tag, idx) => {
    if (tag.name == "Juggle Tag") {
      gameState.blind.juggleTagsUsed++;
      gameState.handSize += 3;
      gameState.tags.splice(idx, 1);
    }
  })
  fillHand(gameState);
  handleJokers(gameState, "onBlindStart");
}

function handleJoker(gameState, joker, func, params = []) {
  let response;
  let copied = false;
  if (joker[func]) response = joker[func](gameState, ...params);
  let idx;
  gameState.jokers.forEach((loopJoker, index) => {
    if (loopJoker == joker)
      idx = index;
  })
  if (joker.name.toLowerCase().replaceAll(" ", "") == "blueprint" && !gameState.jokers[idx+1]?.noCopy) {
    response = handleJoker(gameState, gameState.jokers[idx+1], func, params);
    copied = true;
  }
  if (joker.name.toLowerCase().replaceAll(" ", "") == "brainstorm" && !gameState.jokers[0]?.noCopy) {
    response = handleJoker(gameState, gameState.jokers[0], func, params);
    copied = true;
  }
  if (copied) response.destroy = false;
  if (response?.destroy) destroyJoker(gameState, joker);
  return response;
}

function handleJokers(gameState, func, params = []) {
  let returnArray = [];
  let retriggers = 0;
  gameState.jokers?.filter((joker, idx) => !joker.debuffed).forEach(joker => {
    let response = handleJoker(gameState, joker, func, params);
    if (response) returnArray.push(response);
    if (response?.retriggers) retriggers += response.retriggers;
  })
  return {"responses": returnArray.filter(Boolean), retriggers };
}

const decimalAccuracy = 100000000;

function handleMult(gameState, chips, mult, responseArray) {
  responseArray.filter(Boolean).forEach(response => {
    if (response.plusChips && response.plusChips > 0) chips += BigInt(response.plusChips);
    if (response.plusMult && response.plusMult > 0) mult += BigInt(response.plusMult * decimalAccuracy);
    if (response.timesMult && response.timesMult > 1) mult = mult * BigInt(Math.round(response.timesMult * 100)) / 100n;
  })
  
  return {chips, mult};
}

function destroyJoker(gameState, joker) {
  if (joker.onDestroy) joker.onDestroy(gameState);
  if (joker.edition?.toLowerCase().replaceAll(" ", "") == "negative") gameState.jokerSlots--;
  handleJoker(gameState, joker, "onDestroy");
  gameState.jokers.forEach((loopJoker, idx) => {
    if (loopJoker == joker) gameState.jokers.splice(idx, 1);
  })
}

function playHand(gameState, indices) { // Pass the indices starting at 0
  if (gameState.state != "blind") return "Not in Blind";
  if (!indices.length || [...new Set(indices)].length != indices.length || Math.min(...indices) < 0 || Math.max(...indices) > gameState.blind.hand.length-1) return "Invalid indices";

  let cards = [];
  indices.forEach(index => {
    cards.push(gameState.blind.hand[index]);
  })
  gameState.blind.hand = gameState.blind.hand.filter((card, idx) => !indices.includes(idx));
  cards = cards.filter(Boolean);
  gameState.blind.cards = cards;

  gameState.blind.hands--;
  gameState.playedHands++;

  const handType = getHandType(gameState, cards).handType;
  const pokerHand = pokerHands[handType];

  let chips = pokerHand.base.chips + pokerHand.addition.chips * BigInt(gameState.handLevels[handType]-1); // Base chips & mult
  let mult = (pokerHand.base.mult + pokerHand.addition.mult * BigInt(gameState.handLevels[handType]-1)) * BigInt(decimalAccuracy); // Multiply all mult by decimalAccuracy, reset at the final calculation

  const handPlayedResponses = handleJokers(gameState, "onHandPlayed", [cards]).responses; // Hand played jokers
  gameState.lastHand = handType;
  ({ chips, mult } = handleMult(gameState, chips, mult, handPlayedResponses));

  cards.forEach((card, idx) => { // Loop through played cards
    if (card.debuffed) return;
    card.index = idx;
    let playedCardResponses = [];
    let retriggers = 0;
    let trigger = 0;
    while (trigger <= retriggers) {
      // Handle rank chips and any extra chips from Hiker
      if (!card.enhancement || card.enhancement.toLowerCase().replaceAll(" ", "") != "stonecard") playedCardResponses.push({"plusChips": card.chips});
      if (card.extraChips) playedCardResponses.push({"plusChips": card.extraChips});

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
      const handledJokers = handleJokers(gameState, "onCardScored", [card]);
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
        switch (card.edition.toLowerCase().replaceAll(" ", "")) {
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
      const handledJokers = handleJokers(gameState, "onCardHeld", [card]);
      retriggers = handledJokers.retriggers;
      heldCardResponses.push(...handledJokers.responses); // Handle jokers
      trigger++;
    }
    ({ chips, mult } = handleMult(gameState, chips, mult, heldCardResponses));
  })

  if (gameState.vouchers.includes("Observatory")) { // Observatory
    let observatoryArr = [];
    gameState.consumables.forEach(consumable => {
      if (consumable.handType == handType) {
        observatoryArr.push({"timesMult": 1.5});
      }
    })
    ({chips, mult} = handleMult(gameState, chips, mult, observatoryArr));
  }

  let jokerResponses = [];
  if (Array.isArray(gameState.jokers)) {
    gameState.jokers.forEach((joker, idx) => { // Handle joker scoring
      joker.index = idx;
      if (joker.rarity.toLowerCase().replaceAll(" ", "") == "uncommon" && jokerCount(gameState, "baseballcard")) {
        for (let i = 0; i < jokerCount(gameState, "baseballcard"); i++) {
          jokerResponses.push({"timesMult": 1.5});
        }
      }
      if (joker.debuffed) return;
      if (joker.edition && joker.edition.toLowerCase().replaceAll(" ", "") == "foil") jokerResponses.push({"plusChips": 50});
      if (joker.edition && joker.edition.toLowerCase().replaceAll(" ", "") == "holographic") jokerResponses.push({"plusMult": 10});
      const handledJoker = handleJoker(gameState, joker, "onScore", [cards]);
      jokerResponses.push(handledJoker);
      if (joker.edition && joker.edition.toLowerCase().replaceAll(" ", "") == "polychrome") jokerResponses.push({"timesMult": 1.5});
    })
  }
  ({ chips, mult } = handleMult(gameState, chips, mult, jokerResponses));

  if (gameState.deck.toLowerCase().replaceAll(" ", "") == "plasmadeck") {
    chips = (chips + mult / BigInt(decimalAccuracy)) / 2n;
    mult = chips;
    gameState.blind.roundScore += chips * mult;
  } else {
    gameState.blind.roundScore += chips * mult / BigInt(decimalAccuracy);
  }
  gameState.blind.firstHand = false;
  if (gameState.blind.roundScore >= gameState.blind.blindScore) {
    blindEnd(gameState);
    return;
  }
  if (gameState.blind.hands < 1) {
    if (gameState.blind.roundScore >= gameState.blind.blindScore/4n && jokerCount(gameState, "mr.bones") > 0) {
      handleJokers(gameState, "onMrBones");
      blindEnd(gameState, true);
    } else {
      gameLose(gameState);
    }
    return;
  }
  fillHand(gameState);
}

function gameLose(gameState) {
  gameState.state = "lose";
}

function discardCards(gameState, indices) { // Pass the indices starting at 0
  if (gameState.state != "blind") return "Not in Blind";
  if (gameState.blind.discards < 1) return "No discards remaining";
  if (!indices.length || [...new Set(indices)].length != indices.length || Math.min(...indices) < 0 || Math.max(...indices) > gameState.blind.hand.length-1) return "Invalid indices";

  let cards = [];
  indices.forEach(index => {
    cards.push(gameState.blind.hand[index]);
  })
  gameState.blind.hand = gameState.blind.hand.filter((card, idx) => !indices.includes(idx));
  cards = cards.filter(Boolean);

  cards.forEach(card => {
    if (seals[card.seal]?.onCardDiscarded)
      seals[card.seal]?.onCardDiscarded(gameState);
  })
  handleJokers(gameState, "onDiscard", [cards]);
  fillHand(gameState);
  gameState.blind.firstDiscard = false;
  gameState.blind.discards--;
}

function blindEnd(gameState, isMrBones = false) {
  gameState.blind.hand.forEach(card => {
    for (let i = 0; i <= jokerCount(gameState, "Mime") + jokerCount(gameState, "Blueprint") + jokerCount(gameState, "Brainstorm"); i++) {
      if (seals[card.seal]?.onEndCards)
        seals[card.seal]?.onEndCards(gameState);
      if (seals[card.enhancement]?.onEndCards)
        seals[card.enhancement]?.onEndCards(gameState);
    }
  })
  gameState.state = "blindWin";
  delete gameState.cardArea;
  gameState.handSize -= gameState.blind.juggleTagsUsed*3;
  let currentBlindIdx = gameState.currentBlinds.filter(blind => blind.completed).length;
  gameState.currentBlinds[currentBlindIdx].completed = true;
  gameState.moneySources = [];
  if (gameState.deck.toLowerCase().replaceAll(" ", "") == "anaglyphdeck") {
    if (!gameState.bannedTags.includes("Double Tag"))
      gameState.tags.push(objectClone(tags.find(tag => tag.name == "Double Tag")));
  }
  if (!isMrBones) gameState.moneySources.push(["Blind Reward", gameState.currentBlinds[currentBlindIdx].reward]);
  if (gameState.deck.toLowerCase().replaceAll(" ", "") == "greendeck") {
    gameState.moneySources.push(["Remaining Hands", gameState.blind.hands*2 ]);
    gameState.moneySources.push(["Remaining Discards", gameState.blind.discards ]);
  } else {
    gameState.moneySources.push(["Interest", Math.min(Math.floor(gameState.money / 5), gameState.interestCap) * (jokerCount(gameState, "tothemoon") + 1) ]);
    gameState.moneySources.push(["Remaining Hands", gameState.blind.hands ]);
  }
  gameState.jokers.forEach(joker => {
    const handledJoker = handleJoker(gameState, joker, "onRoundEnd");
    if (handledJoker?.money) gameState.moneySources.push([joker.name, handledJoker.money]);
  });
  if (currentBlindIdx == 2) { // Boss blind
    gameState.tags.forEach((tag, idx) => {
      if (tag.name.toLowerCase().replaceAll(" ", "") == "investmenttag") {
        gameState.moneySources.push("Investment Tag", 25);
        gameState.tags.splice(idx, 1);
      }
    })
    if (gameState.ante >= 8) gameState.endless = true;
    gameState.ante++;
    newBlinds(gameState);
  }
  delete gameState.blind.remainingCards;
  gameState.unusedDiscards += gameState.blind.discards;

  updateJokerProps(gameState);
}

function updateJokerProps(gameState) {
  // Ancient Joker
  const newSuits = suits.filter(suit => suit != gameState.jokerProperties.ancient.suit);
  gameState.jokerProperties.ancient.suit = newSuits[Math.floor(Math.random() * newSuits.length)];
  
  // Castle
  const possibleCastleCards = gameState.fullDeck.filter(card => !card.enhancement || card.enhancement.toLowerCase().replaceAll(" ", "") != "stonecard");
  if (possibleCastleCards.length >= 1) 
    gameState.jokerProperties.castle.suit = possibleCastleCards[Math.floor(Math.random() * possibleCastleCards.length)].suit;

  // The Idol
  const possibleIdolCards = gameState.fullDeck.filter(card => !card.enhancement || card.enhancement.toLowerCase().replaceAll(" ", "") != "stonecard");
  if (possibleIdolCards.length >= 1)
    gameState.jokerProperties.idol.card = objectClone(possibleIdolCards[Math.floor(Math.random() * possibleIdolCards.length)]);

  // Mail-In Rebate
  const possibleRebateCards = gameState.fullDeck.filter(card => !card.enhancement || card.enhancement.toLowerCase().replaceAll(" ", "") != "stonecard");
  if (possibleRebateCards.length >= 1)
    gameState.jokerProperties.rebate.rank = possibleCastleCards[Math.floor(Math.random() * possibleCastleCards.length)].rank;

  // To Do List
  const possibleHandTypes = Object.keys(pokerHands).filter(handType => (pokerHands[handType].unlocked || gameState.handPlays[handType]) && handType != gameState.jokerProperties.todo.handType);
  gameState.jokerProperties.todo.handType = possibleHandTypes[Math.floor(Math.random() * possibleHandTypes.length)];
}

function cashOut(gameState) {
  if (gameState.state != "blindWin") return "Not on Blind win screen";
  gameState.state = "shop";
  gameState.moneySources.filter(Boolean).forEach(source => {
    gameState.money += source[1] || 0;
  })
  delete gameState.blind;
  newShop(gameState);
}

function useConsumable(gameState, index, selectedCards) { // Pass the index starting at 0
  const card = gameState.consumables[index];
  if (!card) return "Invalid index";
  let response;
  gameState.consumableSlots++;
  if (card.onUse) response = card.onUse(gameState, selectedCards.map(idx => gameState.cardArea[idx]));
  gameState.consumableSlots--;
  if (response?.error) return response;
  if (card.handType || cards["Tarot Card"].find(tarot => tarot.name == card.name)) gameState.theFool = card;
  if (card.handType) usePlanet(gameState, card);
  gameState.consumables.splice(index, 1);
  if (card.edition?.toLowerCase() == "negative") gameState.consumableSlots--;
}

function jokerToText(gameState, joker) {
  if (joker.flipped) {
    const addon = gameState.deck.toLowerCase().replaceAll(" ", "") != "reddeck" && joker.copied ? " (copied)" : "";
    switch (joker.name.toLowerCase().replaceAll(" ", "")) {
      case "squarejoker":
      case "halfjoker":
      case "photograph":
      case "weejoker":
        return `Flipped ${joker.name}${addon}`;
      default:
        return `Flipped joker${addon}`;
    }
  }
  let returnString = "";
  if (joker.debuffed) returnString += "Debuffed ";
  joker.stickers?.forEach(sticker => {
    if (!sticker.toLowerCase().includes("sticker")) returnString += `${sticker} `;
  })
  if (joker.edition) returnString += `${joker.edition} `;
  returnString += joker.name;
  return returnString;
}

function playingCardToText(gameState, card) {
  if (card.flipped) return "Flipped card";
  let returnString = "";
  if (card.selected) returnString += "Selected ";
  if (card.debuffed) returnString += "Debuffed ";
  if (card.seal) returnString += `${card.seal} `;
  if (card.edition) returnString += `${card.edition} `;
  if (card.enhancement) returnString += `${card.enhancement} `;
  if (card.edition?.toLowerCase().replaceAll(" ", "") != "stonecard")
    returnString += `${card.rank} of ${card.suit}`;
  if (card.extraChips) returnString += ` (+${card.extraChips} extra Chips)`
  return returnString;
}

function consumableToText(gameState, consumable) {
  let returnString = "";
  if (consumable.negative) returnString += "Negative ";
  returnString += consumable.name;
  return returnString;
}

function gameToText(gameState) {
  let returnString = `${gameState.stake} | ${gameState.deck}`;
  returnString += "\nJokers:";
  gameState.jokers.forEach(joker => returnString += `\n${jokerToText(gameState, joker)}`);
  returnString += "\n\nConsumables:";
  gameState.consumables.forEach(consumable => returnString += `\n${consumableToText(gameState, consumable)}`);
  returnString += "\n\nTags:";
  gameState.tags.forEach(tag => {
    returnString += `\n${tag.name}`;
  });
  returnString += `\n\nHands: ${gameState.blind ? gameState.blind.hands : gameState.defaultHands} | Discards: ${gameState.blind ? gameState.blind.discards : gameState.defaultDiscards}`;
  returnString += `\n$${gameState.money}`;
  returnString += `\nAnte: ${gameState.ante}/8`;
  returnString += `\nRound: ${gameState.round}`;
  returnString += `\nDeck: ${gameState.blind?.remainingCards?.length || gameState.fullDeck.length}/${gameState.fullDeck.length}\n\n`;

  switch (gameState.state) {
    case "blind":
      returnString += gameState.blind.name;
      if (gameState.blind.debuff) returnString += "\n" + gameState.blind.debuff;
      returnString += `\nScore at least: ${bigIntToSci(gameState.blind.blindScore)}`;
      if (gameState.blind.reward) {
        returnString += `\nReward: ${"$".repeat(gameState.blind.reward)}`;
      } else {
        returnString += `\nNo Reward`;
      }
      returnString += `\nRound score: ${bigIntToSci(gameState.blind.roundScore)}\n`;

      gameState.blind.hand.forEach(card => returnString += `\n${playingCardToText(gameState, card)}`);
      returnString += `\n\nHand: ${gameState.blind.hand.length}/${gameState.handSize}`;
      break;
    case "blindWin":
      returnString += `Round score: ${bigIntToSci(gameState.blind.roundScore)}\n`;
      let money = 0;
      let moneyString = "";
      gameState.moneySources.filter(Boolean).forEach(source => {
        money += source[1];
        moneyString += `\n${source[0]}: ${"$".repeat(source[1])}`;
      })
      returnString += `Cash Out: $${money}`;
      returnString += moneyString;
      break;
    case "shop":
      returnString += "Cards:";
      gameState.shop.cards.forEach(card => {
        returnString += `\n$${calcCost(gameState, card)} `;

        if (card.rarity) { // Joker
          returnString += jokerToText(gameState, card);
        } else if (card.rank) { // Playing Card
          returnString += playingCardToText(gameState, card);
        } else { // Consumable
          returnString += consumableToText(gameState, card);
        }
      })

      returnString += "\n\nBooster Packs:";
      gameState.shop.packs.forEach(pack => {
        returnString += `\n$${calcCost(gameState, pack)} ${pack.name}`;
      })

      returnString += "\n\nVouchers:";
      gameState.shop.vouchers.forEach(voucher => {
        returnString += `\n$${calcCost(gameState, voucher)} ${voucher.name}`;
      })
      break;
    case "openingPack":
      returnString += `${gameState.currentPack.name}\n`;
      gameState.currentPack.contents.forEach(card => {
        returnString += cardToText(gameState, card);
      })
      if (gameState.cardArea) {
        returnString += "\n\n"
        gameState.cardArea.forEach(card => returnString += `\n${playingCardToText(gameState, card)}`);
      }
      returnString += `\n\nChoose ${gameState.currentPack.choices}`;
      break;
    case "blindSelect":
      returnString += blindsToText(gameState);
      break;
    case "lose":
      returnString += `YOU LOSE`; // TODO
  }
  return returnString;
}

function cardToText(gameState, card) {
  if (card.rarity) { // Joker
    return `\n${jokerToText(gameState, card)}`;
  } else if (card.rank) { // Playing Card
    return `\n${playingCardToText(gameState, card)}`;
  } else { // Consumable
    return `\n${consumableToText(gameState, card)}`;
  }
}

function blindsToText(gameState) {
  let returnArray = [];
  gameState.currentBlinds.forEach(blind => {
    let tempReturnString = "";
    tempReturnString += `${blind.name}\n`;
    if (blind.debuff) tempReturnString += `${blind.debuff}\n`;
    tempReturnString += `${bigIntToSci(blind.blindScore)}\n`;
    if (blind.reward) {
      tempReturnString += `Reward: ${"$".repeat(blind.reward)}\n`;
    } else {
      tempReturnString += `No Reward\n`;
    }
    if (blind.tag) {
      tempReturnString += `Skip Tag: ${blind.tag.name}`;
      if (blind.tag.name == "Orbital Tag") {
        tempReturnString += ` ${(blind.tag.properties.handType)}`;
      }
      tempReturnString += "\n";
    }
    if (blind.skipped) {
      tempReturnString += "SKIPPED\n";
    } else if (blind.completed) {
      tempReturnString += "COMPLETED\n";
    }
    returnArray.push(tempReturnString);
  })
  return returnArray.join("\n\n");
}

function cardsToText(gameState, fullDeck = false) {
  let suitArrays = {
    "Spades": [],
    "Hearts": [],
    "Clubs": [],
    "Diamonds": []
  }
  let rankCounts = {};
  ranks.forEach(rank => rankCounts[rank] = 0);
  gameState.fullDeck.forEach(card => {
    if (fullDeck || !gameState.blind || gameState.blind.remainingCards.includes(card)) {
      suitArrays[card.suit].push(card);
      rankCounts[card.rank]++;
    }
  })

  let returnString = "";
  Object.keys(suitArrays).forEach(suit => {
    returnString += `\n\n${suit}: ${suitArrays[suit].length}\n`;
    suitArrays[suit].forEach(card => returnString += `${cardToText(gameState, card)}`);
  })
  returnString += "\n\nRank Counts:";
  ranks.forEach(rank => {
    let rankName = rank;
    if (Number.isNaN(parseInt(rank))) rankName = rank.substring(0,1);
    returnString += `\n${rankName}: ${rankCounts[rank]}`;
  })
  return returnString;
}

function vouchersToText(gameState) {
  return gameState.vouchers.join("\n");
}

function handLevelsToText(gameState) {
  let returnArr = [];
  Object.keys(pokerHands).filter(hand => pokerHands[hand].unlocked || gameState.handPlays[hand] > 0).forEach(hand => {
    returnArr.push(`${hand}: lvl.${gameState.handLevels[hand]} | ${gameState.handPlays[hand]}`);
  })
  return returnArr.join("\n");
}

function swapCards(gameState, indexes) {
  if (!gameState.cardArea) return "No cards";
  if (indexes.length != 2) return "Select 2 cards";
  const temp = gameState.cardArea[indexes[0]];
  gameState.cardArea[indexes[0]] = gameState.cardArea[indexes[1]];
  gameState.cardArea[indexes[1]] = temp;
}

function swapJokers(gameState, indexes) {
  if (indexes.length != 2) return "Select 2 jokers";
  const temp = gameState.jokers[indexes[0]];
  gameState.jokers[indexes[0]] = gameState.jokers[indexes[1]];
  gameState.jokers[indexes[1]] = temp;
}

module.exports = {
  newGame,
  rerollShop,
  goNext,
  blindChoose,
  playHand,
  discardCards,
  setHandSort,
  gameToText,
  cashOut,
  shopBuy,
  packSelect,
  skipPack,
  blindsToText,
  sellCard,
  cardToText,
  useConsumable,
  restoreGameFunctions,
  calcCost,
  swapCards,
  swapJokers,
  cardsToText,
  vouchersToText,
  handLevelsToText
}