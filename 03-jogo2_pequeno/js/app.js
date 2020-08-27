// VARIÁVEIS USADAS NO ESCOPO
var coletado = 0;

// Inimigos que o jogador deve evitar
var Enemy = function (x, y, lado) {
    // Variáveis aplicadas a cada instância devem ser declaradas aqui
    this.x = x;
    this.y = y;
    this.vi = 100;
    this.vf = 200;
    this.lado = lado;
    this.velocidade = aleatorio(this.vi, this.vf);/* COLOCAR UMA FUNÇÃO PARA MUDAR A VELOCIDADE DO INIMIGO */

    // A imagem dos inimigos, this usa uma classe helper que carrega
    // a imagem facilmente
    this.sprite = ['images/inseto.png', 'images/inseto2.png'];
};

// Atualiza a posição de um inimigo
// Parâmetro: dt, um intervalo de tempo entre atualizações
Enemy.prototype.update = function (dt) {
    // Você deve multiplicar cada movimento por dt    
    // assegura que o jogo rode na mesma velocidade em todos computadores.

    //atualizando posição do inimigo
    if (this.lado === 1) {
        this.x += this.velocidade * dt;

        if (this.x > 5 * 101) {
            this.reiniciar();
            this.velocidade = aleatorio(this.vi, this.vf);
        }
    }
    if (this.lado === 0) {
        this.x -= this.velocidade * dt;
        if (this.x < -2 * 101) {
            this.reiniciar();
            this.velocidade = aleatorio(this.vi, this.vf);
        }
    }

    colisao(player.x, player.y, this.x, this.y);

};

// Desenha o inimigo na tela
Enemy.prototype.render = function () {
    if (this.lado == 1) {
        ctx.drawImage(Resources.get(this.sprite[0]), this.x, this.y);
    } else {
        ctx.drawImage(Resources.get(this.sprite[1]), this.x, this.y);
    }

};

Enemy.prototype.reiniciar = function () {
    if (this.lado == 1) {
        this.x = -2 * 101;
    } else {
        this.x = 6 * 101;
    }
};

Enemy.prototype.maisspeed = function () {
    this.velocidade = aleatorio(this.vi += 7, this.vf += 7);
};

// Agora escreva a class Player
// Ela requer os métodos update(), render() e handleInput().

var Player = function (x, y) {
    this.row = 5;
    this.col = 2;
    this.x = this.col * 101;
    this.y = this.row * 83;
    this.sprite = 'images/personagem-garoto.png';
};

