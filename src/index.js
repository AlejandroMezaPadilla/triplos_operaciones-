// ------------------- Detectar tipo de notación -------------------
const detectarNotacion = (exp) => {
  exp = exp.trim();
  if (/^[+\-*/]/.test(exp)) return "prefija";
  if (/[+\-*/]$/.test(exp)) return "posfija";
  return "infija";
};

// ------------------- Función para formatear infija -------------------
const formatearInfija = (exp) => exp
  .replace(/([+\-*/()])/g, " $1 ")
  .replace(/\s+/g, " ")
  .trim();

// ------------------- Función para formatear Prefija y Posfija -------------------
const formatearPrefPos = (tokens) => tokens.join(' ');

// ------------------- Función para tokenizar expresión infija -------------------
const tokenizarInfija = (exp) => {
  let tokens = [];
  let i = 0;
  while (i < exp.length) {
    let c = exp[i];
    if (/\d/.test(c)) {
      let num = '';
      while (i < exp.length && /\d/.test(exp[i])) {
        num += exp[i];
        i++;
      }
      tokens.push(num);
      continue;
    } else if (/[+\-*/()]/.test(c)) {
      tokens.push(c);
    }
    i++;
  }
  return tokens;
};

// ------------------- Función principal -------------------
const calcular = () => {
  let expresion = document.getElementById("expresion").value.trim();
  const resultadoDiv = document.getElementById("resultado");

  if (!expresion) {
    resultadoDiv.innerHTML = `<div class="res-box"><strong>Error:</strong> Ingresa una expresión</div>`;
    return;
  }

  const tipo = detectarNotacion(expresion);
  let resultado = "";

  if (tipo === "infija") {
    const tokens = tokenizarInfija(expresion);

    let t0 = performance.now();
    const prefijaTokens = infixToPrefix(tokens);
    let t1 = performance.now();
    const tiempoPrefija = (t1 - t0).toFixed(4);

    t0 = performance.now();
    const postfijaTokens = infixToPostfix(tokens);
    t1 = performance.now();
    const tiempoPostfija = (t1 - t0).toFixed(4);

    resultado = `
      <div class="res-box"><strong>Detectada:</strong> Infija</div>
      <div class="res-box"><strong>Infija:</strong> ${formatearInfija(expresion)}</div>
      <div class="res-box"><strong>Prefija:</strong> ${formatearPrefPos(prefijaTokens)}<br><small>⏱ ${tiempoPrefija} ms</small></div>
      <div class="res-box"><strong>Posfija:</strong> ${formatearPrefPos(postfijaTokens)}<br><small>⏱ ${tiempoPostfija} ms</small></div>
    `;
  }

  resultadoDiv.innerHTML = resultado;
};

// ------------------- Conversores usando tokens -------------------
const infixToPostfix = (tokens) => {
  let stack = [];
  let output = [];
  const prec = { "+":1, "-":1, "*":2, "/":2 };

  tokens.forEach(ch => {
    if (/\d/.test(ch) || /[a-zA-Z]/.test(ch)) output.push(ch);
    else if (ch === "(") stack.push(ch);
    else if (ch === ")") {
      while (stack.length && stack[stack.length-1] !== "(") output.push(stack.pop());
      stack.pop();
    } else if (prec[ch]) {
      while (stack.length && prec[stack[stack.length-1]] >= prec[ch]) output.push(stack.pop());
      stack.push(ch);
    }
  });

  while (stack.length) output.push(stack.pop());
  return output;
};

const infixToPrefix = (tokens) => {
  // invertir tokens
  let reversed = tokens.slice().reverse().map(t => t === "(" ? ")" : t === ")" ? "(" : t);
  let postfix = infixToPostfix(reversed);
  return postfix.reverse();
};

window.calcular = calcular;
