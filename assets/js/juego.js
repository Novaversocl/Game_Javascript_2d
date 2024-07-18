
// Obtener referencia a los elementos del juego
var gameContainer = document.getElementById("game-container");
var cube = document.getElementById("cube");
var floor = document.getElementById("floor");

// Obtener el elemento del tiempo
var timeElement = document.getElementById("Time");
var lifeElement = document.getElementById("life");
// Iniciar el tiempo en 99
var time = 100;

// Tamaño del juego y del cubo
var gameWidth = gameContainer.offsetWidth;
var cubeSize = cube.offsetWidth;

// Posición inicial del cubo
var positionX = (gameWidth - cubeSize) / 2;
var positionY = gameContainer.offsetHeight - cubeSize - floor.offsetHeight;

// Velocidad y dirección del cubo
var speedX = 0;
var maxSpeedX = 5;
var accelerationX = 0.5;

// Verificar si el cubo está en el suelo
var isOnGround = true;

// Gravedad y fuerza de salto
var gravity = 0.5;
var jumpForce = 10;

// Color del cubo
var originalColor = "red";
var jumpColor = "green";
var holdColor = "blue";
var transparente = "transparent";

// Variable para controlar el estado del cambio de color
var colorChangeCounter = 0;
var colorChangeTimer = null;

// Variable para controlar si se debe cambiar el color al saltar
var shouldChangeColor = false;

// Variables para los intervalos de cambio de imagen
var changeImageIntervalDerecha = null;
var changeImageIntervalIzquierda = null;

function musicafondo() {
  var audioFondo = document.createElement("audio");
  audioFondo.id = "Fondo_MMX_V2";
  audioFondo.src = "assets/Musica/Fondo_MMX_V2.mp3";
  audioFondo.play();
}

// Función para cambiar el color del cubo
function changeCubeColor(color) {
  cube.style.backgroundColor = color;
}

// Función para mover el cubo
function moveCube(event) {
  var keyPressed = event.keyCode;

  if (keyPressed === 37) {
    // Flecha izquierda
    speedX -= accelerationX;
    speedX = Math.max(speedX, -maxSpeedX);
    if (colorChangeCounter === 0 && isOnGround) {
      changeCubeColor(transparente);
      colorChangeCounter = 1;

      // Cambiar la imagen cada cierto tiempo
      if (!changeImageIntervalIzquierda) {
        changeImageIntervalIzquierda = setInterval(() => {
          if (cube.style.backgroundImage.includes("Camina_Izquierda_02.png")) {
            cube.style.backgroundImage = "url('assets/img/CaminaA_Izquierda.png')";
          } else {
            cube.style.backgroundImage = "url('assets/img/Camina_Izquierda_02.png')";
          }
          cube.style.backgroundSize = "100%";
        }, 100); // Cambiar la imagen cada 500 ms
      }
    }
  } else if (keyPressed === 39) {
    // Flecha derecha
    speedX += accelerationX;
    speedX = Math.min(speedX, maxSpeedX);
    if (colorChangeCounter === 0 && isOnGround) {
      changeCubeColor(transparente);
      colorChangeCounter = 1;

      // Cambiar la imagen cada cierto tiempo
      if (!changeImageIntervalDerecha) {
        changeImageIntervalDerecha = setInterval(() => {
          if (cube.style.backgroundImage.includes("CaminaA_2.png")) {
            cube.style.backgroundImage = "url('assets/img/CaminaA.png')";
          } else {
            cube.style.backgroundImage = "url('assets/img/CaminaA_2.png')";
          }
          cube.style.backgroundSize = "100%";
        }, 100); // Cambiar la imagen cada 500 ms
      }
      console.log("abre patas");
    }
  } else if (keyPressed === 32) {
    // Barra espaciadora (saltar)
    if (isOnGround) {
      jump();
    }
  }
}