Player.prototype.update = function () {
    if (this.col < 0) {
        this.col = 0;
    }

    if (this.col > 4) {
        this.col = 4;
    }

    if (this.row > 5) {
        this.row = 5;
    }

    if (this.row == 0) {
        info.pontos += info.round * 50;
        info.round += 1;
        allEnemies.forEach(function (enemy) {
            enemy.maisspeed();
        });
        this.reiniciar();
        info.mostrar();
    }
    this.x = this.col * 101;
    this.y = this.row * 83;
    //console.log(this.x + " - " + this.y);    
    bonus.coletar();
    //console.log(pontos);
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (seta) {
    switch (seta) {
        case 'up':
            this.row--;
            break;
        case 'right':
            this.col++;
            break;
        case 'down':
            this.row++;
            break;
        case 'left':
            this.col--;
            break;
    }
};

//QUANDO CHEGAR NA ÁGUA, REINICIAR O JOGO
Player.prototype.reiniciar = function () {
    this.col = 2;
    this.row = 5;
    coletado = 0;
    bonus = new Bonus();
    this.x = this.col * 101;
    this.y = this.row * 83;
};

// Agora instancie seus objetos.
// Coloque todos os objetos inimigos em um array chamado allEnemies
// Coloque o jogador em uma variável chamada player

var allEnemies = [];
allEnemies.push(new Enemy(-2 * 101, 1 * 83, 1));
allEnemies.push(new Enemy(6 * 101, 2 * 83, 0));
allEnemies.push(new Enemy(-2 * 101, 3 * 83, 1));
allEnemies.push(new Enemy(-2 * 101, 1 * 83, 1));
allEnemies.push(new Enemy(-2 * 101, 3 * 83, 1));

var player = new Player();

// Esta função escuta pela tecla pressionada e envia a tecla para o método
// Player.handleInput(). Você não precisa modificar.
document.addEventListener('keydown', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

function aleatorio(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function colisao(xp, yp, xe, ye) {
    if (Math.abs(xe - xp) < 80 && Math.abs(ye - yp) < 60) {
        info.vidas -= 1;
        player.reiniciar();
        info.round += 1;
        info.mostrar();
    }
    if (info.vidas == 0) {
        perdeu();
        alert("Game Over! O jogo vai iniciar novamente!");
        allEnemies.forEach(function (enemy) {
            enemy.vi = 100;
            enemy.vf = 200;
        });
        player.reiniciar();
        info.mostrar();
    }
}

function perdeu() {
    info.round = 1;
    info.vidas = 3;
    info.pontos = 0;
    info.estrela = 0;
    info.azul = 0;
    info.laranja = 0;
    info.verde = 0;
}

var lista_bonus = ['images/coracao.png',
    'images/estrela.png',
    'images/gema-azul.png',
    'images/gema-laranja.png',
    'images/gema-verde.png'],
    numBonus = 5;

var Bonus = function (x, y, qual) {
    this.x = aleatorio(1, 5) * 101;
    this.y = aleatorio(1, 2) * 83;
    this.escolhido = aleatorio(0, 4);
    this.qual = lista_bonus[this.escolhido];
};

Bonus.prototype.render = function (x) {
    if (x == 0) {
        ctx.drawImage(Resources.get(this.qual), this.x, this.y);
    }
};

Bonus.prototype.extras = function (x) {
    switch (x) {
        case 0:
            info.vidas += 1;
            break;
        case 1:
            info.pontos += 200;
            info.estrela += 1;
            break;
        case 2:
            info.pontos += 100;
            info.azul += 1;
            break;
        case 3:
            info.pontos += 50;
            info.laranja += 1;
            break;
        case 4:
            info.pontos += 20;
            info.verde += 1;
            break;
    }
};

Bonus.prototype.coletar = function () {
    if (this.x === player.x && this.y === player.y) {
        if (coletado == 0) {
            coletado = 1;
            bonus.render(coletado);
            bonus.extras(this.escolhido);
        }
    }
};

var bonus = new Bonus();

function teste() {
    this.bonus = new Bonus();
}

setInterval(teste, 10000);


var Obstaculo = function (x, y) {
    this.x = x * 101;
    this.y = y * 83;
    this.pedra = 'images/rocha.png';
};

Obstaculo.prototype.render = function () {
    ctx.drawImage(Resources.get(this.pedra), this.x, this.y);
};

var obstaculos = [];
for (var i = 0; i < 3; i++) {
    obstaculos.push(new Obstaculo(aleatorio(1, 6), aleatorio(1, 4)));
}

var InfoJogo = function () {
    this.pontos = 0;
    this.vidas = 3;
    this.round = 1;
    this.estrela = 0;
    this.azul = 0;
    this.laranja = 0;
    this.verde = 0;
};

InfoJogo.prototype.mostrar = function () {
    document.getElementById('rounds').innerHTML = this.round;
    document.getElementById('vidas').innerHTML = this.vidas;
    document.getElementById('pontos').innerHTML = this.pontos;

    document.getElementById('estrela').innerHTML = this.estrela;
    document.getElementById('azul').innerHTML = this.azul;
    document.getElementById('laranja').innerHTML = this.laranja;
    document.getElementById('verde').innerHTML = this.verde;
}

var info = new InfoJogo();
info.mostrar();