var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

game.state.add('play', {
    preload: function() {
        this.game.load.image('forest-back', 'assets/parallax_forest_pack/layers/parallax-forest-back-trees.png');
        this.game.load.image('forest-lights', 'assets/parallax_forest_pack/layers/parallax-forest-lights.png');
        this.game.load.image('forest-middle', 'assets/parallax_forest_pack/layers/parallax-forest-middle-trees.png');
        this.game.load.image('forest-front', 'assets/parallax_forest_pack/layers/parallax-forest-front-trees.png');
        this.game.load.image('aerocephal', 'assets/allacrost_enemy_sprites/aerocephal.png');
        this.game.load.image('arcana_drake', 'assets/allacrost_enemy_sprites/arcana_drake.png');
        this.game.load.image('aurum-drakueli', 'assets/allacrost_enemy_sprites/aurum-drakueli.png');
        this.game.load.image('bat', 'assets/allacrost_enemy_sprites/bat.png');
        this.game.load.image('daemarbora', 'assets/allacrost_enemy_sprites/daemarbora.png');
        this.game.load.image('deceleon', 'assets/allacrost_enemy_sprites/deceleon.png');
        this.game.load.image('demonic_essence', 'assets/allacrost_enemy_sprites/demonic_essence.png');
        this.game.load.image('dune_crawler', 'assets/allacrost_enemy_sprites/dune_crawler.png');
        this.game.load.image('green_slime', 'assets/allacrost_enemy_sprites/green_slime.png');
        this.game.load.image('nagaruda', 'assets/allacrost_enemy_sprites/nagaruda.png');
        this.game.load.image('rat', 'assets/allacrost_enemy_sprites/rat.png');
        this.game.load.image('scorpion', 'assets/allacrost_enemy_sprites/scorpion.png');
        this.game.load.image('skeleton', 'assets/allacrost_enemy_sprites/skeleton.png');
        this.game.load.image('snake', 'assets/allacrost_enemy_sprites/snake.png');
        this.game.load.image('spider', 'assets/allacrost_enemy_sprites/spider.png');
        this.game.load.image('stygian_lizard', 'assets/allacrost_enemy_sprites/stygian_lizard.png');
        this.game.load.image('gold_coin', 'assets/496_RPG_icons/I_GoldCoin.png');
        this.game.load.image('dagger', 'assets/496_RPG_icons/W_Dagger002.png');

        this.level = 1;
        this.levelKills = 0;
        this.levelKillsRequired = 10;

        var bmd = this.game.add.bitmapData(250, 500);
        bmd.ctx.fillStyle = '#9a783d';
        bmd.ctx.strokeStyle = '#35371c';
        bmd.ctx.lineWidth = 12;
        bmd.ctx.fillRect(0, 0, 250, 500);
        bmd.ctx.strokeRect(0, 0, 250, 500);
        this.game.cache.addBitmapData('upgradePanel', bmd);

        var buttonImage = this.game.add.bitmapData(476, 48);
        buttonImage.ctx.fillStyle = '#e6dec7';
        buttonImage.ctx.strokeStyle = '#35371c';
        buttonImage.ctx.lineWidth = 4;
        buttonImage.ctx.fillRect(0, 0, 225, 48);
        buttonImage.ctx.strokeRect(0, 0, 225, 48);
        this.game.cache.addBitmapData('button', buttonImage);

    },
    create: function() {
        var state = this;
        this.background = this.game.add.group();

        ['forest-back', 'forest-lights', 'forest-middle', 'forest-front']
            .forEach(function(image) {
                var bg = state.game.add.tileSprite(0, 0, state.game.world.width,
                    state.game.world.height, image, '', state.background);
                bg.tileScale.setTo(4,4);
            });

        var monsterData = [
            {name: 'Aerocephal', image: 'aerocephal', maxHealth: 10},
            {name: 'Arcana Drake', image: 'arcana_drake', maxHealth: 20},
            {name: 'Aurum Drakueli', image: 'aurum-drakueli', maxHealth: 30},
            {name: 'Bat', image: 'bat', maxHealth: 5},
            {name: 'Daemarbora', image: 'daemarbora', maxHealth: 10},
            {name: 'Deceleon', image: 'deceleon', maxHealth: 10},
            {name: 'Demonic Essence', image: 'demonic_essence', maxHealth: 15},
            {name: 'Dune Crawler', image: 'dune_crawler', maxHealth: 8},
            {name: 'Green Slime', image: 'green_slime', maxHealth: 3},
            {name: 'Nagaruda', image: 'nagaruda', maxHealth: 13},
            {name: 'Rat', image: 'rat', maxHealth: 2},
            {name: 'Scorpion', image: 'scorpion', maxHealth: 2},
            {name: 'Skeleton', image: 'skeleton', maxHealth: 6},
            {name: 'Snake', image: 'snake', maxHealth: 4},
            {name: 'Spider', image: 'spider', maxHealth: 4},
            {name: 'Stygian Lizard', image: 'stygian_lizard', maxHealth: 20}
        ];

        this.monsters = this.game.add.group();
        var monster;
        monsterData.forEach(function(data) {

            monster = state.monsters.create(1000, state.game.world.centerY, data.image);

            monster.anchor.setTo(0.5);

            monster.details = data;

            monster.inputEnabled = true;
            monster.events.onInputDown.add(state.onClickMonster, state);

            monster.health = monster.maxHealth = data.maxHealth;
            monster.events.onKilled.add(state.onKilledMonster, state);
            monster.events.onRevived.add(state.onRevivedMonster, state);
        });

        this.currentMonster = this.monsters.getRandom();
        this.currentMonster.position.set(this.game.world.centerX + 100, this.game.world.centerY);

        this.player = {
            clickDmg: 1,
            gold: 0,
            dps: 0
        };

        this.dmgTextPool = this.add.group();
        var dmgText;
        for (var d=0; d<50; d++) {
            dmgText = this.add.text(0, 0, '1', {
                font: '64px Arial Black',
                fill: '#fff',
                strokeThickness: 4
            });

            dmgText.exists = false;
            dmgText.tween = game.add.tween(dmgText)
                .to({
                    alpha: 0,
                    y: 100,
                    x: this.game.rnd.integerInRange(100, 700)
                }, 1000, Phaser.Easing.Cubic.Out);
            dmgText.tween.onComplete.add(function(text, tween) {
                text.kill();
            });
            this.dmgTextPool.add(dmgText);
        }

        this.coins = this.add.group();
        this.coins.createMultiple(50, 'gold_coin', '', false);
        this.coins.setAll('inputEnabled', true);
        this.coins.setAll('goldValue', 1);
        this.coins.callAll('events.onInputDown.add', 'events.onInputDown', this.onClickCoin, this);

        this.playerGoldText = this.add.text(30, 30, 'Gold: ' + this.player.gold, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });

        this.upgradePanel = this.game.add.image(10, 70, this.game.cache.getBitmapData('upgradePanel'));
        var upgradeButtons = this.upgradePanel.addChild(this.game.add.group());
        upgradeButtons.position.setTo(8, 8);

        var upgradeButtonsData = [
            {icon: 'dagger', name: 'Attack', level: 1, cost: 5, purchaseHandler: function(button, player) {
                    player.clickDmg += 1;
                }},
            {icon: 'swordIcon1', name: 'Auto-Attack', level: 0, cost: 25, purchaseHandler: function(button, player) {
                    player.dps += 5;
                }}
        ];

        var button;
        upgradeButtonsData.forEach(function(buttonData, index) {
            button = state.game.add.button(0, (50 * index), state.game.cache.getBitmapData('button'));
            button.icon = button.addChild(state.game.add.image(6, 6, buttonData.icon));
            button.text = button.addChild(state.game.add.text(42, 6, buttonData.name + ': ' + buttonData.level, {font: '16px Arial Black'}));
            button.details = buttonData;
            button.costText = button.addChild(state.game.add.text(42, 24, 'Cost: ' + buttonData.cost, {font: '16px Arial Black'}));
            button.events.onInputDown.add(state.onUpgradeButtonClick, state);
            upgradeButtons.addChild(button);
        });
        this.dpsTimer = this.game.time.events.loop(100, this.onDPS, this);

        this.monsterInfoUI = this.game.add.group();
        this.monsterInfoUI.position.setTo(this.currentMonster.x - 220, this.currentMonster.y + 120);
        this.monsterNameText = this.monsterInfoUI.addChild(this.game.add.text(0, 0, this.currentMonster.details.name, {
            font: '48px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        }));
        this.monsterHealthText = this.monsterInfoUI.addChild(this.game.add.text(0, 80, this.currentMonster.health + ' HP', {
            font: '32px Arial Black',
            fill: '#ff0000',
            strokeThickness: 4
        }));


        this.levelUI = this.game.add.group();
        this.levelUI.position.setTo(this.game.world.centerX, 30);
        this.levelText = this.levelUI.addChild(this.game.add.text(0, 0, 'Level: ' + this.level, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        }));
        this.levelKillsText = this.levelUI.addChild(this.game.add.text(0, 30, 'Kills: ' + this.levelKills + '/' + this.levelKillsRequired, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        }));
    },
    render: function() {

    },
    onClickMonster: function(monster, pointer) {
        this.currentMonster.damage(this.player.clickDmg);
        this.monsterHealthText.text = this.currentMonster.alive ? this.currentMonster.health + ' HP' : 'DEAD';
        var dmgText = this.dmgTextPool.getFirstExists(false);
        if (dmgText) {
            dmgText.text = this.player.clickDmg;
            dmgText.reset(pointer.positionDown.x, pointer.positionDown.y);
            dmgText.alpha = 1;
            dmgText.tween.start();
        }

        var coin;
        coin = this.coins.getFirstExists(false);
        coin.reset(this.game.world.centerX + this.game.rnd.integerInRange(-100, 100), this.game.world.centerY);
        coin.goldValue = 1;

        this.game.time.events.add(Phaser.Timer.SECOND * 3, this.onClickCoin, this, coin);

    },
    onKilledMonster: function(monster) {

        monster.position.set(1000, this.game.world.centerY);
        var coin;

        coin = this.coins.getFirstExists(false);
        coin.reset(this.game.world.centerX + this.game.rnd.integerInRange(-100, 100), this.game.world.centerY);
        coin.goldValue = Math.round(this.level * 1.33);
        this.game.time.events.add(Phaser.Timer.SECOND * 3, this.onClickCoin, this, coin);
        this.levelKills++;
        if (this.levelKills >= this.levelKillsRequired) {
            this.level++;
            this.levelKills = 0;
        }

        this.currentMonster = this.monsters.getRandom();

        this.currentMonster.maxHealth = Math.ceil(this.currentMonster.details.maxHealth + ((this.level - 1) * 10.6));

        this.currentMonster.revive(this.currentMonster.maxHealth);

        this.levelText.text = 'Level: ' + this.level;
        this.levelKillsText.text = 'Kills: ' + this.levelKills + '/' + this.levelKillsRequired;
    },
    onRevivedMonster: function(monster) {
        monster.position.set(this.game.world.centerX + 100, this.game.world.centerY);

        this.monsterNameText.text = monster.details.name;
        this.monsterHealthText.text = monster.health + 'HP';
    },
    onClickCoin: function(coin) {
        if (!coin.alive) {
            return;
        }
        this.player.gold += coin.goldValue;

        this.playerGoldText.text = 'Gold: ' + this.player.gold;

        coin.kill();
    },
    onUpgradeButtonClick: function(button, pointer) {

        function getAdjustedCost() {
            return Math.ceil(button.details.cost + (button.details.level * 1.46));
        }
        if (this.player.gold - getAdjustedCost() >= 0) {
            this.player.gold -= getAdjustedCost();
            this.playerGoldText.text = 'Gold: ' + this.player.gold;
            button.details.level++;
            button.text.text = button.details.name + ': ' + button.details.level;
            button.costText.text = 'Cost: ' + getAdjustedCost();
            button.details.purchaseHandler.call(this, button, this.player);
        }
    },
    onDPS: function() {
        if (this.player.dps > 0) {
            if (this.currentMonster && this.currentMonster.alive) {
                var dmg = this.player.dps / 10;
                this.currentMonster.damage(dmg);

                this.monsterHealthText.text = this.currentMonster.alive ? Math.round(this.currentMonster.health) + ' HP' : 'DEAD';
            }
        }
    }
});


game.state.start('play');