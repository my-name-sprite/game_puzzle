import { genValues, cellSize } from './util.js';
import { createElements, counter, cells, emptyCell, move } from './create_elements.js';
import { timeCounter, count, swapFieldSize, cellAmount, fieldSize } from './util';
import { getTime } from './script.js';
import { isPause } from './field_generator.js';

let save = JSON.parse(localStorage.getItem('save')) ? JSON.parse(localStorage.getItem('save')) : [];
let loaded = false;
let saveIndex;

function addListeners(){
  const menuPause = document.querySelector('.menu');
  const menuScreens = menuPause.querySelectorAll('.screen__menu');
  let screensArray = Array.from(menuScreens);
  for(let i = 0; i < screensArray.length; i++){
    let screen = screensArray[i];
    let buttons;
    switch(screen.dataset.name){
    case 'main':
      buttons = Array.from(screen.querySelectorAll('.btn'));
      for(let j = 0; j < buttons.length; j++){
        let butt = buttons[j];
        switch(butt.dataset.target){
        case 'saved':
          let saveHolder =  menuPause.querySelector('.save').querySelector('.saved__list');
          let savedGames = JSON.parse(localStorage.getItem('save'));
          function saveHandler(event){
            loaded = true;
            let chosenSave = savedGames[event.target.dataset.index];
            let field = document.querySelector('.game__board');
            field.innerHTML = chosenSave.field;
            localStorage.setItem('size', chosenSave.fieldSize);
            fieldSize = localStorage.getItem('size');
            document.body.querySelector('.time').innerHTML = `Time: ${chosenSave.time.min}:${chosenSave.time.sec}`;
            document.body.querySelector('.moves').innerHTML = `Moves: ${chosenSave.moves}`;
            let cells = chosenSave.cells;
            let loadedCells = Array.from(field.querySelectorAll('.cell'));
            let zeroCell = field.querySelector('.cell--empty');
            saveIndex = chosenSave.index;
            addListeners();
            cells.forEach(item => {
              loadedCells.forEach(cell =>{
                if(parseFloat(cell.innerText) === item.value)
                  item.element = cell;
              });
              if(item.value === 0){
                zeroCell.style.left = item.left*cellSize - cellSize +'px';
                zeroCell.style.top = item.top*cellSize - cellSize +'px';
                emptyCell.left = item.left;
                emptyCell.top = item.top;
              }
            });
            loadedCells.forEach(cell => cell.onmousedown = (event) => {
              let down = Date.now();
              let shiftX = event.clientX - cell.getBoundingClientRect().left;
              let shiftY = event.clientY - cell.getBoundingClientRect().top;
              cell.style.transition = 'none';
              cell.style.zIndex = 1000;
              const prevSibling = cell.previousElementSibling;
              document.body.append(cell);
              moveAt(event.pageX, event.pageY);

              function moveAt(posX, posY){
                cell.style.left = posX - shiftX + 'px';
                cell.style.top = posY - shiftY + 'px';
              }

              function onMouseMove(event){
                moveAt(event.pageX, event.pageY);
              }

              document.addEventListener('mousemove', onMouseMove);
              cell.onmouseup = () =>{
                let c;
                cells.forEach(el => {if(el.value === parseFloat(cell.innerText)) c = el;});
                let diff = Date.now() - down;
                cell.style.zIndex = 1;
                if(diff < 200){
                  c.element.style.transition = 'all 0.3s';
                  c.element.style.left = c.left * cellSize - cellSize + 'px';
                  c.element.style.top = c.top * cellSize - cellSize + 'px';
                  prevSibling.after(cell);
                  move(cells.indexOf(c), field, cells);
                  document.removeEventListener('mousemove', onMouseMove);
                }
                else{
                  document.removeEventListener('mousemove', onMouseMove);
                  let left = Math.abs(field.offsetLeft - parseFloat(cell.style.left.split('px')));
                  let top = Math.abs(field.offsetTop - parseFloat(cell.style.top.split('px')));
                  prevSibling.after(cell);
                  if((Math.abs(emptyCell.left*cellSize - cellSize - left) <= 25 && Math.abs(emptyCell.top*cellSize - cellSize  - top ) <= 25))
                    move(cells.indexOf(c), field, cells);
                  else{
                    cell.style.left = c.left * cellSize - cellSize + 'px';
                    cell.style.top = c.top * cellSize - cellSize + 'px';
                  }
                  cell.onmouseup = null;
                }
                cell.ondragstart = ()=>{
                  return false;
                };
              };
            });
          }
          butt.addEventListener('click', ()=>{
            screensArray.forEach(el => {
              if (el.dataset.name === 'main')
              el.classList.toggle('visible');
              if (el.dataset.name === 'saved')
              el.classList.toggle('visible');
            });
            let saveHolder =  menuPause.querySelector('.save').querySelector('.saved__list');
            let savedGames = JSON.parse(localStorage.getItem('save'));
            if(savedGames.length){
              let removeSize = Array.from(saveHolder.querySelectorAll('.save__item')).length;
              for(let i = 0; i < removeSize; i++){
                saveHolder.querySelector('.save__item').remove();
              }
              for(let i = 0; i < savedGames.length; i++){
                let div = document.createElement('div');
                div.classList.add(`save__item`,`number--${i+1}`);
                let p = document.createElement('p');
                p.innerHTML = `${savedGames[i].index+1}`;
                p.style.width = '70px';
                p.style.textAlign = 'center';
                div.append(p);
                p = document.createElement('p');
                p.innerHTML = `${savedGames[i].moves}`;
                p.style.width = '70px';
                p.style.textAlign = 'center';
                div.append(p);
                p = document.createElement('p');
                p.innerHTML = `${savedGames[i].time.min}:${savedGames[i].time.sec}`;
                p.style.width = '70px';
                p.style.textAlign = 'center';
                div.append(p);
                p = document.createElement('p');
                p.style.width = '70px';
                p.style.textAlign = 'center';
                p.innerHTML = `${savedGames[i].fieldSize}`;
                div.append(p);
                let butt = document.createElement('button');
                butt.classList.add('butt');
                butt.innerText = 'Load';
                butt.dataset.index = i;
                div.append(butt);
                saveHolder.append(div);
              }
              if(saveHolder.querySelector('.save__item')){
                let btnsSave =  Array.from(saveHolder.querySelectorAll('.save__item'));
                btnsSave.forEach(el => el.querySelector('.butt').removeEventListener('click', saveHandler));
                btnsSave.forEach(el => el.querySelector('.butt').addEventListener('click', saveHandler));
              }
            }
          });

          break;
        case 'save':
          butt.addEventListener('click', () =>{
            let saveField = document.querySelector('.game__board').innerHTML;
            save.push({
              index: save.length,
              field: saveField,
              fieldSize: fieldSize,
              time: { min: document.querySelector('.time').innerText.split('Time: ')[1].split(':')[0],
                      sec: document.querySelector('.time').innerText.split('Time: ')[1].split(':')[1] },
              moves: counter,
              cells: cells,
            });
            localStorage.setItem('save', JSON.stringify(save));
          });
          break;
        case 'score':
          butt.addEventListener('click', ()=>{
            screensArray.forEach(el => {
              if (el.dataset.name === 'main')
                el.classList.toggle('visible');
              if (el.dataset.name === 'score')
                el.classList.toggle('visible');
            });
            let bestScore = JSON.parse(localStorage.getItem('score'));
            bestScore.sort((a,b) => (a.time <= b.time && a.moves <= b.moves) || (a.size > b.size) ? -1 : 1);
            localStorage.setItem('score', JSON.stringify(bestScore));
            let scores = menuPause.querySelector('.score').querySelector('.best__scores');
            if(bestScore.length){
              let removeSize = Array.from(scores.querySelectorAll('.score__item')).length;
              for(let i = 0; i < removeSize; i++){
                scores.querySelector('.score__item').remove();
              }
              for(let i = 0; i < bestScore.length && i <= 10; i++){
                let div = document.createElement('div');
                div.classList.add('score__item', `${i+1}`);
                let p = document.createElement('p');
                p.innerHTML = `${i+1}`;
                p.style.width = '60px';
                p.style.textAlign = 'center';
                div.append(p);
                p = document.createElement('p');
                p.innerHTML = `${bestScore[i].moves}`;
                p.style.width = '60px';
                p.style.textAlign = 'center';
                div.append(p);
                p = document.createElement('p');
                p.innerHTML = `${bestScore[i].time}`;
                p.style.width = '60px';
                p.style.textAlign = 'center';
                div.append(p);
                p = document.createElement('p');
                p.style.width = '60px';
                p.style.textAlign = 'center';
                p.innerHTML = `${bestScore[i].size}`;
                div.append(p);
                document.querySelector('.game__board').querySelector('.menu').querySelector('.score').querySelector('.best__scores').append(div);
              }
            }
          });
          break;
        case 'rules':
          butt.addEventListener('click', ()=>{
            screensArray.forEach(el => {
              if (el.dataset.name === 'main')
                el.classList.toggle('visible');
              if (el.dataset.name === 'rules')
                el.classList.toggle('visible');
            });
          });
          break;
        case 'settings':
          butt.addEventListener('click', ()=>{
            screensArray.forEach(el => {
              if (el.dataset.name === 'main')
                el.classList.toggle('visible');
              if (el.dataset.name === 'settings')
                el.classList.toggle('visible');
            });
          });
          break;
        default:
          butt.addEventListener('click', ()=>{
            timeCounter(true);
            counter = count(true);
            let field = document.querySelector('.game__board');
            for(let i = 0; i < cellAmount-1; i++){
              field.querySelector('.cell').remove();
            }
            field.querySelector('.cell--empty').remove();
            swapFieldSize();
            screensArray.forEach(el => {
              if (el.dataset.name === 'main')
                el.classList.toggle('visible');
            });
            field.querySelector('.menu').classList.toggle('visible');
            let values = genValues();
            createElements(values,field);
            Array.from(field.querySelectorAll('.cell')).forEach(el => el.style.opacity = 1);
            document.body.querySelector('.pause').innerText = 'Pause game';
            isPause = false;
          });

          break;
        }
      }
      break;
    case 'saved':
      buttons = Array.from(screen.querySelectorAll('.btn'));
      for(let j = 0; j < buttons.length; j++){
        let butt = buttons[j];
        if(butt.dataset.target === 'main')
          butt.addEventListener('click', ()=>{
            screensArray.forEach(el => {
              if (el.dataset.name === 'main')
                el.classList.toggle('visible');
              if (el.dataset.name === 'saved')
                el.classList.toggle('visible');
            });
          });
      }

      break;
    case 'score':
      buttons = Array.from(screen.querySelectorAll('.btn'));
      for(let j = 0; j < buttons.length; j++){
        let butt = buttons[j];
        if(butt.dataset.target === 'main')
          butt.addEventListener('click', ()=>{
            screensArray.forEach(el => {
              if (el.dataset.name === 'main')
                el.classList.toggle('visible');
              if (el.dataset.name === 'score')
                el.classList.toggle('visible');
            });
          });
      }
      break;
    case 'rules':
      buttons = Array.from(screen.querySelectorAll('.btn'));
      for(let j = 0; j < buttons.length; j++){
        let butt = buttons[j];
        if(butt.dataset.target === 'main')
          butt.addEventListener('click', ()=>{
            screensArray.forEach(el => {
              if (el.dataset.name === 'main')
                el.classList.toggle('visible');
              if (el.dataset.name === 'rules')
                el.classList.toggle('visible');
            });
          });
      }
      break;
    case 'settings':
      let selector = screen.querySelector('select');
      if(localStorage.getItem('size')){
        Array.from(selector).forEach(el => {
          if(el.value === JSON.parse(localStorage.getItem('size')))
            selector[i].setAttribute('selected', '');
        });
      }
      selector.onchange = function(){
        for(let i = 0; i < selector.length; i++){
          if (selector[i].getAttribute('selected'))
            selector[i].removeAttribute('selected');
          if(selector[i].selected){
            selector[i].setAttribute('selected', '');
            localStorage.setItem('size', selector[i].value);
            fieldSize = selector[i].value;
          }
        }
      };
      buttons = Array.from(screen.querySelectorAll('.btn'));
      for(let j = 0; j < buttons.length; j++){
        let butt = buttons[j];
        if(butt.dataset.target === 'main')
          butt.addEventListener('click', ()=>{
            screensArray.forEach(el => {
              if (el.dataset.name === 'main')
                el.classList.toggle('visible');
              if (el.dataset.name === 'settings')
                el.classList.toggle('visible');
            });
          });
      }
      break;
    case 'win':
      screen.querySelector('.btn').addEventListener('click', () =>{
        screensArray.forEach(el => {
          if (el.dataset.name === 'main')
            el.classList.toggle('visible');
          if (el.dataset.name === 'win')
            el.classList.toggle('visible');
        });
      });
      break;
    default:
      break;
    }
  }
}





export {addListeners, fieldSize, loaded, saveIndex};
