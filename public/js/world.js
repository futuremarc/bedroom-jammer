var game = new Phaser.Game(1400, 800, Phaser.AUTO, 'chatroom', {
	preload: preload,
	create: create,
	update: update
});
var socket = io.connect('http://localhost:5000');
var myId;
var platforms;
var leafLedges = [];
var leafSprites = [];
var leafContact, prevLeafContact;
var cloudLedges = [];
var cloudSprites = [];
var cloudContact, prevCloudContact;
var creatureContact, prevCreatureContact;
var origTint = 0xFFFFFF;
var doneLoading = false;
var flower;
var eyes;
var eyesOpen = false;
var apple;
var creature;
var bouncy;
// var score = 0;
// var scoreText;
var broccoli;
var players,
	clients = {}
others = [];
var direction = -1;
var creatureDirection = 'left';
var playerX = 0,
	playerY = 0,
	playerVel = 0,
	playerVelY = 0;
var existingPlayer;
var player2Exists = false;
var player2Set = false;
var player3Exists = false;
var player3Set = false;
var chosenCharacter = Math.floor(Math.random() * 4) + 1;

function preload() {
	game.load.image('sky', './assets/sky.png');
	game.load.image('grass', './assets/grass.png');
	game.load.image('diamond', './assets/diamond.png');
	game.load.image('smallgrass', './assets/smallgrass.png');
	game.load.image('smallgrasspatch', './assets/smallgrasspatch.png');
	game.load.image('platform', './assets/platform.png');
	game.load.image('leftleaf', './assets/leftleaf.png');
	game.load.image('rightleaf', './assets/rightleaf.png');
	game.load.image('stem', './assets/stem.png');
	game.load.image('cave', './assets/cave.png');
	game.load.image('cloud', './assets/cloud.png');
	game.load.image('tree', './assets/tree.png');
	game.load.image('apple', './assets/apple.png');
	game.load.image('frontcave', './assets/frontcave.png');
	game.load.spritesheet('star1', './assets/starblue.png', 25, 25);
	game.load.spritesheet('star2', './assets/starorange.png', 25, 25);
	game.load.spritesheet('star3', './assets/starpink.png', 25, 25);
	game.load.spritesheet('star4', './assets/starpurple.png', 25, 25);
	game.load.spritesheet('dude1', './assets/dude1.png', 35, 60);
	game.load.spritesheet('dude2', './assets/dude2.png', 40, 60);
	game.load.spritesheet('dude3', './assets/dude3.png', 40, 60);
	game.load.spritesheet('dude4', './assets/dude4.png', 37, 60);
	game.load.spritesheet('broccoli', './assets/broccoli.png', 200, 220);
	game.load.spritesheet('flower', './assets/flower.png', 220, 220);
	game.load.spritesheet('eyes', './assets/eyes.png', 70, 25);
	game.load.spritesheet('baddie', './assets/creature.png', 34, 40);
	game.load.spritesheet('bouncy', './assets/bouncycreature.png', 220, 200);
}



