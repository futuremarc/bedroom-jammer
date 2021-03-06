jQuery(document).ready(function () {

	var wordCount;
	var messageLength;

	var log_chat_message = function  (message, type) {
		var li = jQuery('<li />').text(message);
		
		if (type === 'system') {
			li.css({'font-weight': 'bold'});
		} else if (type === 'leave') {
			li.css({'font-weight': 'bold', 'color': '#F00'});
		}
				
		jQuery('#chat_log').append(li);
	};

	socket.on('exit', function  (data) {
		log_chat_message(data.message, 'leave');
	});

	socket.on('chat', function  (data) {
		log_chat_message(data.message, 'normal');
		wordCount = data.message.split(' ');
		messageLength = wordCount.length - 1;
		speaker.speak(messageLength);
	});

	socket.on('othersEntrance', function  (data) {
		log_chat_message(data.message, 'system');
	});


	jQuery('#chat_box').keypress(function (event) {
		if (event.which == 13) {
			socket.emit('chat', {message: jQuery('#chat_box').val()});
			speaker.speak(messageLength);
			jQuery('#chat_box').val('');

		}
	});

	var SynthSpeak = function(){

	this.synth = new Tone.MonoSynth().toMaster();
	this.synth.volume.value = -14;
	this.sentence;
	this.wordCount;
	}

	SynthSpeak.prototype._word = function() {
		this.synth.triggerAttackRelease(Tone.prototype.midiToNote(Math.floor(Math.random() * 50 + 26)), .3);
		this.synth.frequency.rampTo(Math.floor(Math.random() * 150 + 20), .3);
	}

	SynthSpeak.prototype.speak = function(wordcount) {
		this.wordCount = wordcount;

		for (var i = 1; i <= this.wordCount; i++) {
			var random = Math.random();
			var mapped = Math.random() * 75 + 200;
			setTimeout(this._word.bind(this), i * mapped);
		}
	}

	var speaker = new SynthSpeak();
});
