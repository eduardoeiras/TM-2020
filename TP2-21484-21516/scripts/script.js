
var menuInicial;

var nivelAtual = 'nivel1';
var nivelCompleto = false;
var jaJogou = false;

class PreloadScene extends Phaser.Scene {

    constructor() {
        super("preload");
        menuInicial = this;
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('logoJogo', 'assets/gameTitle.png');
        this.load.image('botao_jogar', 'assets/botao_jogar.png');

    }

    create() {
        let bg = this.add.sprite(0, 0, 'sky').setScale(2);
        bg.setOrigin(0,0);

        this.add.image(420, 250, 'logoJogo');

        var botaoJogar;
        botaoJogar = this.add.image(420, 400, 'botao_jogar').setScale(0.5);
        botaoJogar.setInteractive();
        this.input.on('gameobjectdown', listener);

        function listener(pointer,gameObject) {
            menuInicial.scene.stop('preload');
            menuInicial.scene.start('nivel1');
        }

    }

}


// Declaração dos jogadores e de variáveis para as
// suas vidas

var jogador1;
var vidas1 = 50;

var jogador2;
var vidas2 = 50;

var numTotalDeChaves = 3;

var numChaves = 0;
var numChavesText;
var vidasJogador1Text;
var vidasJogador2Text;
var imgJogadores;

let keyA;
let keyS;
let keyD;
let keyW;
var cursors;

var platforms;
var door;
var parede;
var alavanca;
var gate;
var hearts;
var chaves;

var nivel1;

class Nivel1 extends Phaser.Scene {

    constructor() {
        super("nivel1");
        nivel1 = this;
        vidas1 = 50;
        vidas2 = 50;
        numChaves = 0;
    }

