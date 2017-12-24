const EPSILON = .1;
const ALPHA = .5;
const GAMMA = .1;

class State {
  constructor(x, y, reward) {
    this.x = x;
    this.y = y;
    this.reward = reward;

    this.actions = {
      N: { value: 0, x: 0, y: 1 },
      NE: { value: 0, x: 1, y: 1 },
      E: { value: 0, x: 1, y: 0 },
      SE: { value: 0, x: 1, y: -1 },
      S: { value: 0, x: 0, y: -1 },
      SW: { value: 0, x: -1, y: -1 },
      W: { value: 0, x: -1, y: 0 },
      NW: { value: 0, x: -1, y: 1 },
    }

    if (x == 0) {
      delete this.actions.W;
      delete this.actions.NW;
      delete this.actions.SW;
    } else if (x == 9) {
      delete this.actions.E;
      delete this.actions.NE;
      delete this.actions.SE;
    }

    if (y == 0) {
      delete this.actions.S;
      delete this.actions.SE;
      delete this.actions.SW;
    } else if (y == 6) {
      delete this.actions.N;
      delete this.actions.NE;
      delete this.actions.NW;
    }
  }

  getAction() {
    if (Math.random() <= EPSILON) {
      const max = Object.keys(this.actions).length;
      const index = Math.floor(Math.random() * max);
      return this.actions[Object.keys(this.actions)[index]];
    } else {
      let maxactions = [];
      for (const key in this.actions) {
        const action = this.actions[key];
        if (maxactions.length == 0 || action.value == maxactions[0].value) {
          maxactions.push(action);
        } else if (action.value > maxactions[0].value) {
          maxactions = [action];
        }
      }

      const max = Object.keys(maxactions.length);
      const index = Math.floor(Math.random() * max);
      return maxactions[index];
    }
  }

  printActions() {
    console.log(this.actions);
  }
}

const wind = new Array(10).fill(0);
wind[3] = 1;
wind[4] = 1;
wind[5] = 1;
wind[6] = 2;
wind[7] = 2;
wind[8] = 1;
const board = [];
for (let i = 0; i != 10; i++) {
  board.push(new Array(7));
  for (let j = 0; j != 7; j++) {
    board[i][j] = new State(i, j, -1);
  }
}
board[7][3].reward = 0;

let statesvisited = [];
let sasvisited = [];
const playEpisode = n => {
  let currstate = board[0][3];
  let curraction = currstate.getAction();
  let i = 0;
  while (currstate.reward == -1) {
    statesvisited.push(currstate);
    const nextx = currstate.x + curraction.x;
    let nexty = currstate.y + curraction.y;
    let windeffect = wind[currstate.x];
    if (windeffect > 0) {
      const windrand = Math.random();
      if (windrand > .66) {
        windeffect++;
      } else if (windrand > .33) {
        windeffect--;
      }
    }
    nexty += windeffect;
    nexty = nexty > 6 ? 6 : nexty;

    const nextstate = board[nextx][nexty];
    const nextaction = nextstate.getAction();
    curraction.value = curraction.value + ALPHA*(nextstate.reward + GAMMA*nextaction.value - curraction.value);
    currstate = nextstate;
    curraction = nextaction;
    i++;
  }
  return i;
}

let j = 0;
while(playEpisode(4) > 7 && j < 0) {
  statesvisited = [];
  sasvisited = [];
  j++;
}
console.log(statesvisited, statesvisited.length);
//console.log(j);