// Función para detener el cubo cuando se deja de presionar la tecla de avance o retroceso
function stopCube_Derecha(event) {
  var keyReleased = event.keyCode;

  if (keyReleased === 39) {
    speedX = 0;
    clearTimeout(colorChangeTimer); // Detener el temporizador de cambio de color
    if (changeImageIntervalDerecha) {
      clearInterval(changeImageIntervalDerecha); // Detener el intervalo de cambio de imagen
      changeImageIntervalDerecha = null;
    }
    if (colorChangeCounter === 1 && isOnGround) {
      changeCubeColor(transparente);

      cube.style.backgroundImage = "url('assets/img/CaminaA.png')";
      cube.style.backgroundSize = "100% 100%";
      cube.style.backgroundRepeat = "no-repeat";
      cube.style.backgroundPosition = "center";

      colorChangeCounter = 0;
    }
  }
}

function stopCube_Izquierda(event) {
  var keyReleased = event.keyCode;

  if (keyReleased === 37) {
    speedX = 0;
    clearTimeout(colorChangeTimer); // Detener el temporizador de cambio de color
    if (changeImageIntervalIzquierda) {
      clearInterval(changeImageIntervalIzquierda); // Detener el intervalo de cambio de imagen
      changeImageIntervalIzquierda = null;
    }
    if (colorChangeCounter === 1 && isOnGround) {
      changeCubeColor(transparente);

      cube.style.backgroundImage = "url('assets/img/CaminaA_Izquierda.png')";
      cube.style.backgroundSize = "100% 100%";
      cube.style.backgroundRepeat = "no-repeat";
      cube.style.backgroundPosition = "center";

      colorChangeCounter = 0;
    }
  }
}

// Función para hacer que el cubo salte
function jump() {
  cube.style.backgroundImage = "url('assets/img/Salto.png')";
  cube.style.backgroundSize = "100%";
  cube.style.backgroundColor = transparente; // Cambiar color del cubo al saltar
  shouldChangeColor = true;
  speedY = -jumpForce;
  isOnGround = false;

  // Crear el elemento de audio
  var jumpSound = document.createElement("audio");
  jumpSound.id = "jumpSound";
  jumpSound.src = "assets/Musica/Salto2.mp3";

  // Reproducir el sonido de salto
  jumpSound.play();
}

// Función para actualizar la posición del cubo
function updateCubePosition() {
  positionX += speedX;

  // Limitar el movimiento del cubo dentro del juego
  positionX = Math.max(0, Math.min(positionX, gameWidth - cubeSize));

  // Aplicar gravedad si no está en el suelo
  if (!isOnGround) {
    speedY += gravity;
    positionY += speedY;

    // Verificar si ha vuelto al suelo
    if (positionY >= gameContainer.offsetHeight - cubeSize - floor.offsetHeight) {
      positionY = gameContainer.offsetHeight - cubeSize - floor.offsetHeight;
      speedY = 0;
      isOnGround = true;

      if (shouldChangeColor) {
        showAlert().then(function () {
          changeCubeColor(transparente);
          shouldChangeColor = false;

          cube.style.backgroundImage = "url('assets/img/CaminaA.png')";
          cube.style.backgroundSize = "100%";
        });
      }
    }
  }

  // Actualizar la posición del cubo en el DOM
  cube.style.left = positionX + "px";
  cube.style.top = positionY + "px";
}

// Función para mostrar el mensaje de alerta y cambiar el color del cubo
function showAlert() {
  return new Promise(function (resolve) {
    // alert('¡Has tocado el piso!');
    resolve();
  });
}

function decreaseTime() {
  // Iterar desde el tiempo actual hasta 0
  for (var i = time; i >= 0; i--) {
    // Utilizar setTimeout para mostrar cada valor del tiempo con un retraso de 1 segundo
    setTimeout(
      (function (currentTime) {
        return function () {
          // Actualizar el valor del tiempo en el elemento HTML
          timeElement.textContent = "Time = " + currentTime;

          console.log(timeElement.textContent);

          // Verificar si el tiempo ha llegado a cero
          if (currentTime === 0) {
            // Mostrar el mensaje "Game Over"
            console.log("Game Over");
            alert("Game Over");

            lifeElement.textContent = "Life = " + currentTime;
          }
        };
      })(i),
      (time - i) * 1000
    );
  }
}

