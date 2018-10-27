
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
    }
}

window.onload = function () {
    window.breakout = new BreakOut()
    console.log(window.breakout)
}