function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);

	platforms = game.add.group();
	platforms.enableBody = true;

	players = game.add.group();


	var sky = game.add.sprite(0, 0, 'sky');
	var tree = game.add.sprite(15, 125, 'tree');
	tree.scale.setTo(.6, .6);

	eyes = game.add.sprite(115, 160, 'eyes');


	var leaf = game.add.sprite(602, game.world.height - 196, 'leftleaf');
	leaf.scale.setTo(.66, .66);
	var ledge = platforms.create(608, game.world.height - 170, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.23, .05);
	leafLedges.push(ledge);
	leafSprites.push(leaf);


	var ledge = platforms.create(530, game.world.height - 444, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.23, .05);
	var leaf = game.add.sprite(534, game.world.height - 480, 'leftleaf');
	leaf.scale.setTo(.66, .66);
	leafLedges.push(ledge);
	leafSprites.push(leaf);


	var ledge = platforms.create(726, game.world.height - 324, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.23, .05);
	var leaf = game.add.sprite(720, game.world.height - 350, 'rightleaf');
	leaf.scale.setTo(.66, .66);
	leafLedges.push(ledge);
	leafSprites.push(leaf);

	var ledge = platforms.create(660, 130, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.10, .05);


	game.add.sprite(580, 130, 'stem');
	flower = game.add.sprite(580, 30, 'flower');

	broccoli = game.add.sprite(game.world.width - 200, game.world.height - 350, 'broccoli');
	broccoli.enableBody = true;

	broccoli.scale.setTo(.7, .7);
	broccoli.animations.add('on', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
	broccoli.animations.play('on');

	game.add.sprite(game.world.width - 400, game.world.height - 310, 'cave');

	ledge = platforms.create(274, 220, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.44, .5);
	var cloud = game.add.sprite(270, 200, 'cloud');
	cloudLedges.push(ledge);
	cloudSprites.push(cloud);

	ledge = platforms.create(1200, 180, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.44, .5);
	cloud = game.add.sprite(1196, 160, 'cloud');
	cloudLedges.push(ledge);
	cloudSprites.push(cloud);


	ledge = platforms.create(804, 240, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.44, .5);
	cloud = game.add.sprite(800, 220, 'cloud');
	cloudLedges.push(ledge);
	cloudSprites.push(cloud);


	ledge = platforms.create(946, 410, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.44, .5);
	cloud = game.add.sprite(940, 390, 'cloud');
	cloudLedges.push(ledge);
	cloudSprites.push(cloud);

	var ledge = platforms.create(-80, game.world.height - 400, 'platform');
	ledge.body.immovable = true;
	var grass = game.add.sprite(0, game.world.height - 440, 'smallgrass');


	var ground = platforms.create(0, game.world.height - 32, 'platform');
	var grass = game.add.sprite(-10, game.world.height - 70, 'grass');

	apple = game.add.sprite(50, 370, 'apple');
	apple.scale.setTo(.7, .7);

	bouncy = game.add.sprite(75, game.world.height - 152, 'bouncy');
	bouncy.enableBody = true;

	bouncy.scale.setTo(.6, .6);
	players = game.add.group();

	creature = game.add.sprite(game.world.width - 90, game.world.height - 120, 'baddie');
	if (chosenCharacter === 1) {
		player = players.create(500, game.world.height - 150, 'dude1');
		player.enableBody = true;
	} else if (chosenCharacter === 2) {
		player = players.create(500, game.world.height - 150, 'dude2');
		player.enableBody = true;
	} else if (chosenCharacter === 3) {
		player = players.create(500, game.world.height - 150, 'dude3');
		player.enableBody = true;
	} else {
		player = players.create(500, game.world.height - 150, 'dude4');
		player.enableBody = true;
	}

	game.add.sprite(game.world.width - 400, game.world.height - 310, 'frontcave');
	var grass = game.add.sprite(game.world.width - 130, game.world.height - 70, 'smallgrasspatch');


	grass.scale.setTo(1.1, 1);
	ground.scale.setTo(4, 4);

	ground.body.immovable = true;

	var ledge = platforms.create(game.world.width - 165, game.world.height - 200, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.75, 2.05);

	stars = game.add.group();
	stars.enableBody = true;



	for (var i = 1; i < 4; i++) {
		var star = stars.create(1215 + i * 40, 200, 'star' + i);
		star.body.velocity.y = i * 100 + 20;
		star.body.gravity.y = 20;
		if (i % 2 == 0){
			star.animations.add('on', [0, 1, 2, 3, 4, 5, 6, 7], 5, true);
			star.animations.play('on');
		}else{
			star.animations.add('on', [7,6,5,4,3,2,1,0], 5, true);
			star.animations.play('on');
		}
	}
	eyes.enableBody = true;
	game.physics.arcade.enable(eyes);
	game.physics.arcade.enable(player);
	game.physics.arcade.enable(broccoli);
	game.physics.arcade.enable(creature);
	game.physics.arcade.enable(bouncy);
	eyes.body.immovable = true;
	player.body.bounce.y = .180;
	player.body.gravity.y = 425;
	creature.body.bounce.y = .6;
	creature.body.gravity.y = 425;
	broccoli.body.gravity.y = 425;
	player.body.collideWorldBounds = true;
	eyes.body.collideWorldBounds = true;
	creature.body.collideWorldBounds = true;
	broccoli.body.collideWorldBounds = true;
	bouncy.body.collideWorldBounds = true;
	bouncy.body.immovable = true;
	player.animations.add('left', [0, 1], 10, true);
	player.animations.add('right', [3, 4], 10, true);
	player.animations.add('blink', [5, 6, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5], 10, true);
	creature.animations.add('left', [0, 1], 10, true);
	creature.animations.add('right', [2, 3], 10, true);

	bouncy.animations.add('on', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 10, true);
	

	var eyeList = [];
	for (var i = 0; i < 28; i++) {
		eyeList.push(i);
	}

	eyes.animations.add('on', eyeList, 10, true);
	flower.animations.add('on', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 20, true);
	cursors = game.input.keyboard.createCursorKeys();


	



	// scoreText = game.add.text(16, 16, 'Arbitrary Score: 0', {
	// 	fontSize: '28px',
	// 	fill: '#000'
	// });

	eyes.frame = 7;
	bouncy.animations.play('on');
	flower.animations.play('on');
	doneLoading = true;

}