function MiuauUP() {
  var audio = new Audio();
  audio.src = "assets/Musica/Gatito.mp3";

  document.addEventListener("keydown", function (event) {
    if (event.keyCode === 38) {
      audio.play();
    }
  });
}

window.addEventListener("DOMContentLoaded", function () {
  var raton = document.getElementById

("raton");
  var container = document.getElementById("game-container");
  var floor = document.getElementById("floor");

  var containerWidth = container.offsetWidth;
  var ratonWidth = raton.offsetWidth;
  var positionX = containerWidth - ratonWidth;
  var positionY = floor.offsetTop - raton.offsetHeight;
  var animationSpeed = 10;

  raton.style.position = "absolute";
  raton.style.top = positionY + "px";
  raton.style.left = positionX + "px";

  var colorChangeInterval = setInterval(changeColor, 850);

  let caminapersona = "si";
  function changeColor() {
    if (caminapersona == "si") {
      raton.style.backgroundImage = "url('assets/img/Persona1.png')";
      raton.style.backgroundSize = "100% 100%";
      caminapersona = "no";
    } else {
      raton.style.backgroundImage = "url('assets/img/Persona2.png')";
      raton.style.backgroundSize = "100% 100%";
      caminapersona = "si";
    }
  }

  function moveRaton() {
    positionX -= animationSpeed;
    raton.style.left = positionX + "px";

    if (positionX + ratonWidth <= 0) {
      clearInterval(moveInterval);
      clearInterval(colorChangeInterval);
      // alert('¡Llegó el ratón!');
      raton.style.display = "none";
    }
  }

  var moveInterval = setInterval(moveRaton, 850);
});

// Llamar a la función para activar la reproducción del sonido en la flecha hacia arriba
MiuauUP();

setTimeout(musicafondo, 2000);

// Iniciar la función para disminuir el tiempo
decreaseTime();



// Función para reiniciar el juego



// Función para actualizar el juego en cada frame
// Variable para controlar si ya ocurrió una colisión
var collisionOccurred = false;

// Función para reiniciar el juego
function resetGame() {
  // Restablecer todas las variables del juego y cualquier otra acción necesaria

  // Recargar la página
  location.reload();
}


function shootRays() {
  
}

// Agregar evento de teclado para disparar rayos cuando se presiona la tecla '1'
window.addEventListener("keydown", function(event) {
  if (event.keyCode === 13) { // Código de la tecla 'Enter'
    console.log("presiona la tecla 1")
    shootRays();
  }
});

// Función para actualizar el juego en cada frame
function gameLoop() {
  updateCubePosition();

  // Obtener las coordenadas del cubo y el ratón
  var cubeRect = cube.getBoundingClientRect();
  var ratonRect = raton.getBoundingClientRect();

  // Verificar colisión si no ha ocurrido ya una
  if (!collisionOccurred &&
    cubeRect.left < ratonRect.right &&
    cubeRect.right > ratonRect.left &&
    cubeRect.top < ratonRect.bottom &&
    cubeRect.bottom > ratonRect.top
  ) {
    collisionOccurred = true; // Marcar que ya ocurrió una colisión
    console.log("¡Perdiste!"); // Mostrar mensaje en la consola
    resetGame(); // Reiniciar el juego
  }

  requestAnimationFrame(gameLoop);
}
// Iniciar el bucle del juego
gameLoop();

// Agregar eventos de teclado para mover y detener el cubo
document.addEventListener("keydown", moveCube);
document.addEventListener("keyup", stopCube_Derecha);
document.addEventListener("keyup", stopCube_Izquierda);
