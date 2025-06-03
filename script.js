document.addEventListener("DOMContentLoaded", () => {
  let words = [];
  let currentWord = {};
  let remainingWords = [];
  let acertadasList = [];

  const promptElement = document.getElementById("prompt");
  const answerElement = document.getElementById("answer");
  const feedbackElement = document.getElementById("feedback");
  const contador = document.getElementById("contador")
  // const acertadasUl = document.getElementById("acertadas");
  const submitButton = document.getElementById("submit");

  // Cargar el archivo voc.json
  fetch('voc.json')
    .then(response => response.json())
    .then(data => {
      // Convertir el objeto en un array de objetos {french, spanish}
      words = Object.entries(data).map(([french, spanish]) => ({ french, spanish }));
      // Mezclar las palabras para obtener un orden aleatorio
      remainingWords = shuffle(words.slice());
      loadNextWord();
    })
    .catch(error => {
      promptElement.textContent = "Error al cargar las palabras.";
      console.error(error);
    });

  // Función para mezclar un array (algoritmo Fisher-Yates)
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Cargar la siguiente palabra en el juego
  function loadNextWord() {
    //   feedbackElement.textContent = "";
    answerElement.value = "";
    contador.innerText = `Quedan ${remainingWords.length} de ${words.length} palabras`
    if (remainingWords.length === 0) {
      promptElement.textContent = "¡Felicidades! Has completado todas las palabras.";
      submitButton.disabled = true;
      answerElement.disabled = true;
      return;
    }
    currentWord = remainingWords[0];
    promptElement.textContent = `¿Cómo se dice "${currentWord.spanish}" en francés?`;
    answerElement.focus();

  }

  // Manejadores para enviar respuesta
  submitButton.addEventListener("click", () => {
    checkAnswer();
  });

  answerElement.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      checkAnswer();
    }
  });

  // Función para comprobar la respuesta
  function checkAnswer() {
    const userAnswer = answerElement.value.trim().toLowerCase();
    if (userAnswer === currentWord.french.toLowerCase()) {
      feedbackElement.textContent = "¡Correcto!";
      // Si la palabra no estaba ya en la lista de acertadas, la añadimos
      if (!acertadasList.includes(currentWord.french)) {
        acertadasList.push(currentWord.french);
        //   const li = document.createElement("li");
        //   li.textContent = `${currentWord.spanish} - ${currentWord.french}`;
        //   acertadasUl.appendChild(li);
      }
      // Eliminamos la palabra correcta y cargamos la siguiente
      remainingWords.shift();
      loadNextWord();
      feedbackElement.style.color = "rgb(108, 216, 105)";
      feedbackElement.textContent = "¡Correcto!";
    } else {
      feedbackElement.style.color = "rgb(220, 105, 105)";
      feedbackElement.textContent = `Incorrecto. La respuesta correcta es: ${currentWord.french}`;
      answerElement.value = "";
      answerElement.focus();
      remainingWords = remainingWords.filter(word => word !== currentWord); // Quitamos la palabra del array
      remainingWords.push(currentWord); // La volvemos a añadir al final
      loadNextWord()
    }
  }
});
