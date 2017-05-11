import invertedIndex from '../src/inverted-index';

invertedIndex.createIndex('book1.json', invertedIndex.validateFile('book1.json'));
invertedIndex.createIndex('book2.json', invertedIndex.validateFile('book2.json'));

const expectedResult = {
  createdBookIndex: {
    'book1.json': {
      accept: [1],
      as: [1],
      best: [0],
      brown: [0],
      campbell: [1],
      doing: [0],
      for: [0, 1],
      go: [1],
      have: [1],
      is: [0, 1],
      jackson: [0],
      joseph: [1],
      let: [1],
      life: [1],
      must: [1],
      of: [1],
      one: [1],
      preparation: [0],
      so: [1],
      that: [1],
      the: [0, 1],
      to: [1],
      today: [0],
      tomorrow: [0],
      us: [1],
      waiting: [1],
      we: [1],
      your: [0]
    },
    'book2.json': {
      also: [1],
      an: [0],
      first: [1],
      from: [1],
      help: [0, 1],
      inquiry: [0],
      into: [0],
      is: [1],
      nations: [0],
      of: [0],
      problem: [0, 1],
      seeks: [0],
      set: [0, 1],
      string: [0, 1],
      the: [0, 1],
      third: [1],
      this: [0, 1],
      to: [0, 1],
      understand: [0, 1],
      wealth: [0],
      world: [1],
      you: [0, 1]
    }
  }
};

export default expectedResult;
