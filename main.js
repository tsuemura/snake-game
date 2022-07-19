const rowCount = 15;
const colCount = 15;

let board = [...Array(rowCount)].map(() => [...Array(colCount)].map(() => 0));
let state = {
  me: [
    { x: 3, y: 4 },
    { x: 3, y: 3 },
    { x: 3, y: 2 }
  ],
  feeds: [{ x: 6, y: 7 }],
  d: "down",
  gameover: false
};

const flushBoard = () => {
  board = board.map((row) => row.map(() => 0));
};

const render = () => {
  flushBoard();
  let color = state.gameover ? 1 : 2;
  state.me.map((me) => {
    board[me.y][me.x] = color;
    return me;
  });
  state.feeds.map((feed) => {
    board[feed.y][feed.x] = 3;
    return feed;
  });
  showBoard();
};

const eat = (head) => {
  const index = state.feeds.findIndex(
    (feed) => feed.x === head.x && feed.y === head.y
  );
  if (index === -1) {
    return false;
  }
  state.feeds.splice(index, 1);
  putFeed();
  return true;
};

const putFeed = () => {
  const coord = {
    x: Math.trunc(Math.random() * colCount),
    y: Math.trunc(Math.random() * rowCount)
  };
  if (board[coord.y][coord.x]) {
    putFeed();
  } else {
    state.feeds.push(coord);
  }
};

const showBoard = () => {
  if (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }

  board.map((row, y) => {
    row.map((col, x) => {
      let edgeColor = "#888";
      let bgColor = `#ccc`;
      if (col) {
        bgColor = `hsl(${((col - 1) / 7) * 360}deg, 100%, 50%)`;
        edgeColor = `hsl(${((col - 1) / 7) * 360}deg, 100%, 75%)`;
      }
      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.width = "24px";
      div.style.height = "24px";
      div.style.boxSizing = "border-box";
      div.style.top = `${y * 24}px`;
      div.style.left = `${x * 24}px`;
      div.style.border = `4px ridge ${edgeColor}`;
      div.style.background = bgColor;
      document.body.appendChild(div);
    });
  });
};

const gameover = () => {
  state.gameover = true;
};

const colision = (dest) => {
  return state.me
    .slice(1)
    .find((body) => body.x === dest.x && body.y === dest.y);
};

const isOutOfBoard = (coord) =>
  coord.x < 0 || coord.x >= colCount || coord.y < 0 || coord.y >= rowCount;

const move = () => {
  const head = state.me[0];
  const dest = {
    x: head.x,
    y: head.y
  };

  switch (state.d) {
    case "up":
      dest.y -= 1;
      break;
    case "down":
      dest.y += 1;
      break;
    case "left":
      dest.x -= 1;
      break;
    case "right":
      dest.x += 1;
      break;
    default:
      break;
  }

  if (!eat(dest)) {
    state.me.pop();
  }
  if (isOutOfBoard(dest) || colision(dest)) {
    gameover();
    showBoard();
    return;
  }
  state.me.unshift(dest);
};

window.move = move;

window.onload = () => {
  document.onkeydown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        state.d = "down";
        break;
      case "ArrowUp":
        state.d = "up";
        break;
      case "ArrowLeft":
        state.d = "left";
        break;
      case "ArrowRight":
        state.d = "right";
        break;
      default:
        break;
    }
    e.preventDefault();
  };
  setInterval(() => {
    if (state.gameover) return;
    move();
    render();
  }, 500);
  console.log("about to call render");
  render();
};
