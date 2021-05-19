let fieldSize = JSON.parse(localStorage.getItem('size')) ? JSON.parse(localStorage.getItem('size')) : 4;
let cellAmount = Math.pow(fieldSize, 2);
let cellSize = 400/fieldSize;

function genValues(){
  let values = [...Array(cellAmount-1).keys()];
  values.sort(() => Math.random() - 0.5);
  return values;
}
function checkZero(num){
  if (parseInt(num) <= 9 && num.toString().length < 2)
    return `0${num}`;
  else return num;
}
function timer (){
  let sec = 0;
  let min = 0;
  return function(zero = false){
    if(zero){
      min = 0;
      sec = 0;
    } else{
      sec++;
      if (sec === 60){
        min++;
        sec = 0;
      }
      sec = checkZero(sec);
      min = checkZero(min);
    }
    return {'sec': sec,'min': min};
  };
}
function add(count){
  let counter = 0;
  return function(zero = false){
    if(zero)
      counter = 0;
    else
      counter++;
    return counter;
  };
}
function swapFieldSize(){
  fieldSize = JSON.parse(localStorage.getItem('size'));
  cellAmount = Math.pow(fieldSize, 2);
  cellSize = 400/fieldSize;
}

let timeCounter = timer();
let count = add();
let values = [...Array(cellAmount-1).keys()];

export { genValues, checkZero, timeCounter, count, values, fieldSize, cellAmount, cellSize, swapFieldSize };
