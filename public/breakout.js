
class Container {
    constructor(element) {
        this.container = element
    }
}

class Paddle {
    constructor(element) {
        this.paddle = element
        this.direction = 'stop'
    }

    keyDown(event) {
        if (event.key === "ArrowRight") {
            this.direction = "right"
        } else if (event.key === "ArrowLeft") {
            this.direction = "left"
        }
    }

    keyUp(event) {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            this.direction = "stop"
        }
    }

    move() {
        let left = this.paddle.offsetLeft;
        if (this.direction === "left") {
            left -= 5;
        } else if (this.direction === "right") {
            left += 5;
        }
        this.paddle.style.left = left + 'px';
    }
}


class Ball {
    constructor(element) {
        this.ball = element
    }
}

class BreakOut {
    constructor() {
        this.status = 'initial'
        this.container = new Container(document.querySelector('#container'))
        this.paddle = new Paddle(document.querySelector('#paddle'))
        this.ball = new Ball(document.querySelector('#ball'))
        this.button = document.querySelector("#start")

        this.button.addEventListener("click", this.start.bind(this))
        document.addEventListener("keydown", this.keyDown.bind(this))
        document.addEventListener("keyup", this.keyUp.bind(this))

        this.animation = null
    }

    start() {
        if (this.status === 'finish') {
            location.reload();
        } else if (this.animation === null) {
            this.button.innerHTML = 'Pause'
            this.status = 'waiting'
            this.animation = requestAnimationFrame(this.update.bind(this))
        } else {
            this.button.innerHTML = 'Start'
            cancelAnimationFrame(this.animation)
            this.animation = null
        }
    }

    keyUp(e) {
        e.preventDefault()
        if (this.status === 'waiting' && e.key === 'ArrowUp') {
            this.status = 'moving'
        }
        this.paddle.keyUp(e)
    }

    keyDown(e) {
        e.preventDefault()
        this.paddle.keyDown(e)
    }

    update() {
        this.paddle.move()
        this.animation = requestAnimationFrame(this.update.bind(this));
    }
}

window.onload = function () {
    window.breakout = new BreakOut()
    console.log(window.breakout)
}
