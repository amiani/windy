const EPSILON = .1;
const ALPHA = .5;
const GAMMA = .1;

class State {
  constructor(x, y, reward) {
    this.x = x;
    this.y = y;
    this.reward = reward;

    this.actions = {
      N: { value: 0, x: 0, y: 1, reward, },//visitedcount: 0 },
      NE: { value: 0, x: 1, y: 1, reward, },//visitedcount: 0 },
      E: { value: 0, x: 1, y: 0, reward, },//visitedcount: 0 },
      SE: { value: 0, x: 1, y: -1, reward, },//visitedcount: 0 },
      S: { value: 0, x: 0, y: -1, reward, },//visitedcount: 0 },
      SW: { value: 0, x: -1, y: -1, reward, },//visitedcount: 0 },
      W: { value: 0, x: -1, y: 0, reward, },//visitedcount: 0 },
      NW: { value: 0, x: -1, y: 1, reward, },//visitedcount: 0 },
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

board[7][2].actions.N.reward = 0;
board[7][4].actions.S.reward = 0;
board[6][3].actions.E.reward = 0;
board[8][3].actions.W.reward = 0;

board[6][2].actions.NE.reward = 0;
board[6][4].actions.SE.reward = 0;
board[8][2].actions.NE.reward = 0;
board[8][4].actions.SW.reward = 0;

let statesvisited = [];
let sasvisited = [];
const playEpisode = n => {
  let currstate = board[0][3];
  let curraction = currstate.getAction();
  statesvisited.push(currstate);
  sasvisited.push(curraction);
  let t = 0;

  let test = 'run';
  while (currstate.reward == -1 && test == 'run') {
    //curraction.visitedcount++;
    //console.log(`currstate x:${currstate.x}, y:${currstate.y}`);
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

    if (t >= n) {
      //console.log(statesvisited);
      const Gtn = sasvisited.slice(t-n+2, t).reduce((acc, curr, i, arr) => {
        const rewardestimate = i == arr.length - 1 ? curr.value : curr.reward;
        //console.log('rewardestimate', rewardestimate);
        //console.log('rewardestimate', rewardestimate);
        return acc + Math.pow(GAMMA, i) * rewardestimate;
      }, 0);
      let subjectaction = sasvisited[t-n+1];
      //console.log(subjectvalue);
      //console.log(Gtn);
      subjectaction.value = subjectaction.value + ALPHA*(Gtn - subjectaction.value);
      /*
      if (subjectaction.value < 0) {
        console.log('subjectvalue:' , subjectaction.value);
        console.log(currstate);
        console.log(sasvisited[t-n+1]);
      }
      */
    }

    t++;
    currstate = board[nextx][nexty];
    statesvisited.push(currstate);
    curraction = currstate.getAction();
    sasvisited.push(curraction);
  }

  //we don't have to consider the reward for the termination state since it is 0
  const lastsas = sasvisited.slice(t-n+2, -1);
  lastsas.forEach((sa, i) => {
    sa.value = sa.value + ALPHA * lastsas.slice(i+1).reduce((acc, curr) => acc + curr.reward, 0) 
  });

  console.log(t);
  return t;
}

let meanepisodes = 0;
for (let i = 1; i <= 1; i++) {
  let episodecount = 0;
  let lastepisodes = [0, 0, 0];
  for (; lastepisodes.; episodecount++) {
    lastepisodesplayEpisode(4);
    //console.log('episode finished');
    //statesvisited.forEach(state => { console.log(`x: ${state.x}, y:${state.y}`); state.printActions(); });
    statesvisited = [];
    sasvisited = [];
  }
  meanepisodes = (i * meanepisodes + episodecount) / i;
  console.log(episodecount);
  //playEpisode(4);
  //console.log(statesvisited);
  //console.log(sasvisited);
  //statesvisited.forEach(state => { console.log(`x: ${state.x}, y:${state.y}`); state.printActions(); });
}
console.log(meanepisodes);