function update() {


	leafContact = -1;
	cloudContact = -1;
	creatureContact = -1;

	game.physics.arcade.collide(broccoli, platforms);
	game.physics.arcade.collide(creature, platforms);
	game.physics.arcade.collide(stars, platforms, function(star) {
		star.kill();
		makeStar()
	});
	game.physics.arcade.overlap(player, stars, collectStar, null, this);
	game.physics.arcade.overlap(player, bouncy, animateBroccoli, null, this);
	game.physics.arcade.overlap(player, platforms, playerOnPlatform, null, this);
	game.physics.arcade.collide(player, platforms);
	game.physics.arcade.overlap(player, creature, playerOnCreature, null, this);
	game.physics.arcade.collide(player, creature);
	game.physics.arcade.collide(player, eyes, function(){console.log('hit the eyes')});


	if (creature.body.onWall()) {
		turnCreature();
	}


	creature.body.velocity.x = direction * 150;
	player.body.velocity.x = 0;

	if (cursors.left.isDown && !cursors.down.isDown) {
		player.body.velocity.x = -150;
		player.animations.play('left');
	} else if (cursors.right.isDown && !cursors.down.isDown) {
		player.body.velocity.x = 150;
		player.animations.play('right');
	} else {
		player.animations.play('blink');
	}

	if (cursors.down.isDown && cursors.left.isDown) {
		player.body.velocity.y = 800;
		player.frame = 8;
	} else if (cursors.down.isDown && cursors.right.isDown) {
		player.body.velocity.y = 800;
		player.frame = 8;
	} else if (cursors.down.isDown && !cursors.up.isDown) {
		player.body.velocity.y = 800;
		player.frame = 8;
	}

	if (cursors.up.isDown && player.body.touching.down) {
		player.body.velocity.y = -400;
	}

	creature.animations.play(creatureDirection);

	playerX = player.position.x;
	playerY = player.position.y;
	playerVel = player.body.velocity.x;
	playerVelY = player.body.velocity.y;
	socket.emit('playerPos', {
		x: playerX,
		y: playerY,
		velocity: playerVel,
		velocityY: playerVelY,
		downKey: cursors.down.isDown,
		id: myId,
		character: chosenCharacter
	});

	// LEAVES
	if (prevLeafContact >= 0 && leafContact === -1) {
		leafOff(prevLeafContact);
	} else {
		leafOn(leafContact);
	}
	prevLeafContact = leafContact;

	// CLOUDS
	if (prevCloudContact >= 0 && cloudContact === -1) {
		cloudOff(prevCloudContact);
	} else {
		cloudOn(cloudContact);
	}
	prevCloudContact = cloudContact;

	tintLeaves();

	playerDistanceFromEyes();
	playerDistanceFromCave();

	// leaves

	if (prevCreatureContact >= 0 && creatureContact === -1) {
		creatureOff(prevCreatureContact);
	} else {
		creatureOn(creatureContact);
	}
	prevCreatureContact = creatureContact;
}


