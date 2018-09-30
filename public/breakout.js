
class Container {
    constructor(element) {
        this.container = element
    }

    rect() { return this.container.getBoundingClientRect() }

    isCollide(ball) {
        const rec = this.rect()
        if ( ball.getOffsetLeft() <= 0 ) {
            return "left"
        } else if ( rec.width <= ball.getOffsetLeft()) {
            return "right"
        } else if ( ball.getOffsetTop() <= 0 ) {
            return "top"
        } else if ( rec.height <= ball.getOffsetTop()) {
            return "bottom"
        }
        return ""
    }
}

class Ball {
    constructor(element) {
        this.ball = element
        this.reset()
    }

    reset() {
        this.ball.style.left = '50%'
        this.ball.style.top = '50%'

        this.direction = { x:4, y:5 }
    }

    move() {
        const x = this.ball.offsetLeft + this.direction.x
        const y = this.ball.offsetTop + this.direction.y

        this.ball.style.left = x + 'px';
        this.ball.style.top = y + 'px';
    }

    rect() { return this.ball.getBoundingClientRect() }

    turnX() { this.direction.x *= -1 }
    turnY() { this.direction.y *= -1 }

    getOffsetLeft() { return this.ball.offsetLeft }
    getOffsetTop() { return this.ball.offsetTop }
}

class BreakOut {
    constructor() {
        this.container = new Container(document.querySelector('#container'))
        this.ball = new Ball(document.querySelector('#ball'))

        this.animation = null
    }

    reset() {
        this.animation = null

        this.ball.reset()
        this.animation = requestAnimationFrame(this.update.bind(this));
    }

    bounceBall() {
        const bounce = this.container.isCollide(this.ball)
        if ( bounce === "right" || bounce === "left" ) {
            this.ball.turnX()
        } else if ( bounce === "top" || bounce === "bottom") {
            this.ball.turnY()
        }
    }

    update() {
        this.ball.move()
        this.bounceBall()

        this.animation = requestAnimationFrame(this.update.bind(this));
    }
}

const brakout = new BreakOut()
brakout.reset()