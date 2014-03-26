this.document.title = 'Mastermind: The Classic Logic Game';

this.Mastermind = this.Mastermind || function () {
	var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'violet', 'blank'],
		answer = [], guesses = [], round = 0, choice = 1,
		result = {black: 0, white: 0},
		solved = false,
		gameOver = false,
		optionDup = 0, optionBlank = 0,
		numGuesses = 0, guessLength = 0;

	var getRandomInt = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	var chooseAnswer = function (dup, blank) {
		var available = (blank) ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4, 5],
			chosen = 0, i = 4;
		for (i; i; i--) {
			chosen = getRandomInt(1, available.length);
			answer.push(colors[available[chosen-1]]);
			if (!dup) {
				available.splice(chosen-1, 1);
			}
		}
	};
	
	var startGame = function (num, len) {
		numGuesses = num;
		guessLength = len;
		optionDup = jQuery('#dup').filter(':checked').length;
		optionBlank = jQuery('#blank').filter(':checked').length;
		round = 0;
		choice = 1;
		answer = [];
		guesses = [];
		chooseAnswer(optionDup, optionBlank);
		setupChoices();
		setupRounds();
		clearHints();
		solved = false;
		gameOver = false;
		result = {black: 0, white: 0};
	};
	
	var evaluate = function (event) {
		var i, answerCopy = answer.slice(0);
		event.preventDefault();
		clearHints();
		
		if (solved) {
			jQuery('#hints').find('.hint').hide().end().find('#solved').show();
			return;
		}
		if (numGuesses<round) {
			jQuery('#hints').find('.hint').hide().end().find('#gameOver').show();
			return;
		}
		if (choice<guessLength+1) {
			jQuery('#hints').find('.hint').hide().end().find('#underGuessed').show();
			return;
		}
		// process all the possible blacks first
		for (i=answerCopy.length; i; i--) {
			if (guesses[i-1] == answerCopy[i-1]) {
				result.black+=1;
				guesses.splice(i-1,1);
				answerCopy.splice(i-1,1);
			}
		}
		// then process any remaining whites
		for (i=answerCopy.length; i; i--) {
			if (jQuery.inArray(guesses[i-1], answerCopy) != -1) {
				result.white+=1;
				// don't mess up the position of answers, just replace match with ""
				answerCopy[jQuery.inArray(guesses[i-1], answerCopy)] = "";
			}
		}
		//jQuery('body').append('<p>Guess: '+printObject(guesses)+'<br>Answer: '+printObject(answer)+'<br>Result: '+printObject(result)+'</p>');
		displayResult();
		if (solved || gameOver) {
		} else {
			addRound();
			nextRound();
		}
	};
	
	var displayResult = function () {
		for (var i=result.black;i;i--) {
			jQuery('#result_'+round.toString()).find('ul').append('<li class="black"></li>');
		}
		for (var i=result.white;i;i--) {
			jQuery('#result_'+round.toString()).find('ul').append('<li class="white"></li>');
		}
		
		if (4 == result.black) {
			solved = true;
			jQuery('#hints').find('.hint').hide().end().find('#solved').show();
		} else if (numGuesses<=round) {
			gameOver = true;
			jQuery('#hints').find('.hint').hide().end().find('#gameOver').show();
		}
	};
	
	var printObject = function (o) {
		var out = '';
		for (var p in o) {
			if (o.hasOwnProperty(p)) {
				out += p + ': ' + o[p] + '\n';
			}
		}
		return out;
	}

	var getAnswer = function () {
		return answer;
	};	
	
	var setupChoices = function () {
		jQuery('#color_choices').empty();
		for (var i=colors.length;i;i--) {
			jQuery('#color_choices').append('<li id="li_'+colors[i-1]+'"></li>').find('li:last-child').html(colors[i-1]);
		}
	};
	
	var addRound = function () {
		createRounds(1,guessLength);
	};

	var setupRounds = function () {
		jQuery('#rounds').empty();
		createRounds(1, guessLength);
	};
	
	var createRounds = function (roundsToAdd, lenRound) {
		var existingRounds = $('.round').length;
		var totalRounds = existingRounds+roundsToAdd;
		
		for (var i = existingRounds+1; i<=totalRounds; i++) {
			jQuery('#rounds').prepend('<div id="round_'+i.toString()+'" class="round"><div id="guess_'+i.toString()+'" class="guess"><ol></ol></div><div id="result_'+i.toString()+'" class="result"><ul></ul></div>');
			for (var j = 1; j<=lenRound; j++) {
				$('#round_'+i.toString()).find('ol').append('<li class="unset">'+j+'</li>');
			}
		}
		
		round = totalRounds;
	};
	
	var userChoice = function (event) {
		event.preventDefault();
		if (solved) {
			jQuery('#hints').find('.hint').hide().end().find('#solved').show();
		} 
		else if (numGuesses<round) {
			jQuery('#hints').find('.hint').hide().end().find('#gameOver').show();
		}
		else if (guessLength<choice) {
			jQuery('#hints').find('.hint').hide().end().find('#overGuessed').show();
		}
		else {
			// we always allow duplicates in the guesses
			var color = jQuery(this).attr('id').split('_')[1];
			clearHints();
			var c = choice-1;
			jQuery('#guess_'+round.toString()).find("ol li:eq("+c+")").attr('class', color);
			//jQuery('#guess_'+round.toString()).find("ol").append('<li class="'+color+'">'+choice+'</li>');
			guesses.push(color);
			choice+=1;
		}
	};
	
	var nextRound = function (event) {
		if (event) {
			event.preventDefault();
		}
		if (solved || gameOver) {
			return;
		} else {
			jQuery('#guess_'+round.toString()).find('ol li').attr('class', 'unset');
			choice = 1;
			guesses = [];
			result.black = 0;
			result.white = 0;
			clearHints();
		}
	};
	
	var clearHints = function () {
		jQuery('#hints').find('.hint').hide();
	};
	
	var attachEvents = function () {
		jQuery('#color_choices li').on('click', Mastermind.UserChoice);
		jQuery('#reset_colors').on('click', Mastermind.NextRound);
		jQuery('#submit_colors').on('click', Mastermind.Evaluate);
		jQuery('.reloadLink').on('click', function(event) {
			event.preventDefault();
			$('#submit_options').trigger('click'); // todo: these elements don't exist yet
		});
	};

	return {StartGame: startGame,
			GetAnswer: getAnswer,
			Evaluate: evaluate,
			UserChoice: userChoice,
			NextRound: nextRound,
			AttachEvents: attachEvents}
}();

//with number of guesses and length passed in
var guessesAllowed = 10, guessLength = 4;
Mastermind.StartGame(guessesAllowed, guessLength);
Mastermind.AttachEvents();
jQuery('#submit_options').on('click', function() {
	Mastermind.StartGame(guessesAllowed, guessLength);
	Mastermind.AttachEvents();
});