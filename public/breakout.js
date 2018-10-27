
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
            console.log(this.direction)
        } else if (event.key === "ArrowLeft") {
            this.direction = "left"
            console.log(this.direction)
        }
    }

    keyUp(event) {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            this.direction = "stop"
            console.log(this.direction)
        }
    }
}


class Ball {
    constructor(element) {
        this.ball = element
    }
}

class BreakOut {
    constructor() {
        this.container = new Container(document.querySelector('#container'))
        this.paddle = new Paddle(document.querySelector('#paddle'))
        this.ball = new Ball(document.querySelector('#ball'))
        this.button = document.querySelector("#start")

        document.addEventListener("keydown", this.keyDown.bind(this))
        document.addEventListener("keyup", this.keyUp.bind(this))
    }

    keyUp(e) {
        e.preventDefault()
        this.paddle.keyUp(e)
    }

    keyDown(e) {
        e.preventDefault()
        this.paddle.keyDown(e)
    }
}

window.onload = function () {
    window.breakout = new BreakOut()
    console.log(window.breakout)
}