socket.on('entrance', function(data) {
	myId = data.id;
	var msg = {
		character: chosenCharacter,
		x: 500,
		y: game.world.height - 150,
		velocity: playerVel,
		velocityY: playerVelY
	};
	clients[data.id] = msg;
	socket.emit('register', msg);
});

socket.on('onCloud', function(data) {
	cloudOnGuest(data.i, data.r);
})


socket.on('onLeaf', function(data) {
	leafOnGuest(data.i, data.r);
})


socket.on('worldUpdate', function(data) {
	if (doneLoading) {

		for (var key in data) {

			if (key in clients === false) {
				clients[key] = game.add.sprite(500, game.world.height - 150, 'dude' + data[key].character);
				clients[key].animations.add('left', [0, 1], 10, true);
				clients[key].animations.add('right', [3, 4], 10, true);
				clients[key].animations.add('blink', [5, 6, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6,
					5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5,
					5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5
				], 10, true);
			} else {
				if (key !== myId) {
					if (data[key].downKey) {
						clients[key].frame = 8;
					}
					if (data[key].velocity > 0) {
						clients[key].animations.play('right');
					} else if (data[key].velocity < 0) {
						clients[key].animations.play('left');
					} else if (data[key].velocity === 0) {
						clients[key].animations.play('blink');
					}

					clients[key].position.x = data[key].x;
					clients[key].position.y = data[key].y;
				}
			}

		}
	}

});


socket.on('exit', function(data) {
	if (data.id in clients) {
		clients[data.id].destroy();
		delete clients[data.id];
	}
});


function turnCreature() {

	if (creatureDirection == 'left') {
		direction *= -1;
		creatureDirection = 'right';
	} else {
		direction *= -1;
		creatureDirection = 'left';

	}

}



function animateBroccoli() {
	broccoli.body.velocity.y = -300;
}

var appleOn = false;

function playApple() {
	appleOn = true;
	setTimeout(function() {
		appleOn = false;
	});
}


var index = 0;
var touchedEyes = false;

function collectStar(player, star) {
	star.kill()
	makeStar();
	// score += 10;
	// scoreText.text = 'Arbitrary Score: ' + score;
	playStar();
}

function makeStar() {
	var newStar = stars.create(1215 + index * 40, 200, 'star' + (index + 1));
	newStar.body.velocity.y = index * 100 + 20;
	newStar.body.gravity.y = 20;
	if (index % 2 == 0){
			newStar.animations.add('on', [0, 1, 4, 3, 4, 5, 6, 7], 3, true);
			newStar.animations.play('on');
		}else{
			newStar.animations.add('on', [7,6,5,4,3,4,1,0], 3, true);
			newStar.animations.play('on');
		}
	index = (index + 1) % 4;
}


function eyesBlink(player, star) {
	setTimeout(function() {
		touchedEyes = true;
	}, 1000);
	if (!touchedEyes) {
		if (!eyesOpen) {
			eyes.animations.play('on');
			eyesOpen = true;
		} else {
			eyes.frame = 7;
			eyesOpen = false;
		}
	}
}

function playerOnPlatform(player, platform) {

	for (var i = 0; i < leafLedges.length; i++) {
		if (platform === leafLedges[i]) {
			leafContact = i;
		}
	}

	for (var i = 0; i < cloudLedges.length; i++) {
		if (platform === cloudLedges[i]) {
			cloudContact = i;
		}
	}

}

