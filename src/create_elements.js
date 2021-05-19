localStorage.setItem('size', localStorage.getItem('size') ? localStorage.getItem('size') : 4);
import { count, cellSize, fieldSize, cellAmount } from './util.js';

let counter = 0;
let emptyCell = {
  top: fieldSize,
  left: fieldSize,
  value: 0
};
let cells = [];
let bestScore = JSON.parse(localStorage.getItem('score')) ? JSON.parse(localStorage.getItem('score')) : [];
let mouseDownHandler;

function createElements(values,field){
  if(cells.length !== 0){
    emptyCell = {
      top: fieldSize,
      left: fieldSize,
      value: 0
    };
    while(cells.length !== 0)
      cells.pop();
  }

  for(let i = 1; i < cellAmount; i++){
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.style.width = cellSize + 'px';
    cell.style.height = cellSize + 'px';
    let value;
    value = values[i-1] + 1;
    cell.innerHTML = value;
    field.append(cell);
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

    mouseDownHandler = function(event){
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
}

function move(i, field, cells){
  const cell = cells[i];
  const leftDiff = Math.abs(cell.left - emptyCell.left);
  const topDiff = Math.abs(cell.top - emptyCell.top);
  if (leftDiff + topDiff > 1){
    cell.element.style.left = cell.left * cellSize - cellSize + 'px';
    cell.element.style.top = cell.top * cellSize - cellSize + 'px';
    return;
  }
  cell.element.style.left = `${emptyCell.left * cellSize - cellSize}px`;
  cell.element.style.top = `${emptyCell.top * cellSize - cellSize}px`;
  let tempLeft = emptyCell.left;
  let tempTop = emptyCell.top;
  emptyCell.left = cell.left;
  emptyCell.top = cell.top;
  cell.left = tempLeft;
  cell.top = tempTop;
  counter = count();
  let win = cells.every(el => el.value === 0 ? el.top === fieldSize && el.left === fieldSize : (el.top-1)*fieldSize + el.left === el.value);
  if (win){
    const win = Array.from(field.querySelector('.menu').querySelectorAll('.screen__menu'));
    win.forEach(el => {
      if(el.dataset.name === 'win'){
        if(el.querySelector('p'))
          el.querySelector('p').remove();
        field.querySelector('.menu').classList.toggle('visible');
        let time = document.body.querySelector('.time').innerText;
        let moves = document.body.querySelector('.moves').innerText;
        let winStatement = document.createElement('p');
        winStatement.classList.add('text');
        winStatement.innerHTML = `Congrats you win.<br> ${time}, ${moves}`;
        winStatement.style.width = '250px';
        el.prepend(winStatement);
        if (el.dataset.name === 'win')
          el.classList.toggle('visible');
        Array.from(field.querySelectorAll('.cell')).forEach(el => {
          el.style.pointerEvents = 'none';
          el.style.opacity = 0.5;
        });
        if(bestScore.length > 9){
          bestScore.push({moves: parseFloat(moves.split('Moves: ')[1]) + 1, time: time.split('Time: ')[1], size: `${JSON.parse(localStorage.getItem('size'))}x${JSON.parse(localStorage.getItem('size'))}`});
          bestScore.sort((a,b) => (a.time <= b.time && a.moves <= b.moves) || (a.size >= b.size) ? -1 : 1)
          bestScore.pop();
        }else {
          bestScore.push({moves: parseFloat(moves.split('Moves: ')[1]) + 1, time: time.split('Time: ')[1], size: `${JSON.parse(localStorage.getItem('size'))}x${JSON.parse(localStorage.getItem('size'))}`});
          bestScore.sort((a,b) => (a.time <= b.time && a.moves <= b.moves) || (a.size >= b.size) ? -1 : 1)
        }
        localStorage.setItem('score', JSON.stringify(bestScore));
      }
    });
  }
  document.querySelector('.swipe__sound').play();
}



export { createElements, counter, cellAmount, fieldSize, mouseDownHandler, cells, emptyCell, move };
