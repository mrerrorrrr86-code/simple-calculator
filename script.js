const display = document.getElementById("display");
const expression = document.getElementById("expression");
const keys = document.querySelector(".keys");

let current = "0";
let previous = null;
let operator = null;
let shouldReset = false;

function updateDisplay() {
  display.textContent = current;
}

function inputNumber(value) {
  if (shouldReset) {
    current = value === "." ? "0." : value;
    shouldReset = false;
  } else if (value === ".") {
    if (!current.includes(".")) current += ".";
  } else {
    current = current === "0" ? value : current + value;
  }
  updateDisplay();
}

function chooseOperator(nextOperator) {
  const value = Number(current);

  if (operator && !shouldReset) {
    calculate();
  }

  previous = Number(current);
  operator = nextOperator;
  shouldReset = true;
  expression.textContent = `${previous} ${symbolFor(operator)}`;
}

function symbolFor(op) {
  return ({ "/": "÷", "*": "×", "-": "−", "+": "+" })[op] || op;
}

function calculate() {
  if (operator === null || previous === null) return;

  const a = previous;
  const b = Number(current);
  let answer;

  switch (operator) {
    case "+": answer = a + b; break;
    case "-": answer = a - b; break;
    case "*": answer = a * b; break;
    case "/":
      if (b === 0) {
        current = "Cannot divide by zero";
        previous = null;
        operator = null;
        shouldReset = true;
        expression.textContent = "";
        updateDisplay();
        return;
      }
      answer = a / b;
      break;
  }

  current = String(Number(answer.toPrecision(12)));
  expression.textContent = `${a} ${symbolFor(operator)} ${b} =`;
  previous = null;
  operator = null;
  shouldReset = true;
  updateDisplay();
}

function clearCalculator() {
  current = "0";
  previous = null;
  operator = null;
  shouldReset = false;
  expression.textContent = "";
  updateDisplay();
}
function backspace() {
  if (shouldReset || current === "Cannot divide by zero") {
    clearCalculator();
    return;
  }

  current = current.length > 1
    ? current.slice(0, -1)
    : "0";

  updateDisplay();
}


keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.value !== undefined) {
    inputNumber(button.dataset.value);
  } else if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
  } else if (button.dataset.action === "equals") {
    calculate();
  } else if (button.dataset.action === "clear") {
    clearCalculator();
  } else if (button.dataset.action === "backspace") {
    backspace();
  }
});


document.addEventListener("keydown", (event) => {
  if (/^[0-9.]$/.test(event.key)) inputNumber(event.key);
  else if (["+", "-", "*", "/"].includes(event.key)) chooseOperator(event.key);
  else if (event.key === "Enter" || event.key === "=") calculate();
  else if (event.key === "Escape" || event.key === "Delete") clearCalculator();
    else if (event.key === "Backspace") backspace();
  else return;
  event.preventDefault();
});

updateDisplay();
