import { generateField, isPause } from './field_generator.js';
import { swapFieldSize, timeCounter, values, count, cellAmount, cellSize, genValues, fieldSize } from './util.js';
import { addListeners, loaded, saveIndex } from './menu_listeners';
import { createElements, counter, cells, emptyCell, move } from './create_elements.js';



generateField();
addListeners();
let field = document.querySelector('.game__board');
swapFieldSize();

createElements(values, field);

const time = document.querySelector('.time');
const moves = document.querySelector('.moves');

let getTime = {min: 0, sec: 0}
makeInfo();

function makeInfo(){
  if(loaded){
    loaded = false;
    counter = JSON.parse(localStorage.getItem('save'))[saveIndex].moves;
  }
  getTime = !isPause ? timeCounter() : getTime;
  moves.innerHTML = `Moves: ${counter}`;
  time.innerHTML = `Time: ${getTime['min']} : ${getTime['sec']}`;
  setTimeout(makeInfo, 1000);
}

let btnSwap = document.querySelector('.to__images');

function createImages(values, field){
  if(cells.length !== 0){
    emptyCell = {
      top: fieldSize,
      left: fieldSize,
      value: 0
    };
    while(cells.length !== 0)
      cells.pop();
  }

  let ctx

  for(let i = 1; i < cellAmount; i++){
    const cell = document.createElement('canvas');
    cell.classList.add('cell');
    cell.setAttribute('width', Math.floor(cellSize)-3 + 'px');
    cell.setAttribute('height', Math.floor(cellSize)-3 + 'px');
    field.append(cell);
    let value;
    value = values[i-1] + 1;
    cell.innerHTML = value;
    const left = i % fieldSize === 0 ? fieldSize : i % fieldSize;
    const top = (i - left) / fieldSize + 1;
    cells.push({
      left: left,
      top: top,
      element: cell,
      value: value
    });

    cell.style.left =`${left*cellSize - cellSize}px`;
    cell.style.top =`${top*cellSize - cellSize}px`;

    let mouseDownHandler = function(event){
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
        cells.forEach(el => {if(el.value === parseFloat(cell.innerHTML)) c = el;});
        let diff = Date.now() - down;
        cell.style.zIndex = 1;
        if(diff < 200){
          c.element.style.transition = 'all 0.3s';
          c.element.style.left = c.left * cellSize - cellSize + 'px';
          c.element.style.top = c.top * cellSize - cellSize + 'px';
          prevSibling.after(cell);
          move(i-1, field, cells);
          document.removeEventListener('mousemove', onMouseMove);
        }
        else{
          document.removeEventListener('mousemove', onMouseMove);
          let left = Math.abs(field.offsetLeft - parseFloat(cell.style.left.split('px')));
          let top = Math.abs(field.offsetTop - parseFloat(cell.style.top.split('px')));
          prevSibling.after(cell);
          if((Math.abs(emptyCell.left*cellSize - cellSize - left) <= 25 && Math.abs(emptyCell.top*cellSize - cellSize  - top ) <= 25))
            move(i-1, field, cells);
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



    }
    cell.onmousedown = mouseDownHandler;
  }
  const zeroCell = document.createElement('div');
  zeroCell.classList.add('cell--empty');
  field.append(zeroCell);
  zeroCell.style.left = `${emptyCell.left*cellSize - cellSize}px`;
  zeroCell.style.top = `${emptyCell.top*cellSize - cellSize}px`;
  zeroCell.style.width = cellSize + 'px';
  zeroCell.style.height = cellSize + 'px';
  cells.push(emptyCell);
  return cells;
}

function swapToImages(){
  let field = document.querySelector('.game__board');
  timeCounter(true);
  counter = count(true);
  for(let i = 0; i < cellAmount-1; i++){
    field.querySelector('.cell').remove();
  }
  field.querySelector('.cell--empty').remove();
  swapFieldSize();
  let values = genValues();
  let cells = createImages(values, field);

  const src = '../assets/gem_pick.jpg';
  const img = new Image();
  img.src = src;
  let ctx;
  img.onload = function(){
    for(let i = 0; i < cells.length - 1; i++){
      ctx = cells[i].element.getContext('2d');
      const left = cells[i].value % fieldSize === 0 ? fieldSize : cells[i].value % fieldSize;
      const top = (cells[i].value - left) / fieldSize + 1;
      let x = left * cellSize - cellSize;
      let y = top * cellSize - cellSize;
      ctx.drawImage(img, x, y, cellSize, cellSize, 0, 0, cellSize, cellSize);
      ctx.font = '40px Arial';
      ctx.fillStyle = 'white'
      ctx.fillText(`${cells[i].value}`, 10, 33);
      ctx.font = '42px Arial';
      ctx.strokeText(`${cells[i].value}`, 10, 33);
  }
}
}

btnSwap.addEventListener('click', swapToImages)
