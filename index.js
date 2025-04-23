const suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
const ranks = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];

const seals = {
  "Red Seal": {},
  "Gold Seal": {},
  "Blue Seal": {},
  "Purple Seal": {}
}

const enhancements = {
  "Bonus Card": {},
  "Mult Card": {},
  "Wild Card": {},
  "Glass Card": {},
  "Steel Card": {},
  "Stone Card": {},
  "Gold Card": {},
  "Lucky Card": {}
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

const jokers = {
    "8 Ball": {
      "text": "1 in 4 chance for each played 8 to create a Tarot card when scored (Must have room)",
      "rarity": "Common"
},
    "Abstract Joker": {
      "text": "+3 Mult for each Joker card",
      "rarity": "Common"
    },
    "Acrobat": {
      "rarity": "Uncommon",
      "text": "X3 Mult on final hand of round"
    },
    "Ancient Joker": {
      "rarity": "Rare",
      "text": "Each played card with [suit] gives X1.5 Mult when scored, suit changes at end of round"
    },
    "Arrowhead": {
      "rarity": "Uncommon",
      "text": "Played cards with Spade suit give +50 Chips when scored"
    },
    "Astronomer": {
      "rarity": "Uncommon",
      "text": "All Planet cards and Celestial Packs in the shop are free"
    },
    "Banner": {
      "text": "+30 Chips for each remaining discard",
      "rarity": "Common"
    },
    "Baron": {
      "rarity": "Rare",
      "text": "Each King held in hand gives X1.5 Mult"
    },
    "Baseball Card": {
      "rarity": "Rare",
      "text": "Uncommon Jokers each give X1.5 Mult"
    },
    "Blackboard": {
      "rarity": "Uncommon",
      "text": "X3 Mult if all cards held in hand are Spades or Clubs"
    },
    "Bloodstone": {
      "rarity": "Uncommon",
      "text": "1 in 2 chance for played cards with the Heart suit to give X1.5 Mult when scored"
    },
    "Blue Joker": {
      "text": "+2 Chips for each remaining card in deck",
      "rarity": "Common"
    },
    "Blueprint": {
      "rarity": "Rare",
      "text": "Copies ability of Joker to the right"
    },
    "Bootstraps": {
      "rarity": "Uncommon",
      "text": "+2 Mult for every $5 you have"
    },
    "Brainstorm": {
      "rarity": "Rare",
      "text": "Copies the ability of leftmost Joker"
    },
    "Bull": {
      "rarity": "Uncommon",
      "text": "+2 Chips for each $1 you have"
    },
    "Burglar": {
      "rarity": "Uncommon",
      "text": "When Blind is selected, gain +3 Hands and lose all discards"
    },
    "Burnt Joker": {
      "rarity": "Rare",
      "text": "Upgrade the level of the first discarded poker hand each round"
    },
    "Business Card": {
      "text": "Played face cards have a 1 in 2 chance to give $2 when scored",
      "rarity": "Common"
    },
    "Canio": {
      "rarity": "Legendary",
      "text": "This Joker gains X1 Mult when a face card is destroyed"
    },
    "Campfire": {
      "rarity": "Rare",
      "text": "This Joker gains X0.25 Mult for each card sold, resets when Boss Blind is defeated"
    },
    "Card Sharp": {
      "rarity": "Uncommon",
      "text": " X3 Mult if played poker hand has already been played this round"
    },
    "Cartomancer": {
      "rarity": "Uncommon",
      "text": "Create a Tarot card when Blind is selected (Must have room)"
    },
    "Castle": {
      "text": "This Joker gains +3 Chips per discarded [suit] card, suit changes every round",
      "rarity": "Common"
    },
    "Cavendish": {
      "text": "X3 Mult, 1 in 1000 chance this card is destroyed at end of round",
      "rarity": "Common"
    },
    "Ceremonial Dagger": {
      "rarity": "Uncommon",
      "text": "When Blind is selected, destroy Joker to the right and permanently add double its sell value to this Mult"
    },
    "Certificate": {
      "rarity": "Uncommon",
      "text": "When round begins, add a random playing card with a random seal to your hand"
    },
    "Chaos the Clown": {
      "text": "1 free Reroll per shop",
      "rarity": "Common"
    },
    "Chicot": {
      "rarity": "Legendary",
      "text": "Disables effect of every Boss Blind"
    },
    "Clever Joker": {
      "text": "+80 Chips if played hand contains a Two Pair",
      "rarity": "Common"
    },
    "Cloud 9": {
      "rarity": "Uncommon",
      "text": "Earn $1 for each 9 in your full deck at end of round"
    },
    "Constellation": {
      "rarity": "Uncommon",
      "text": "This Joker gains X0.1 Mult every time a Planet card is used"
    },
    "Crafty Joker": {
      "text": "+80 Chips if played hand contains a Flush",
      "rarity": "Common"
    },
    "Crazy Joker": {
      "text": "+12 Mult if played hand contains a Straight",
      "rarity": "Common"
    },
    "Credit Card": {
      "text": "Go up to -$20 in debt",
      "rarity": "Common"
    },
    "Delayed Gratification": {
      "text": "Earn $2 per discard if no discards are used by end of the round",
      "rarity": "Common"
    },
    "Devious Joker": {
      "text": "+100 Chips if played hand contains a Straight",
      "rarity": "Common"
    },
    "Diet Cola": {
      "rarity": "Uncommon",
      "text": "Sell this card to create a free Double Tag"
    },
    "DNA": {
      "rarity": "Rare",
      "text": "If first hand of round has only 1 card, add a permanent copy to deck and draw it to hand"
    },
    "Driver's License": {
      "rarity": "Rare",
      "text": "X3 Mult if you have at least 16 Enhanced cards in your full deck"
    },
    "Droll Joker": {
      "text": "+10 Mult if played hand contains a Flush",
      "rarity": "Common"
    },
    "Drunkard": {
      "text": "+1 discard each round",
      "rarity": "Common"
    },
    "The Duo": {
      "rarity": "Rare",
      "text": "X2 Mult if played hand contains a Pair"
    },
    "Dusk": {
      "rarity": "Uncommon",
      "text": "Retrigger all played cards in final hand of round"
    },
    "Egg": {
      "text": "Gains $3 of sell value at end of round",
      "rarity": "Common"
    },
    "Erosion": {
      "rarity": "Uncommon",
      "text": "+4 Mult for each card below [the deck's starting size] in your full deck"
    },
    "Even Steven": {
      "text": "Played cards with even rank give +4 Mult when scored (10, 8, 6, 4, 2)",
      "rarity": "Common"
    },
    "Faceless Joker": {
      "text": "Earn $5 if 3 or more face cards are discarded at the same time",
      "rarity": "Common"
    },
    "The Family": {
      "rarity": "Rare",
      "text": " X4 Mult if played hand contains a Four of a Kind"
    },
    "Fibonacci": {
      "rarity": "Uncommon",
      "text": "Each played Ace, 2, 3, 5, or 8 gives +8 Mult when scored"
    },
    "Flash Card": {
      "rarity": "Uncommon",
      "text": "This Joker gains +2 Mult per reroll in the shop"
    },
    "Flower Pot": {
      "rarity": "Uncommon",
      "text": " X3 Mult if poker hand contains a Diamond card, Club card, Heart card, and Spade card"
    },
    "Fortune Teller": {
      "text": "+1 Mult per Tarot card used this run",
      "rarity": "Common"
    },
    "Four Fingers": {
      "rarity": "Uncommon",
      "text": "All Flushes and Straights can be made with 4 cards"
    },
    "Gift Card": {
      "rarity": "Uncommon",
      "text": "Add $1 of sell value to every Joker and Consumable card at end of round"
    },
    "Glass Joker": {
      "rarity": "Uncommon",
      "text": "This Joker gains X0.75 Mult for every Glass Card that is destroyed"
    },
    "Gluttonous Joker": {
      "text": "Played cards with Club suit give +3 Mult when scored",
      "rarity": "Common"
    },
    "Golden Joker": {
      "text": "Earn $4 at end of round",
      "rarity": "Common"
    },
    "Greedy Joker": {
      "text": "Played cards with Diamond suit give +3 Mult when scored",
      "rarity": "Common"
    },
    "Green Joker": {
      "text": "+1 Mult per hand played, -1 Mult per discard",
      "rarity": "Common"
    },
    "Gros Michel": {
      "text": "+15 Mult, 1 in 6 chance this card is destroyed at end of round",
      "rarity": "Common"
    },
    "Hack": {
      "rarity": "Uncommon",
      "text": "Retrigger each played 2, 3, 4, or 5"
    },
    "Half Joker": {
      "text": "+20 Mult if played hand contains 3 or fewer cards",
      "rarity": "Common"
    },
    "Hallucination": {
      "text": "1 in 2 chance to create a Tarot card when any Booster Pack is opened (Must have room)",
      "rarity": "Common"
    },
    "Hanging Chad": {
      "text": "Retrigger first played card used in scoring 2 additional times",
      "rarity": "Common"
    },
    "Hiker": {
      "rarity": "Uncommon",
      "text": "Every played card permanently gains +5 Chips when scored"
    },
    "Hit the Road": {
      "rarity": "Rare",
      "text": "This Joker gains X0.5 Mult for every Jack discarded this round"
    },
    "Hologram": {
      "rarity": "Uncommon",
      "text": "This Joker gains X0.25 Mult every time a playing card is added to your deck"
    },
    "Ice Cream": {
      "text": "+100 Chips, -5 Chips for every hand played",
      "rarity": "Common"
    },
    "The Idol": {
      "rarity": "Uncommon",
      "text": "Each played [rank] of [suit] gives X2 Mult when scored, Card changes every round"
    },
    "Invisible Joker": {
      "rarity": "Rare",
      "text": "After 2 rounds, sell this card to Duplicate a random Joker"
    },
    "Joker": {
      "text": "+4 Mult",
      "rarity": "Common"
    },
    "Jolly Joker": {
      "text": "+8 Mult if played hand contains a Pair",
      "rarity": "Common"
    },
    "Juggler": {
      "text": "+1 hand size",
      "rarity": "Common"
    },
    "Loyalty Card": {
      "rarity": "Uncommon",
      "text": " X4 Mult every 6 hands played"
    },
    "Luchador": {
      "rarity": "Uncommon",
      "text": "Sell this card to disable the current Boss Blind"
    },
    "Lucky Cat": {
      "rarity": "Uncommon",
      "text": "This Joker gains X0.25 Mult every time a Lucky card successfully triggers"
    },
    "Lusty Joker": {
      "text": "Played cards with Heart suit give +3 Mult when scored",
      "rarity": "Common"
    },
    "Mad Joker": {
      "text": "+10 Mult if played hand contains a Two Pair",
      "rarity": "Common"
    },
    "Madness": {
      "rarity": "Uncommon",
      "text": "When Small Blind or Big Blind is selected, gain X0.5 Mult and destroy a random Joker"
    },
    "Mail-In Rebate": {
      "text": "Earn $5 for each discarded [rank], rank changes every round",
      "rarity": "Common"
    },
    "Marble Joker": {
      "rarity": "Uncommon",
      "text": "Adds one Stone card to deck when Blind is selected"
    },
    "Matador": {
      "rarity": "Uncommon",
      "text": "Earn $8 if played hand triggers the Boss Blind ability"
    },
    "Merry Andy": {
      "rarity": "Uncommon",
      "text": "+3 discards each round, -1 hand size"
    },
    "Midas Mask": {
      "rarity": "Uncommon",
      "text": "All played face cards become Gold cards when scored"
    },
    "Mime": {
      "rarity": "Uncommon",
      "text": "Retrigger all card held in hand abilities"
    },
    "Misprint": {
      "text": "adds a random Mult value from 0 to 23",
      "rarity": "Common"
    },
    "Mr. Bones": {
      "rarity": "Uncommon",
      "text": "Prevents Death if chips scored are at least 25% of required chips, self destructs"
    },
    "Mystic Summit": {
      "text": "+15 Mult when 0 discards remaining",
      "rarity": "Common"
    },
    "Obelisk": {
      "rarity": "Rare",
      "text": "This Joker gains X0.2 Mult per consecutive hand played without playing your most played poker hand"
    },
    "Odd Todd": {
      "text": "Played cards with odd rank give +31 Chips when scored (A, 9, 7, 5, 3)",
      "rarity": "Common"
    },
    "Onyx Agate": {
      "rarity": "Uncommon",
      "text": "Played cards with Club suit give +7 Mult when scored"
    },
    "Oops! All 6s": {
      "rarity": "Uncommon",
      "text": "Doubles all listed probabilities (ex: 1 in 3 -> 2 in 3)"
    },
    "The Order": {
      "rarity": "Rare",
      "text": " X3 Mult if played hand contains a Straight"
    },
    "Pareidolia": {
      "rarity": "Uncommon",
      "text": "All cards are considered face cards"
    },
    "Perkeo": {
      "rarity": "Legendary",
      "text": "Creates a Negative copy of 1 random consumable card in your possession at the end of the shop"
    },
    "Photograph": {
      "text": "First played face card gives X2 Mult when scored",
      "rarity": "Common"
    },
    "Popcorn": {
      "text": "+20 Mult -4 Mult per round played",
      "rarity": "Common"
    },
    "Raised Fist": {
      "text": "Adds double the rank of lowest ranked card held in hand to Mult",
      "rarity": "Common"
    },
    "Ramen": {
      "rarity": "Uncommon",
      "text": " X2 Mult, loses X0.01 Mult per card discarded"
    },
    "Red Card": {
      "text": "This Joker gains +3 Mult when any Booster Pack is skipped",
      "rarity": "Common"
    },
    "Reserved Parking": {
      "text": "Each face card held in hand has a 1 in 2 chance to give $1",
      "rarity": "Common"
    },
    "Ride the Bus": {
      "text": "This Joker gains +1 Mult per consecutive hand played without a scoring face card",
      "rarity": "Common"
    },
    "Riff-Raff": {
      "text": "When Blind is selected, create 2 Common Jokers (Must have room)",
      "rarity": "Common"
    },
    "Showman": {
      "rarity": "Uncommon",
      "text": "Joker, Tarot, Planet, and Spectral cards may appear multiple times"
    },
    "Rocket": {
      "rarity": "Uncommon",
      "text": "Earn $1 at end of round. Payout increases by $2 when Boss Blind is defeated"
    },
    "Rough Gem": {
      "rarity": "Uncommon",
      "text": "Played cards with Diamond suit earn $1 when scored"
    },
    "Runner": {
      "text": "Gains +15 Chips if played hand contains a Straight",
      "rarity": "Common"
    },
    "Satellite": {
      "rarity": "Uncommon",
      "text": "Earn $1 at end of round per unique Planet card used this run"
    },
    "Scary Face": {
      "text": "Played face cards give +30 Chips when scored",
      "rarity": "Common"
    },
    "Scholar": {
      "text": "Played Aces give +20 Chips and +4 Mult when scored",
      "rarity": "Common"
    },
    "Séance": {
      "rarity": "Uncommon",
      "text": "If poker hand is a Straight Flush, create a random Spectral card (Must have room)"
    },
    "Seeing Double": {
      "rarity": "Uncommon",
      "text": " X2 Mult if played hand has a scoring Club card and a scoring card of any other suit"
    },
    "Seltzer": {
      "rarity": "Uncommon",
      "text": "Retrigger all cards played for the next 10 hands"
    },
    "Shoot the Moon": {
      "text": "Each Queen held in hand gives +13 Mult",
      "rarity": "Common"
    },
    "Shortcut": {
      "rarity": "Uncommon",
      "text": "Allows Straights to be made with gaps of 1 rank (ex: 10 8 6 5 3)"
    },
    "Sixth Sense": {
      "rarity": "Uncommon",
      "text": "If first hand of round is a single 6, destroy it and create a Spectral card (Must have room)"
    },
    "Sly Joker": {
      "text": "+50 Chips if played hand contains a Pair",
      "rarity": "Common"
    },
    "Smeared Joker": {
      "rarity": "Uncommon",
      "text": "Hearts and Diamonds count as the same suit, Spades and Clubs count as the same suit"
    },
    "Smiley Face": {
      "text": "Played face cards give +5 Mult when scored",
      "rarity": "Common"
    },
    "Sock and Buskin": {
      "rarity": "Uncommon",
      "text": "Retrigger all played face cards"
    },
    "Space Joker": {
      "rarity": "Uncommon",
      "text": "1 in 4 chance to upgrade level of played poker hand"
    },
    "Splash": {
      "text": "Every played card counts in scoring",
      "rarity": "Common"
    },
    "Square Joker": {
      "text": "This Joker gains +4 Chips if played hand has exactly 4 cards",
      "rarity": "Common"
    },
    "Steel Joker": {
      "rarity": "Uncommon",
      "text": "Gives X0.2 Mult for each Steel Card in your full deck"
    },
    "Joker Stencil": {
      "rarity": "Uncommon",
      "text": " X1 Mult for each empty Joker slot, Joker Stencil included"
    },
    "Stone Joker": {
      "rarity": "Uncommon",
      "text": "Gives +25 Chips for each Stone Card in your full deck"
    },
    "Stuntman": {
      "rarity": "Rare",
      "text": "+250 Chips, -2 hand size"
    },
    "Supernova": {
      "text": "Adds the number of times poker hand has been played this run to Mult",
      "rarity": "Common"
    },
    "Superposition": {
      "text": "Create a Tarot card if poker hand contains an Ace and a Straight (Must have room)",
      "rarity": "Common"
    },
    "Swashbuckler": {
      "text": "Adds the sell value of all other owned Jokers to Mult",
      "rarity": "Common"
    },
    "Throwback": {
      "rarity": "Uncommon",
      "text": " X0.25 Mult for each Blind skipped this run"
    },
    "Golden Ticket": {
      "text": "Played Gold cards earn $4 when scored",
      "rarity": "Common"
    },
    "To the Moon": {
      "rarity": "Uncommon",
      "text": "Earn an extra $1 of interest for every $5 you have at end of round"
    },
    "To Do List": {
      "text": "Earn $4 if poker hand is a [poker hand], poker hand changes at end of round",
      "rarity": "Common"
    },
    "Trading Card": {
      "rarity": "Uncommon",
      "text": "If first discard of round has only 1 card, destroy it and earn $3"
    },
    "The Tribe": {
      "rarity": "Rare",
      "text": "X2 Mult if played hand contains a Flush"
    },
    "Triboulet": {
      "rarity": "Legendary",
      "text": "Played Kings and Queens each give X2 Mult when scored"
    },
    "The Trio": {
      "rarity": "Rare",
      "text": "X3 Mult if played hand contains a Three of a Kind"
    },
    "Troubadour": {
      "rarity": "Uncommon",
      "text": "+2 hand size, -1 hand each round"
    },
    "Spare Trousers": {
      "rarity": "Uncommon",
      "text": "This Joker gains +2 Mult if played hand contains a Two Pair"
    },
    "Turtle Bean": {
      "rarity": "Uncommon",
      "text": "+5 hand size, reduces by 1 every round"
    },
    "Vagabond": {
      "rarity": "Rare",
      "text": "Create a Tarot card if hand is played with $4 or less"
    },
    "Vampire": {
      "rarity": "Uncommon",
      "text": "This Joker gains X0.1 Mult per scoring Enhanced card played, removes card Enhancement"
    },
    "Walkie Talkie": {
      "text": "Each played 10 or 4 gives +10 Chips and +4 Mult when scored",
      "rarity": "Common"
    },
    "Wee Joker": {
      "rarity": "Rare",
      "text": "This Joker gains +8 Chips when each played 2 is scored"
    },
    "Wily Joker": {
      "text": "+100 Chips if played hand contains a Three of a Kind",
      "rarity": "Common"
    },
    "Wrathful Joker": {
      "text": "Played cards with Spade suit give +3 Mult when scored",
      "rarity": "Common"
    },
    "Yorick": {
      "rarity": "Legendary",
      "text": "This Joker gains X1 Mult every 23 cards discarded"
    },
    "Zany Joker": {
      "text": "+12 Mult if played hand contains a Three of a Kind",
      "rarity": "Common"
    }
};

const bossBlinds = [
  {
      "name": "The Hook",
      "debuff": "Discards 2 random\ncards per hand played",
      "minimumAnte": 1,
      "scoreMult": 2n,
      "primaryColor": "#9f2909",
      "primaryShadow": "#651200",
      "secondaryColor": "#522a1e",
      "tertiaryColor": "#372a25"
  },
  {
      "name": "The Ox",
      "debuff": "Playing a (most played hand)\nsets money to $0",
      "minimumAnte": 6,
      "scoreMult": 2n,
      "primaryColor": "#b24700",
      "primaryShadow": "#732700",
      "secondaryColor": "#3c301f",
      "tertiaryColor": "#5a3612"
  },
  {
      "name": "The House",
      "debuff": "First hand is\ndrawn face down",
      "minimumAnte": 2,
      "scoreMult": 2n,
      "primaryColor": "#3c789f",
      "primaryShadow": "#1f4a65",
      "secondaryColor": "#243a44",
      "tertiaryColor": "#2a4a5b"
  },
  {
      "name": "The Wall",
      "debuff": "Extra large blind",
      "minimumAnte": 2,
      "scoreMult": 4n,
      "primaryColor": "#7d459c",
      "primaryShadow": "#4d2663",
      "secondaryColor": "#302f43",
      "tertiaryColor": "#443558"
  },
  {
      "name": "The Wheel",
      "debuff": "1 in 7 cards get\ndrawn face down",
      "minimumAnte": 2,
      "scoreMult": 2n,
      "primaryColor": "#3bb96d",
      "primaryShadow": "#1f7742",
      "secondaryColor": "#24473a",
      "tertiaryColor": "#2a6446"
  },
  {
      "name": "The Arm",
      "debuff": "Decrease level of\nplayed poker hand",
      "minimumAnte": 2,
      "scoreMult": 2n,
      "primaryColor": "#5653f5",
      "primaryShadow": "#322fa1",
      "secondaryColor": "#293355",
      "tertiaryColor": "#343b7d"
  },
  {
      "name": "The Club",
      "debuff": "All Club cards\nare debuffed",
      "minimumAnte": 1,
      "scoreMult": 2n,
      "primaryColor": "#b2c786",
      "primaryShadow": "#738154",
      "secondaryColor": "#3c4a3e",
      "tertiaryColor": "#5a6850"
  },
  {
      "name": "The Fish",
      "debuff": "Cards drawn face down\nafter each hand played",
      "minimumAnte": 2,
      "scoreMult": 2n,
      "primaryColor": "#2677b7",
      "primaryShadow": "#114a76",
      "secondaryColor": "#1f3a48",
      "tertiaryColor": "#214864"
  },
  {
      "name": "The Psychic",
      "debuff": "Must play 5 cards",
      "minimumAnte": 1,
      "scoreMult": 2n,
      "primaryColor": "#f0ba24",
      "primaryShadow": "#9e780f",
      "secondaryColor": "#47472b",
      "tertiaryColor": "#716429"
  },
  {
      "name": "The Goad",
      "debuff": "All Spade cards\nare debuffed",
      "minimumAnte": 1,
      "scoreMult": 2n,
      "primaryColor": "#b2488b",
      "primaryShadow": "#732957",
      "secondaryColor": "#3c303f",
      "tertiaryColor": "#5a3652"
  },
  {
      "name": "The Water",
      "debuff": "Start with\n0 discards",
      "minimumAnte": 2,
      "scoreMult": 2n,
      "primaryColor": "#c1dfec",
      "primaryShadow": "#7d919b",
      "secondaryColor": "#3e4e53",
      "tertiaryColor": "#5f7378"
  },
  {
      "name": "The Window",
      "debuff": "All Diamond cards\nare debuffed",
      "minimumAnte": 1,
      "scoreMult": 2n,
      "primaryColor": "#a09889",
      "primaryShadow": "#666056",
      "secondaryColor": "#37403f",
      "tertiaryColor": "#525652"
  },
  {
      "name": "The Manacle",
      "debuff": "-1 Hand Size",
      "minimumAnte": 1,
      "scoreMult": 2n,
      "primaryColor": "#434343",
      "primaryShadow": "#242424",
      "secondaryColor": "#252f30",
      "tertiaryColor": "#2c3435"
  },
  {
      "name": "The Eye",
      "debuff": "No repeat hand\ntypes this round",
      "minimumAnte": 3,
      "scoreMult": 2n,
      "primaryColor": "#3560e3",
      "primaryShadow": "#1b3a95",
      "secondaryColor": "#233552",
      "tertiaryColor": "#273f76"
  },
  {
      "name": "The Mouth",
      "debuff": "Play only 1 hand\ntype this round",
      "minimumAnte": 2,
      "scoreMult": 2n,
      "primaryColor": "#a66081",
      "primaryShadow": "#6a3a50",
      "secondaryColor": "#39353d",
      "tertiaryColor": "#543f4e"
  },
  {
      "name": "The Plant",
      "debuff": "All face cards\nare debuffed",
      "minimumAnte": 4,
      "scoreMult": 2n,
      "primaryColor": "#5f8676",
      "primaryShadow": "#395448",
      "secondaryColor": "#2b3d3b",
      "tertiaryColor": "#374f4a"
  },
  {
      "name": "The Serpent",
      "debuff": "After Play or Discard,\nalways draw 3 cards",
      "minimumAnte": 5,
      "scoreMult": 2n,
      "primaryColor": "#2c8f3a",
      "primaryShadow": "#145a1e",
      "secondaryColor": "#213e2f",
      "tertiaryColor": "#235332"
  },
  {
      "name": "The Pillar",
      "debuff": "Cards played previously\nthis Ante are debuffed",
      "minimumAnte": 1,
      "scoreMult": 2n,
      "primaryColor": "#6f553d",
      "primaryShadow": "#443221",
      "secondaryColor": "#2e332f",
      "tertiaryColor": "#3e3b33"
  },
  {
      "name": "The Needle",
      "debuff": "Play only 1 hand",
      "minimumAnte": 2,
      "scoreMult": 1n,
      "primaryColor": "#485d17",
      "primaryShadow": "#293706",
      "secondaryColor": "#263429",
      "tertiaryColor": "#2e3e24"
  },
  {
      "name": "The Head",
      "debuff": "All Heart cards\nare debuffed",
      "minimumAnte": 1,
      "scoreMult": 2n,
      "primaryColor": "#a493ad",
      "primaryShadow": "#685c6f",
      "secondaryColor": "#393f46",
      "tertiaryColor": "#53545f"
  },
  {
      "name": "The Tooth",
      "debuff": "Lose $1 per\ncard played",
      "minimumAnte": 3,
      "scoreMult": 2n,
      "primaryColor": "#ae1313",
      "primaryShadow": "#6f0303",
      "secondaryColor": "#3b2527",
      "tertiaryColor": "#572122"
  },
  {
      "name": "The Flint",
      "debuff": "Base Chips and\nMult are halved",
      "minimumAnte": 2,
      "scoreMult": 2n,
      "primaryColor": "#e55815",
      "primaryShadow": "#963404",
      "secondaryColor": "#453427",
      "tertiaryColor": "#6d3d23"
  },
  {
      "name": "The Mark",
      "debuff": "All face cards are\ndrawn face down",
      "minimumAnte": 2,
      "scoreMult": 2n,
      "primaryColor": "#581f30",
      "primaryShadow": "#293706",
      "secondaryColor": "#2a292d",
      "tertiaryColor": "#35262e"
  }
]

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
        "blindBases": [300n, 800n, 2000n, 5000n, 11000n, 20000n, 35000n, 50000n],
        "unlockedSecretHands": [],
        "handLevels": {
          "High Card": 1n,
          "Pair": 1n,
          "Two Pair": 1n,
          "Three of a Kind": 1n,
          "Straight": 1n,
          "Flush": 1n,
          "Full House": 1n,
          "Four of a Kind": 1n,
          "Straight Flush": 1n,
          "Five of a Kind": 1n,
          "Flush House": 1n,
          "Flush Five": 1n
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
        "bannedCards": []
    };

    // Fill default deck
    game.deckCards = cards["Playing Card"];



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
    let allowedBlinds = gameState.blinds.filter(blind => blind.minimumAnte <= gameState.blind && !gameState.seenBlinds.includes(blind.name) && !gameState.bannedBlinds.includes(blind.name));
    if (allowedBlinds.length < 1) {
        gameState.seenBlinds = [];
        allowedBlinds = gameState.blinds.filter(blind => blind.minimumAnte <= gameState.blind && !gameState.bannedBlinds.includes(blind.name));
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

function powBigInt(base, exp) {
    let result = 1n;
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

  switch (voucher.toLowerCase().replace(" ", "")) {
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

function newCard(gameState, cardType) {
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
      } while (jokersOfRarity.length != 0 && !jokerNames.includes("showman") && jokerNames.includes(card.name));
    } else if (cardType == "Planet Card") {
      do {
        const pokerHand = Object.keys(pokerHands)[Math.floor(Math.random() * Object.keys(pokerHands).length)];
        card = {name: pokerHands[pokerHand].planet, handType: pokerHand}
      } while (!pokerHands[card.handType].unlocked && !gameState.unlockedSecretHands.includes(card.handType));
    } else {
      let remainingCards = cards[cardType];
      if (cardType != "Playing Cards") {
        const newCards = remainingCards.filter(card => !gameState.consumables.map(card => card.name).includes(card.name));
        remainingCards = newCards.length < 1 ? remainingCards : newCards;
      }
      card = remainingCards[Math.floor(Math.random() * remainingCards.length)];
    }
  } while (gameState.bannedCards.includes(card.name));
  if (cardType == "Spectral Card" || cardType == "Tarot Card" || cardType == "Planet Card") return card;
  if (cardType == "Playing Card") {
    const hasEdition = Math.random() <= gameState.shopWeights["Playing Card"].edition / 100;
    const hasEnhancement = Math.random() <= gameState.shopWeights["Playing Card"].enhancement / 100;
    const hasSeal = Math.random() <= 0.2;

    if (hasEdition) {
      card.edition = pickByPercentage(gameState.editions, "playingCardOdds");
    }
    if (hasEnhancement) {
      card.enhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
    }
    if (hasSeal) {
      card.seal = seals[Math.floor(Math.random() * seals.length)];
    }
  }
  if (cardType == "Joker") {
    card.edition = pickByPercentage(gameState.editions);
  }
}

function fillCards(gameState) {
  while (gameState.shop.cards.length < gameState.shopSlots) {
    const cardType = pickWeightedRandom(shopWeights);
    newCard(gameState, cardType);
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
    if (gameState.tags[i].toLowerCase().replace(" ", "") == "vouchertag") {
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

module.export = {
    newGame,
    rerollShop
}