    preload () {
        this.load.image('heart', 'assets/heart.png');
        this.load.image('space', 'assets/space.png')
        this.load.image('ground', 'assets/plataforma_espaco.png');
        this.load.image('chave', 'assets/chave.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('parede', 'assets/parede_espaco.png');
        this.load.image('porta', 'assets/porta.png');
        this.load.image('porta_aberta', 'assets/porta_aberta.png');
        this.load.image('alavanca1', 'assets/alavanca_1.png');
        this.load.image('alavanca2', 'assets/alavanca_2.png');
        this.load.image('jog1_icone', 'assets/jog1_img.png');
        this.load.image('jog2_icone', 'assets/jog2_img.png');
        this.load.image('inimigo_direita', 'assets/inimigo_direita.png');
        this.load.image('inimigo_esquerda', 'assets/inimigo_esquerda.png');
        this.load.spritesheet('jogador1', 'assets/jogador1.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('jogador2', 'assets/jogador2.png', { frameWidth: 32, frameHeight: 48 });
    }

    create () {

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        //Plataformas
        this.add.image(400, 300, 'space').setScale(2);
        platforms = this.physics.add.staticGroup();
        door = this.physics.add.staticGroup();
        parede = this.physics.add.staticGroup();
        platforms.create(450, 735, 'ground').setScale(2.5).refreshBody();

        //lateral e
        platforms.create(60, 300, 'ground');
        platforms.create(60, 500, 'ground');

        //lateral d
        platforms.create(845, 300, 'ground');
        platforms.create(845, 500, 'ground');

        //meio
        platforms.create(450, 600, 'ground').setScale(0.25).refreshBody();
        platforms.create(450, 400, 'ground').setScale(0.25).refreshBody();
        platforms.create(450, 200, 'ground').setScale(0.25).refreshBody();
        platforms.create(250, 100, 'ground').setScale(0.25).refreshBody();
        platforms.create(650, 100, 'ground').setScale(0.25).refreshBody();

        //caixa
        platforms.create(35, 175, 'ground').setScale(0.25).refreshBody();
        gate = this.physics.add.staticGroup();
        gate.create(85, 120, 'parede').setScale(0.30).refreshBody();            //tirar quando o player interagir com o "botao

        door.create(10, 655, 'porta');
        parede.create(0, 295, 'parede').setScale(1.60).refreshBody();
        parede.create(900, 295, 'parede').setScale(2).refreshBody();

        alavanca = this.physics.add.staticGroup();
        alavanca.create(820, 675, 'alavanca1').setScale(1.5);

        //Jogador1
        jogador1 = this.physics.add.sprite(100, 650, 'jogador1');
        jogador1.setBounce(0.2);
        jogador1.setCollideWorldBounds(true);
        if(!jaJogou) {
            nivel1.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers('jogador1', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
            nivel1.anims.create({
                key: 'turn',
                frames: [ { key: 'jogador1', frame: 4 } ],
                frameRate: 20
            });
            nivel1.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('jogador1', { start: 5, end: 8 }), //
                frameRate: 10,
                repeat: -1
            });
        }

        jogador1.body.setGravityY(300);
        this.physics.add.collider(jogador1, platforms);
        this.physics.add.collider(jogador1, parede);             //Permite que o player nao passe abaixo da plataforma

        cursors = this.input.keyboard.createCursorKeys(); //Utilização do Teclado

        //Jogador2
        jogador2 = this.physics.add.sprite(150, 650, 'jogador2');
        jogador2.setBounce(0.2);
        jogador2.setCollideWorldBounds(true);
        if(!jaJogou) {
            nivel1.anims.create({
                key: 'A',
                frames: this.anims.generateFrameNumbers('jogador2', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
            nivel1.anims.create({
                key: 'S',
                frames: [ { key: 'jogador2', frame: 4 } ],
                frameRate: 20
            });
            nivel1.anims.create({
                key: 'D',
                frames: this.anims.generateFrameNumbers('jogador2', { start: 5, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
            jaJogou = true;
        }

        jogador2.body.setGravityY(300);
        this.physics.add.collider(jogador2, platforms);
        this.physics.add.collider(jogador2, parede);

        //Apresentação dos números de chaves e vidas
        numChavesText = this.add.text(375, 15, 'Chaves: 0 / 0', {
            fontSize: '20px', fill: '#fff' });
        vidasJogador1Text = this.add.text(65, 15, 'Vida Jogador 1 : 50', {
            fontSize: '20px', fill: '#fff' });
        vidasJogador2Text = this.add.text(650, 15, 'Vida Jogador 2: 50', {
            fontSize: '20px', fill: '#fff' });

        imgJogadores = this.physics.add.staticGroup();
        imgJogadores.create(45, 20, 'jog1_icone');
        imgJogadores.create(630, 20, 'jog2_icone');

        //Vidas (Pickups)
        hearts = this.physics.add.group({
        });
        hearts.create(200, 0, 'heart').setScale(2.5);

        this.physics.add.collider(hearts, platforms);
        this.physics.add.overlap(jogador1, hearts, collectHeartJog1, null, this);
        this.physics.add.overlap(jogador2, hearts, collectHeartJog2, null, this);
        function collectHeartJog1 (jogador1, heart)
        {
            heart.disableBody(true, true);

            vidas1 += 25;
            //Atualizar as vidas no ecrã

            vidasJogador1Text.setText("Vida Jogador 1: " + vidas1);
        }

        function collectHeartJog2 (jogador2, heart)
        {
            heart.disableBody(true, true);

            vidas2 += 25;

            //Atualizar as vidas no ecrã

            vidasJogador2Text.setText("Vida Jogador 2: " + vidas2);
        }


        //Criar Objetvos (Chaves coletáveis)
        chaves = this.physics.add.group({});
        chaves.create(50, 0, 'chave').setScale(0.8);
        chaves.create(50, 300, 'chave').setScale(0.8);
        chaves.create(800, 300, 'chave').setScale(0.8);

        this.physics.add.collider(chaves, platforms);
        this.physics.add.overlap(jogador1, chaves, collectChave, null, this);
        this.physics.add.overlap(jogador2, chaves, collectChave, null, this);

        function collectChave (jogador1, chave)
        {
            chave.disableBody(true, true);

            numChaves += 1;

            if (numChaves !== 3) {
                numChavesText.setText('Chaves: ' + numChaves + '/' + numTotalDeChaves);
            }
            else {
                numChavesText.setX(300);
                numChavesText.setY(50);
                numChavesText.setText('Todas as chaves coletadas!');
                door.create(10, 655, 'porta_aberta');
                nivelCompleto = true;
            }
        }


        //Inimigos
        this.inimigo1 = this.physics.add.group({
            key: 'inimigo_direita',
            setXY: {
                x: 50,
                y: 250,
            }
        });

        this.inimigo2 = this.physics.add.group({
            key: 'inimigo_esquerda',
            setXY: {
                x: 850,
                y: 250,
            }
        });

        this.physics.add.collider(this.inimigo1, platforms);
        this.physics.add.collider(this.inimigo2, platforms);

        Phaser.Actions.Call(this.inimigo1.getChildren(), function(inimigo) {
            inimigo.speed = 1;
        }, this);

        Phaser.Actions.Call(this.inimigo2.getChildren(), function(inimigo) {
            inimigo.speed = 1;
        }, this);

        //Adição dos coliders à alavanca criada e a função realizada
        this.physics.add.overlap(jogador1, alavanca, colidiuAlavanca, null, this);
        this.physics.add.overlap(jogador2, alavanca, colidiuAlavanca, null, this);

        function colidiuAlavanca(jogador, objeto) {
            objeto.disableBody(true, true);
            alavanca.create(820, 675, 'alavanca2').setScale(1.5);
            gate.destroy(true);
        }

        this.cameras.main.resetFX();
    }



    update () {
        if (cursors.left.isDown)
        {
            jogador1.setVelocityX(-160);
            jogador1.anims.play('left', true); //Se a tecla para a esquerda estiver a ser carregada a animacao e chamada e o player move-se
            // a velocidade 160
        }
        else if (cursors.right.isDown)
        {
            jogador1.setVelocityX(160);
            jogador1.anims.play('right', true);   //Se a tecla para a direita estiver a ser carregada a animacao e chamada e o player move-se
            // a velocidade 160
        }
        else
        {
            jogador1.setVelocityX(0);     //Se nao se carregar o plaayer nao se move e a animaçao e chamada
            jogador1.anims.play('turn');
        }
        if (cursors.up.isDown && jogador1.body.touching.down)
        {
            jogador1.setVelocityY(-430);        //Se a tecla para a cima estiver e o player nao estiver no ar a ser carregada a animacao
                                                // e chamada e o player move-se a velocidade 160
        }


        if (keyA.isDown)
        {
            jogador2.setVelocityX(-160);
            jogador2.anims.play('A', true); //Se a tecla para a esquerda estiver a ser carregada a animacao e chamada e o player move-se
            // a velocidade 160
        }
        else if (keyD.isDown)
        {
            jogador2.setVelocityX(160);
            jogador2.anims.play('D', true);   //Se a tecla para a direita estiver a ser carregada a animacao e chamada e o player move-se
            // a velocidade 160
        }
        else
        {
            jogador2.setVelocityX(0);     //Se nao se carregar o plaayer nao se move e a animaçao e chamada
            jogador2.anims.play('S');
        }
        if (keyW.isDown && jogador2.body.touching.down)
        {
            jogador2.setVelocityY(-430);        //Se a tecla para a cima estiver e o player nao estiver no ar a ser carregada a animacao
            // e chamada e o player move-se a velocidade 160
        }

        let porta = door.getChildren();

        if(nivelCompleto) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(jogador1.getBounds(), porta[1].getBounds())
            && Phaser.Geom.Intersects.RectangleToRectangle(jogador2.getBounds(), porta[1].getBounds())) {
                nivelCompleto = false;
                vidas1 = 50;
                vidas2 = 50;
                numChaves = 0;
                nivel1.scene.stop('nivel1');
                nivel1.scene.start('nivel2');
            }
        }

        let numInimigos = 1;

        let inimigo1 = this.inimigo1.getChildren();
        movimentarInimigo(inimigo1, numInimigos, 250, 50);

        let inimigo2 = this.inimigo2.getChildren();
        movimentarInimigo(inimigo2, numInimigos, 850, 650);


        function movimentarInimigo(inimigos, numInimigos, maxX, minX) {
            for (let i = 0; i < numInimigos; i++) {
                inimigos[i].x += inimigos[i].speed;

                if (inimigos[i].x >= maxX && inimigos[i].speed > 0) {
                    inimigos[i].speed *= -1;
                } else if (inimigos[i].x <= minX && inimigos[i].speed < 0) {
                    inimigos[i].speed *= -1;
                }

                if (Phaser.Geom.Intersects.RectangleToRectangle(jogador1.getBounds(), inimigos[i].getBounds())) {
                    if (vidas1 - 1 <= 0) {
                        gameOver(nivel1, nivelAtual, 'nivel1');
                    }
                    else {
                        vidas1 = vidas1 - 1;
                        vidasJogador1Text.setText("Vida Jogador 1: " + vidas1);
                    }
                }
                if (Phaser.Geom.Intersects.RectangleToRectangle(jogador2.getBounds(), inimigos[i].getBounds())) {
                    if (vidas2 - 1 <= 0) {
                        gameOver(nivel1, nivelAtual, 'nivel1');
                    }
                    else {
                        vidas2 = vidas2 - 1;
                        vidasJogador2Text.setText("Vida Jogador 2: " + vidas2);
                    }
                }
            }
        }
    }
}

var nivel2;

class Nivel2 extends Phaser.Scene {
    constructor() {
        super("nivel2");
    }

    preload(){
        this.load.image('heart', 'assets/heart.png');
        this.load.image('sky', 'assets/sky.png');
        this.load.image('mountains', 'assets/mountains.png');
        this.load.image('ground_montanha', 'assets/plataforma_montanha.png');
        this.load.image('chave', 'assets/chave.png');
        this.load.image('parede_montanha', 'assets/parede.png');
        this.load.image('porta', 'assets/porta.png');
        this.load.image('porta_aberta', 'assets/porta_aberta.png');
        this.load.image('jog1_icone', 'assets/jog1_img.png');
        this.load.image('jog2_icone', 'assets/jog2_img.png');
        this.load.image('inimigo_direita', 'assets/inimigo_direita.png');
        this.load.image('inimigo_esquerda', 'assets/inimigo_esquerda.png');
        this.load.spritesheet('jogador1', 'assets/jogador1.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('jogador2', 'assets/jogador2.png', { frameWidth: 32, frameHeight: 48 });
    }

    create(){
        this.numChaves = 0;

        nivel2 = this;
        nivelAtual = 'nivel2';

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        this.add.image(100, 100, 'sky').setScale(2);
        this.add.image(300, 390, 'mountains').setScale(2);
        this.platforms = this.physics.add.staticGroup();
        this.doors = this.physics.add.staticGroup();
        this.parede = this.physics.add.staticGroup();
        this.platforms.create(450, 735, 'ground_montanha').setScale(2.5).refreshBody();

        //lateral
        this.platforms.create(450, 550, 'ground_montanha').setScale(1.25).refreshBody();
        this.platforms.create(275, 550, 'ground_montanha').setScale(1.25).refreshBody();
        this.platforms.create(10, 350, 'ground_montanha').setScale(1.25).refreshBody();
        this.platforms.create(670, 350, 'ground_montanha').setScale(1.25).refreshBody();
        this.platforms.create(675, 150, 'ground_montanha').setScale(1.25).refreshBody();
        this.platforms.create(450, 150, 'ground_montanha').setScale(1.25).refreshBody();

        //Plataformas dinâmicas
        this.dynamicPlatforms1 = this.physics.add.image(100, 135, 'ground_montanha')
            .setImmovable(true)
            .setVelocity(100, -100)
            .setScale(0.25);
        this.dynamicPlatforms2 = this.physics.add.image(350, 350, 'ground_montanha')
            .setImmovable(true)
            .setVelocity(100, -100)
            .setScale(0.25);
        this.dynamicPlatforms3 = this.physics.add.image(800, 540, 'ground_montanha')
            .setImmovable(true)
            .setVelocity(200, -200)
            .setScale(0.25);

        this.dynamicPlatforms1.body.setAllowGravity(false);
        this.dynamicPlatforms2.body.setAllowGravity(false);
        this.dynamicPlatforms3.body.setAllowGravity(false);

        this.tweens.timeline({
            targets: this.dynamicPlatforms1.body.velocity,
            loop: -1,
            tweens: [
                { x:    0, y: 180, duration: 1000, ease: 'Stepped' },
                { x:    0, y: -180, duration: 1000, ease: 'Stepped' }
            ]
        });

        this.tweens.timeline({
            targets: this.dynamicPlatforms2.body.velocity,
            loop: -1,
            tweens: [
                { x:    0, y: 40, duration: 4000, ease: 'Stepped' },
                { x:    0, y: -40, duration: 4000, ease: 'Stepped' }
            ]
        });

        this.tweens.timeline({
            targets: this.dynamicPlatforms3.body.velocity,
            loop: -1,
            tweens: [
                { x:    0, y: 140, duration: 1000, ease: 'Stepped' },
                { x:    0, y: -140, duration: 1000, ease: 'Stepped' }
            ]
        });



        this.parede.create(0, 390, 'parede_montanha').setScale(1.55).refreshBody();
        this.parede.create(900, 295, 'parede_montanha').setScale(2).refreshBody();

        this.doors.create(0, 40, 'porta');

        jogador1 = this.physics.add.sprite(100, 650, 'jogador1');
        jogador1.setBounce(0.2);
        jogador1.setCollideWorldBounds(true);
        jogador1.body.setGravityY(600);
        this.physics.add.collider(jogador1, this.platforms);
        this.physics.add.collider(jogador1, this.dynamicPlatforms1);
        this.physics.add.collider(jogador1, this.dynamicPlatforms2);
        this.physics.add.collider(jogador1, this.dynamicPlatforms3);
        this.physics.add.collider(jogador1, this.parede);             //Permite que o player nao passe abaixo da plataforma

        cursors = this.input.keyboard.createCursorKeys(); //Utilização do Teclado

        //Jogador2
        jogador2 = this.physics.add.sprite(150, 650, 'jogador2');
        jogador2.setBounce(0.2);
        jogador2.setCollideWorldBounds(true);
        jogador2.body.setGravityY(600);
        this.physics.add.collider(jogador2, this.platforms);
        this.physics.add.collider(jogador2, this.dynamicPlatforms1);
        this.physics.add.collider(jogador2, this.dynamicPlatforms2);
        this.physics.add.collider(jogador2, this.dynamicPlatforms3);
        this.physics.add.collider(jogador2, this.parede);

        //Apresentação dos números de chaves e vidas
        this.numChavesText = this.add.text(375, 15, 'Chaves: 0 / 0', {
            fontSize: '20px', fill: '#fff' });
        vidasJogador1Text = this.add.text(65, 15, 'Vida Jogador 1 : 50', {
            fontSize: '20px', fill: '#fff' });
        vidasJogador2Text = this.add.text(650, 15, 'Vida Jogador 2: 50', {
            fontSize: '20px', fill: '#fff' });

        imgJogadores = this.physics.add.staticGroup();
        imgJogadores.create(45, 20, 'jog1_icone');
        imgJogadores.create(630, 20, 'jog2_icone');

        //Vidas (Pickups)
        hearts = this.physics.add.group({
        });
        hearts.create(100, 0, 'heart').setScale(1.5);
        hearts.create(840, 250, 'heart').setScale(1.5);

        this.physics.add.collider(hearts, this.platforms);
        this.physics.add.collider(hearts, this.dynamicPlatforms1);
        this.physics.add.overlap(jogador1, hearts, collectHeartJog1, null, this);
        this.physics.add.overlap(jogador2, hearts, collectHeartJog2, null, this);
        function collectHeartJog1 (jogador1, heart)
        {
            heart.disableBody(true, true);

            vidas1 += 25;
            //Atualizar as vidas no ecrã

            vidasJogador1Text.setText("Vida Jogador 1: " + vidas1);
        }

        function collectHeartJog2 (jogador2, heart)
        {
            heart.disableBody(true, true);

            vidas2 += 25;

            //Atualizar as vidas no ecrã

            vidasJogador2Text.setText("Vida Jogador 2: " + vidas2);
        }


        //Criar Objetvos (Chaves coletáveis)
        this.chaves = this.physics.add.group({});
        this.chaves.create(845, 100, 'chave').setScale(0.8);
        this.chaves.create(50, 500, 'chave').setScale(0.8);
        this.chaves.create(800, 300, 'chave').setScale(0.8);

        this.physics.add.collider(this.chaves, this.platforms);
        this.physics.add.overlap(jogador1, this.chaves, collectChave, null, this);
        this.physics.add.overlap(jogador2, this.chaves, collectChave, null, this);

        function collectChave (jogador1, chave)
        {
            chave.disableBody(true, true);

            this.numChaves += 1;

            if (this.numChaves !== 3) {
                this.numChavesText.setText('Chaves: ' + this.numChaves + '/' + numTotalDeChaves);
            }
            else {
                this.numChavesText.setX(300);
                this.numChavesText.setY(50);
                this.numChavesText.setText('Todas as chaves coletadas!');
                this.doors.create(0, 40, 'porta_aberta');
                nivelCompleto = true;
            }
        }

        this.inimigo1 = this.physics.add.group({
            key: 'inimigo_direita',
            setXY: {
                x: 50,
                y: 500,
            }
        });

        this.inimigo2 = this.physics.add.group({
            key: 'inimigo_direita',
            setXY: {
                x: 150,
                y: 500,
            }
        });

        this.inimigo3 = this.physics.add.group({
            key: 'inimigo_esquerda',
            setXY: {
                x: 850,
                y: 250,
            }
        });


        this.physics.add.collider(this.inimigo1, this.platforms);
        this.physics.add.collider(this.inimigo2, this.platforms);
        this.physics.add.collider(this.inimigo3, this.platforms);

        Phaser.Actions.Call(this.inimigo1.getChildren(), function(inimigo) {
            inimigo.speed = 0.8;
        }, this);

        Phaser.Actions.Call(this.inimigo2.getChildren(), function(inimigo) {
            inimigo.speed = 0.8;
        }, this);

        Phaser.Actions.Call(this.inimigo3.getChildren(), function(inimigo) {
            inimigo.speed = 1;
        }, this);

    }

    update(){
        if (cursors.left.isDown)
        {
            jogador1.setVelocityX(-160);
            jogador1.anims.play('left', true); //Se a tecla para a esquerda estiver a ser carregada a animacao e chamada e o player move-se
            // a velocidade 160
        }
        else if (cursors.right.isDown)
        {
            jogador1.setVelocityX(160);
            jogador1.anims.play('right', true);   //Se a tecla para a direita estiver a ser carregada a animacao e chamada e o player move-se
            // a velocidade 160
        }
        else
        {
            jogador1.setVelocityX(0);     //Se nao se carregar o plaayer nao se move e a animaçao e chamada
            jogador1.anims.play('turn');
        }
        if (cursors.up.isDown && jogador1.body.touching.down)
        {
            jogador1.setVelocityY(-430);        //Se a tecla para a cima estiver e o player nao estiver no ar a ser carregada a animacao
                                                // e chamada e o player move-se a velocidade 160
        }


        if (keyA.isDown)
        {
            jogador2.setVelocityX(-160);
            jogador2.anims.play('A', true); //Se a tecla para a esquerda estiver a ser carregada a animacao e chamada e o player move-se
            // a velocidade 160
        }
        else if (keyD.isDown)
        {
            jogador2.setVelocityX(160);
            jogador2.anims.play('D', true);   //Se a tecla para a direita estiver a ser carregada a animacao e chamada e o player move-se
            // a velocidade 160
        }
        else
        {
            jogador2.setVelocityX(0);     //Se nao se carregar o plaayer nao se move e a animaçao e chamada
            jogador2.anims.play('S');
        }
        if (keyW.isDown && jogador2.body.touching.down)
        {
            jogador2.setVelocityY(-430);        //Se a tecla para a cima estiver e o player nao estiver no ar a ser carregada a animacao
            // e chamada e o player move-se a velocidade 160
        }
        let porta = this.doors.getChildren();

        if(nivelCompleto) {
            if(Phaser.Geom.Intersects.RectangleToRectangle(jogador1.getBounds(), porta[1].getBounds())
                && Phaser.Geom.Intersects.RectangleToRectangle(jogador2.getBounds(), porta[1].getBounds())) {
                nivel2.scene.stop('nivel2');
                nivel2.scene.start('gamewon');
            }
        }


        let inimigo1 = this.inimigo1.getChildren();
        movimentarInimigo(inimigo1, 1, 450, 50);

        let inimigo2 = this.inimigo2.getChildren();
        movimentarInimigo(inimigo2, 1, 700, 450);

        let inimigo3 = this.inimigo3.getChildren();
        movimentarInimigo(inimigo3, 1, 850, 550);

    }
}

function movimentarInimigo(inimigos, numInimigos, maxX, minX) {
    for (let i = 0; i < numInimigos; i++) {
        inimigos[i].x += inimigos[i].speed;

        if (inimigos[i].x >= maxX && inimigos[i].speed > 0) {
            inimigos[i].speed *= -1;
        } else if (inimigos[i].x <= minX && inimigos[i].speed < 0) {
            inimigos[i].speed *= -1;
        }

        if (Phaser.Geom.Intersects.RectangleToRectangle(jogador1.getBounds(), inimigos[i].getBounds())) {
            if (vidas1 - 1 <= 0) {
                gameOver(nivel2, nivelAtual, 'nivel2');
            }
            else {
                vidas1 = vidas1 - 1;
                vidasJogador1Text.setText("Vida Jogador 1: " + vidas1);
            }
        }
        if (Phaser.Geom.Intersects.RectangleToRectangle(jogador2.getBounds(), inimigos[i].getBounds())) {
            if (vidas2 - 1 <= 0) {
                gameOver(nivel2, nivelAtual, 'nivel2');
            }
            else {
                vidas2 = vidas2 - 1;
                vidasJogador2Text.setText("Vida Jogador 2: " + vidas2);
            }
        }
    }
}

function gameOver(nivel, nivelAtual, nivelId) {
    nivel.cameras.main.shake(500);

    nivel.time.delayedCall(250, function () {
        nivel.cameras.main.fade(250);
    }, [], nivel);
    vidas1 = 50;
    vidas2 = 50;
    numChaves = 0;
    nivel.scene.stop(nivelId);
    nivel.scene.start('gameover');
}

class GameOverScene extends Phaser.Scene {

    constructor() {
        super("gameover");
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('game_over', 'assets/gameOver.png');
        this.load.image('tentarNovamente', 'assets/botao_tentarNovamente.png');
        this.load.image('menuInicial', 'assets/botao_menuInicial.png');
    }

    create() {

        let bg = this.add.sprite(0, 0, 'sky').setScale(1.5);
        bg.setOrigin(0,0);

        var gameOverImg;
        gameOverImg = this.physics.add.staticGroup();
        gameOverImg.create(420, 150, 'game_over');

        var btnTentarNovamente;
        btnTentarNovamente = this.add.image(420, 300, 'tentarNovamente').setScale(0.5);
        btnTentarNovamente.setInteractive();

        var btnMenuInicial;
        btnMenuInicial = this.add.image(420, 400, 'menuInicial').setScale(0.5);
        btnMenuInicial.setInteractive();

        this.input.on('gameobjectdown', botaoPressionado);
        function botaoPressionado(pointer,gameObject) {
            if(gameObject === btnMenuInicial) {
                game.scene.stop('gameover');
                game.scene.start('preload');
            }
            else {
                game.scene.stop('gameover');
                game.scene.start(nivelAtual);
            }
        }
    }

}

class GameWonScene extends Phaser.Scene {

    constructor() {
        super("gamewon");
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('game_won', 'assets/gameWon.png');
        this.load.image('menuInicial', 'assets/botao_menuInicial.png');
    }

    create() {

        let bg = this.add.sprite(0, 0, 'sky').setScale(1.5);
        bg.setOrigin(0,0);

        this.gameWonImg = this.physics.add.staticGroup();
        this.gameWonImg.create(420, 150, 'game_won').setScale(0.5);

        var btnMenuInicial;
        btnMenuInicial = this.add.image(420, 400, 'menuInicial').setScale(0.5);
        btnMenuInicial.setInteractive();
        this.input.on('gameobjectdown', botaoPressionado);
        function botaoPressionado(pointer,gameObject) {
            game.scene.stop('gamewon');
            game.scene.start('preload');
        }
    }

}

let config = {
    type: Phaser.AUTO,
    width: 900,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [
        PreloadScene, Nivel1, Nivel2, GameOverScene, GameWonScene
    ]
};

let game = new Phaser.Game(config);