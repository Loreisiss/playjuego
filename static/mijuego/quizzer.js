// inicializamos un array de arrays con la preguntas del juego. 
var questions = [
	[
		"1. ¿Cual es la abreviatura de kilometro?",
		"A) kl",
		"B) klm",
		"C) km",
		"D) kmt",
		0
	],
	[
		"2. ¿Quien salio de la lampara de Aladino?",
		"A) Un principe",
		"B) Un genio",
		"C) Una bruja",
		"D) AngularJS",
		1
	],
	[
		"3. ¿Cual es el simbolo quimico del aluminio?",
		"A) Ao",
		"B) Am",
		"C) Lm",
		"D) Al",
		3
	],
	[
		"4. ¿Las gotas heladas que caen en algunas tormentas se les llama?",
		"A)	Granizo",
		"B)	Nieve",
		"C) Lluvia",
		"D) Rocio",
		0
	],
	[
		"5. ¿De que color es una senial de Pare?",
		"A)	verde y azul",
		"B)	rojo y blanco",
		"C)	amarillo y negro",
		"D)	rosa y verde",
		1
	],
	[
		"6. ¿Cual de estos animales es un reptil?",
		"A)	Cocodrilos",
		"B)	Serpientes",
		"C) Lagartos",
		"D)	Todos",
		3
	],
	[
		"7. ¿ Cual de estas piedras es de color verde  ?",
		"A)	Rubi ",
		"B)	Topacio ",
		"C)	Zafiro ",
		"D) Esmaraldas ",
		3
	],
	[
		"8. ¿Para que el pan se fermente o crezca debe llevar?",
		"A)  Levadura	",
		"B) Agua	",
		"C)	Uvas",
		"D)	Amor",
		0
	],
	[
		"9. ¿Este perro es el mas alto de todos ellos. Tiene un pelaje delgado.?",
		"A) Lobero Irlandes",
		"B)	Gran danes",
		"C)	Deerhound Escoces",
		"D)	San Bernardo",
		0
	],
	[
		"10. ¿La antena de radio sirve para?",
		"A)	Adornar el radio",
		"B)	Mejorar la senial",
		"C)	Regular la corriente",
		"D)	Eliminar el ruido",
		1
	],
	[
		"11. ¿El protagonita de este espectaculo tiene un abuelo llamado Lou?",
		"A) Los padrinos magicos",
		"B)	Doug",
		"C)	Rugrats",
		"D)	Clarissa lo explica todo",
		2
	],
	[
		"12. ¿Cual es el continente mas grande del mundo?",
		"A)	Asia",
		"B)	Europa",
		"C)	Africa",
		"D)	America",
		0
	],
	[
		"13. ¿Cual es la forma completa de la abreviatura GMT?",
		"A)	Greenwich Mean Time",
		"B)	Greenland Mean time",
		"C)	German Mean Time",
		"D)	Gippsland Mean Time",
		0
	],
	[
		"14. ¿Cual es el oceano en el que llega el caudal del rio amazonas?",
		"A)	 El Artico",
		"B)	El indio",
		"C)	 El Atlantico",
		"D)	El Pacifico",
		2
	],
	[
		"15. ¿Cuantos jugadores conforman un equipo de voleibol en la cancha?",
		"A)	10 ",
		"B)	5 ",
		"C)	 6",
		"D)	4 ",
		2
	],

];

// Aquí utilizamos UnderscoreJS para generar un template de pregunta.
var questionTemplate = _.template("\ 	<div class='card question'><span class='question'><%= question %></span> \
      <ul class='options'> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='0' id='q<%= index %>o1'> \
          <label for='q<%= index %>o1'><%= a %></label> \
        </li> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='1' id='q<%= index %>o2'> \
          <label for='q<%= index %>o2'><%= b %></label> \
        </li> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='2' id='q<%= index %>o3'> \
          <label for='q<%= index %>o3'><%= c %></label> \
        </li> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='3' id='q<%= index %>o4'> \
          <label for='q<%= index %>o4'><%= d %></label> \
        </li> \
      </ul> \
    </div> \
 ");

// Definimos las variables de estado del juego y los valores iniciales (como el tiempo de respuesta de cada pregunta).
var points,
	pointsPerQuestion,
	currentQuestion,
	questionTimer,
	timeForQuestion = 500, // segundos
	timeLeftForQuestion; 
