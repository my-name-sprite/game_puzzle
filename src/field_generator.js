let isPause = false;
function generateField (){
  const board = document.createElement('div');
  board.classList.add('game__board');
  document.body.prepend(board);

  const header = document.createElement('header');
  const time = document.createElement('div');
  time.classList.add('time');
  header.append(time);
  const moves = document.createElement('div');
  moves.classList.add('moves');
  header.append(moves);
  const pause = document.createElement('div');
  pause.classList.add('pause');
  pause.innerText = 'Pause game';
  header.append(pause);
  document.body.prepend(header);

  const pauseMenu = document.createElement('div');
  pauseMenu.classList.add('menu');
  pauseMenu.innerHTML = `
  <div class="screen__menu main" data-name="main">
    <div class="message">
      <p class="text">Do you want to</p>
      <button class="btn" style="text-decoration: underline;" data-target="save">save your game?</button>
    </div>
    <button class="btn">New Game</button>
    <button class="btn" data-target="saved">Saved Games</button>
    <button class="btn" data-target="score">Best Score</button>
    <button class="btn" data-target="rules">Rules</button>
    <button class="btn" data-target="settings">Settings</button>
  </div>
  <div class="screen__menu save" data-name="saved">
    <h2> Saved games: </h2>
    <div class="save__properties">
      <p class="text" style="width: 60px; text-align: center;">№</p>
      <p class="text" style="width: 60px; text-align: center;">Moves</p>
      <p class="text" style="width: 60px; text-align: center;">Time</p>
      <p class="text" style="width: 60px; text-align: center;">Size</p>
      <p class="text" style="width: 60px; text-align: center;">Load</p>
    </div>
    <div class="saved__list">
    </div>
    <button class="btn back" data-target="main">Back</button>
  </div>
  <div class="screen__menu score" data-name="score">
    <h2> Best Score </h2>
    <div class="score__properties">
      <p class="text" style="width: 60px; text-align: center;">№</p>
      <p class="text" style="width: 60px; text-align: center;">Moves</p>
      <p class="text" style="width: 60px; text-align: center;">Time</p>
      <p class="text" style="width: 60px; text-align: center;">Size</p>
    </div>
    <div class="best__scores">
    </div>
    <button class="btn back" data-target="main">Back</button>
  </div>
    <div class="screen__menu rules" data-name="rules">
    <h2 class="title">Rules: </h2>
    <p class="description">The object of the puzzle is to place the tiles in order by making sliding moves that use the empty space.<br><br>
      You can save your game and load it later. Or you can just use pause button. Also you can choose game field size of color in Settings</p>
    <button class="btn back" data-target="main">Back</button>
  </div>
  <div class="screen__menu settings" data-name="settings">
    <h2 class="title">Settings: </h2>
    <label class="text">Field size:</label>
    <select class="select__size">
      <option value="3" class="option">3x3</option>
      <option value="4" class="option">4x4</option>
      <option value="5" class="option">5x5</option>
      <option value="6" class="option">6x6</option>
      <option value="7" class="option">7x7</option>
      <option value="8" class="option">8x8</option>
    </select>
    <button class="btn back" data-target="main">Back</button>
  </div>
  <div class="screen__menu win" data-name="win">
    <button class="btn back" data-target="main">Back</button>
  </div>`;
  board.append(pauseMenu);

  pause.addEventListener('click', ()=>{
    isPause = !isPause;
    pause.innerText = isPause ? 'Resume game' : 'Pause game';
    let menu = document.body.querySelector('.game__board').querySelector('.menu');
    menu.classList.toggle('visible');
    menu.querySelector('.screen__menu').classList.toggle('visible');
    Array.from(board.querySelectorAll('.cell')).forEach(el => {
      el.style.pointerEvents = isPause ? 'none' : 'all';
      el.style.opacity = isPause ? 0.5 : 1;
    });
  });

  let butt = document.createElement('button');
  butt.classList.add('button', 'to__images');
  butt.innerText = 'Swap to images';
  document.body.prepend(butt);
}

export { generateField, isPause };
