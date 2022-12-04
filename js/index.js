// элементы в DOM можно получить при помощи функции querySelector
let fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = (fruits) => {
  fruitsList = document.querySelector('.fruits__list')

  while (fruitsList.children.length) {
    fruitsList.removeChild(fruitsList.firstChild);
  }

  for (let i = 0; i < fruits.length; i++) {
    const newLi = document.createElement("li");

    newLi.className = `fruit__item ${getFruitColor(fruits[i])}`;
    newLi.innerHTML = `
      <div class="fruit__info">
        <div> index: ${i}</div>
        <div>kind: ${fruits[i]['kind']}</div>
        <div>color: ${fruits[i]['color']}</div>
        <div>weight: ${fruits[i]['weight']} (кг)</div>
      </div>`;

    fruitsList.appendChild(newLi);
  }
};

const getFruitColor = (fruit) => {
  // switch case
  switch (fruit.color) {
    case 'фиолетовый': 
      return 'fruit_violet';

    case 'зеленый':
      return 'fruit_green';

    case 'розово-красный': 
      return 'fruit_carmazin';

    case 'желтый':
      return 'fruit_yellow';
      
    case 'светло-коричневый':
      return'fruit_lightbrown';
  }
}

// первая отрисовка карточек
display(fruits);

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];
  let copyFruits = [...fruits];

  while (fruits.length > 0) {
    let index = getRandomInt(0, fruits.length - 1);
    const fruitToDelete = fruits[index];
    fruits.splice(index, 1);
    result.push(fruitToDelete)
  }

  fruits = result;

  const sameFruits = [];
  for (let i = 0; fruits.length > i; i++) {
    if (fruits[i].kind === copyFruits[i].kind) {
      sameFruits.push(fruits[i]);
    }
  }

  if (fruits.length === sameFruits.length) {
    alert('Упс, сгенерировался такой же порядок!')

    return null
  }

  return result;
};

shuffleButton.addEventListener('click', () => {
  const shuffledFruits = shuffleFruits();
  shuffledFruits && display(shuffledFruits);
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  const minWeightInput = document.querySelector('.minweight__input').value;
  const maxWeightInput = document.querySelector('.maxweight__input').value;

  return fruits.filter((item) =>
    minWeightInput <= item.weight && maxWeightInput >= item.weight
  );
};

filterButton.addEventListener('click', () => {
  const filteredFruits = filterFruits();
  filteredFruits && display(filteredFruits);
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки
const fruitPriority = ['розово-красный', 'светло-коричневый', 'желтый', 'зеленый', 'фиолетовый'];

const comparationColor = (a, b, reverse) => {
  const priority1 = fruitPriority.indexOf(a['color']);
  const priority2 = fruitPriority.indexOf(b['color']);

  return reverse ? priority1 < priority2 : priority1 > priority2;
};

const sortAPI = {
  bubbleSort: (arr, comparation) => {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        if (comparation(arr[j], arr[j + 1])) {
          const swap = arr[j + 1];
          arr[j + 1] = arr[j];
          arr[j] = swap;
        }
      }
    }

    return arr;
  },

  quickSort(arr, comparation) {
    // функция обмена элементов
    function swap(items, firstIndex, secondIndex) {
      const temp = items[firstIndex];
      items[firstIndex] = items[secondIndex];
      items[secondIndex] = temp;
    }

    // функция разделитель
    function partition(items, left, right) {
      var pivot = items[Math.floor((right + left) / 2)],
        i = left,
        j = right;
      while (i <= j) {
        while (comparation(items[i], pivot, true)) {
          i++;
        }
        while (comparation(items[j], pivot)) {
          j--;
        }
        if (i <= j) {
          swap(items, i, j);
          i++;
          j--;
        }
      }
      return i;
    }

    // алгоритм быстрой сортировки
    function quickSort(items, left, right) {
      let index;
      if (items.length > 1) {
        left = typeof left != "number" ? 0 : left;
        right = typeof right != "number" ? items.length - 1 : right;
        index = partition(items, left, right);
        if (left < index - 1) {
          quickSort(items, left, index - 1);
        }
        if (index < right) {
          quickSort(items, index, right);
        }
      }

      return items;
    }

    return quickSort(arr);
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    const sorted = sort(arr, comparation);
    const end = new Date().getTime();
    const sortTime = `${end - start} ms`;

    return { sorted, sortTime };
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  sortKind = sortKind === 'bubbleSort' ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  const sort = sortAPI[sortKind];
  const { sorted, sortTime } = sortAPI.startSort(sort, fruits, comparationColor);

  sortTimeLabel.textContent = sortTime;
  display(sorted);
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  if (!kindInput.value || !colorInput.value || !weightInput.value) {
    alert('Одно из полей не заполнено. Проверьте, что ввели все параметры');
    return;
  }

  const newFruit = {
    kind: kindInput.value,
    color: colorInput.value,
    weight: weightInput.value
  }
  console.log(fruits[0])
  console.log(newFruit)
  fruits.push(newFruit);

  display(fruits);
});
