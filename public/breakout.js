
class Ball {
    constructor(element) {
        this.ball = element
        this.reset()
    }

    reset() {
        this.ball.style.left = '50%'
        this.ball.style.top = '50%'

        this.direction = { x:5, y:4 }
    }

    move() {
        const x = this.ball.offsetLeft + this.direction.x
        const y = this.ball.offsetTop + this.direction.y

        if ( x < 0 || x > 500 ) {
            this.direction.x *= -1
        }
        if ( y < 0 || y > 500 ) {
            this.direction.y *= -1
        }

        this.ball.style.left = x + 'px';
        this.ball.style.top = y + 'px';
    }
}

class BreakOut {
    constructor() {
        this.ball = new Ball(document.querySelector('#ball'))

        this.animation = null
    }

    reset() {
        this.animation = null
        this.ball.reset()
        this.animation = requestAnimationFrame(this.update.bind(this));
    }

    update() {
        this.ball.move()
        this.animation = requestAnimationFrame(this.update.bind(this));
    }
}

const brakout = new BreakOut()
brakout.reset()