// Manipulacion de elementos con JQuery.
$(function() {

	// Uso de jQuery para escuchar el evento click del botón de Comenzar y Volver a jugar.
	$('button.start').click(start);
	$('.play_again button').click(restart);

	// La función restart inicializa los valores de las variables de estado del juego.
	function restart() {
		points = 0;
		pointsPerQuestion = 100;
		currentQuestion = 0;
		timeLeftForQuestion = timeForQuestion;
	// Se oculta la pantalla de finalizar y un mensaje que dice "Se acabó el tiempo".
		$('.finish.card').hide();
		$('div.start').show();
		$('.times_up').hide();

		generateCards();
		updateTime();
		updatePoints();
	}

	//  La función start se ejecuta cuando el jugador hace click en comenzar.
	function start() {
		$('div.start').fadeOut(200, function() {
			moveToNextQuestion();
		});
	}

	// Esta es una de las funciones clave del juego, encargada de generar las preguntas. 
	function generateCards() {
		$('.questions').html('');
		for (var i = 0; i < questions.length; i++) {
			var q = questions[i];
			var html = questionTemplate({
				question: q[0],
				index: i,
				a: q[1],
				b: q[2],
				c: q[3],
				d: q[4]
			});
			$('.questions').append(html);
		};

                // Indicamos que nos interesa el evento change de los inputs dentro de los elementos con clase question y card (cada una de las preguntas).
		$('.question.card input').change(optionSelected);
	}

	// Esta función cambia el estado del juego para pasar de una pregunta a la siguiente.
	function moveToNextQuestion() {
		currentQuestion += 1;
		if (currentQuestion > 1) {
			$('.question.card:nth-child(' + (currentQuestion-1) + ')').hide();
		}

		// Se muestra la siguiente pregunta.
		showQuestionCardAtIndex(currentQuestion);
		setupQuestionTimer();
	}

	// Esta función inicializa el temporizador para responder una pregunta.
	function setupQuestionTimer() {
		if (currentQuestion > 1) {
			clearTimeout(questionTimer);
		}
		timeLeftForQuestion = timeForQuestion;

		// Cada 1 segundo, nuestro temporizador llamará a la función countdownTick(). 
		questionTimer = setTimeout(countdownTick, 1000);
	}

	// Mostramos la tarjeta de pregunta correspondiente al índice que la función recibe por parámetro.
	function showQuestionCardAtIndex(index) { // staring at 1
		var $card = $('.question.card:nth-child(' + index + ')').show();
	}

	// La función countdownTick() se ejecuta cada un segundo, y actualiza el tiempo restante para responder en la pantalla del jugador.
	function countdownTick() {
		timeLeftForQuestion -= 1;
		updateTime();
		if (timeLeftForQuestion == 0) { 
			return finish();
		}
		questionTimer = setTimeout(countdownTick, 1000);
	}

	// Actualiza el tiempo restante en pantalla, utilizando la función html(). 
	function updateTime() {
		$('.countdown .time_left').html(timeLeftForQuestion + 's');
	}

	// Actualiza los puntos en pantalla.
	function updatePoints() {
		$('.points span.points').html(points + '$Dolares');
	}

	// Esta función se ejecuta cuando el jugador escoge una respuesta.
	function optionSelected() {
		var selected = parseInt(this.value);
		var correct = questions[currentQuestion-1][5];

		if (selected == correct) {
			points += pointsPerQuestion;
			updatePoints();
			correctAnimation();
		} else {
			wrongAnimation();
		}

		if (currentQuestion == questions.length) {
			clearTimeout(questionTimer);
			return finish();
		}
		moveToNextQuestion();
	}

	// Animación de respuesta correcta e incorrecta.
	function correctAnimation() {
		animatePoints('right');
	}

	// Animación de respuesta correcta e incorrecta.
	function wrongAnimation() {
		animatePoints('wrong');
	}

	// Esta función anima el puntaje en pantalla.
	function animatePoints(cls) {
		$('header .points').addClass('animate ' + cls);
		setTimeout(function() {
			$('header .points').removeClass('animate ' + cls);
		}, 500);
	}

	// Cuando el juego termina, esta función es ejecutada.
	function finish() {
		if (timeLeftForQuestion == 0) {
			$('.times_up').show();
		}
		$('p.final_points').html(points + ' $Dolares');
		$('.question.card:visible').hide();
		$('.finish.card').show();
	}

	// 24
	restart();

});