function playerOnCreature(player, platform) {
	creatureContact = 0;
}


function leafOn(index) {
	if (leafContact >= 0 && prevLeafContact < 0) {
		var ranLoopPoint = Math.floor(Math.random() * 100);
		toggleLoopPoint(ranLoopPoint, leafPlayers[index]);

		// start metering the leaf level
		leafPlayers[index].connect(leafMeters[index]);
		socket.emit('leafOn', {
			r: ranLoopPoint,
			i: index
		});

	}
}

function leafOnGuest(index, ran) {
	var ranLoopPoint = ran;
	toggleLoopPoint(ranLoopPoint, leafPlayers[index]);

	// start metering the leaf level
	leafPlayers[index].connect(leafMeters[index]);



}

function leafOff(index) {
	stopLooping(leafPlayers[index]);
}


function cloudOn(index) {
	if (cloudContact >= 0 && prevCloudContact < 0) {
		var ranLoopPoint = Math.floor(Math.random() * 100);
		toggleLoopPoint(ranLoopPoint, cloudPlayers[index]);

		// start metering the leaf level
		cloudPlayers[index].connect(cloudMeters[index]);
		socket.emit('cloudOn', {
			r: ranLoopPoint,
			i: index
		});
	}
}



function cloudOnGuest(index, ran) {
	var ranLoopPoint = ran;
	toggleLoopPoint(ranLoopPoint, cloudPlayers[index]);

	// start metering the leaf level
	cloudPlayers[index].connect(cloudMeters[index]);
}



function cloudOff(index) {
	stopLooping(cloudPlayers[index]);
}

function creatureOn(index) {
	if (creatureContact >= 0 && prevCreatureContact < 0) {
		var ranLoopPoint = Math.floor(Math.random() * 100);
		toggleLoopPoint(ranLoopPoint, creaturePlayers[index]);
	}
}

function creatureOff(index) {
	stopLooping(creaturePlayers[index]);

}



function tintLeaves() {
	for (var i = 0; i < leafMeters.length; i++) {
		var level = leafMeters[i].getLevel();
		level = level * 2000;
		leafSprites[i].tint = parseInt(rgb2hex(255, 255 - level, 255));
	}

	for (var i = 0; i < cloudMeters.length; i++) {
		var level = cloudMeters[i].getLevel();
		level = level * 2000;
		cloudSprites[i].tint = parseInt(rgb2hex(255, 255 - level, 255));
	}
}

function playerDistanceFromEyes() {
	// calculate distance from eyes position
	var distance = getDistance(player.x, player.y, eyes.x, eyes.y);
	var normDistance = Tone.prototype.normalize(distance, 1000, 0);
	normDistanceAnim = Tone.prototype.normalize(distance, 1000, 20) * 10 + 10;
	eyes.animations.currentAnim.speed = normDistanceAnim;
	eyeSynth.setVolume(1 - normDistance);
}

// tweak the masterFilter frequency
function playerDistanceFromCave() {

	// default freq
	var filterFreq = 22050;

	if (player.x > 1200 && player.y > 490) {
		var distance = getDistance(player.x, player.y, 1365, 708);
		filterFreq = p5Map(distance, 2, 150, 50, 2200);
	}
	masterFilter.frequency.exponentialRampToValueAtTime(filterFreq, masterFilter.now() + 0.5);
}


////////////////// HELPER FUNCTIONS ////////////
function rgb2hex(red, green, blue) {
	var rgb = blue | (green << 8) | (red << 16);
	var hexString = '#' + (0x1000000 + rgb).toString(16).slice(1)
	return parseInt(hexString.replace(/^#/, ''), 16);
}

function p5Map(n, start1, stop1, start2, stop2) {
	return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

function getDistance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow((x1 - x2), 2), Math.pow((y1 - y2), 0.2));
}