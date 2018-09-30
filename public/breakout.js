
class Container {
    constructor(element) {
        this.container = element
    }

    rect() {
        return this.container.getBoundingClientRect()
    }

    isCollide(ball) {
        const rec = this.rect()
        if ( ball.getOffetLeft() <= 0 ) {
            return "left"
        } else if ( rec.width <= ball.getOffetLeft()) {
            return "right"
        } else if ( ball.getOffetTop() <= 0 ) {
            return "top"
        } else if ( rec.height <= ball.getOffetTop()) {
            return "bottom"
        }
        return ""
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

    rect() {
        return this.paddle.getBoundingClientRect()
    }

    isCollide(ball) {
        const rect = this.rect()
        var rectBall = ball.rect();
        
        if ( !(
            rect.bottom < rectBall.top ||
            rect.top > rectBall.bottom ||
            rect.right < rectBall.left ||
            rect.left > rectBall.right
        )) {
            return ((rectBall.x - rect.x) / rect.width) * 10 - 5
        }
        return 0
    }
}


class Ball {
    constructor(element) {
        this.ball = element
        this.reset()
    }

    reset() {
        this.direction = {
            x: 0,
            y: 5
        }
        this.ball.style.left = '50%'
        this.ball.style.top = '50%'
    }

    move() {
        const x = this.ball.offsetLeft + this.direction.x
        const y = this.ball.offsetTop + this.direction.y

        this.ball.style.left = x + 'px';
        this.ball.style.top = y + 'px';
    }

    setX(dir) {
        this.direction.x = dir
    }

    turnX() {
        this.direction.x *= -1
    }

    turnY() {
        this.direction.y *= -1
    }

    rect() {
        return this.ball.getBoundingClientRect()
    }

    getOffetLeft() {
        return this.ball.offsetLeft
    }

    getOffetTop() {
        return this.ball.offsetTop
    }
}

class BreakOut {
    constructor() {
        this.container = new Container(document.querySelector('#container'))
        this.paddle = new Paddle(document.querySelector('#paddle'))
        this.ball = new Ball(document.querySelector('#ball'))
        this.button = document.querySelector("#start");

        document.addEventListener("keydown", this.keyDown.bind(this) )
        document.addEventListener("keyup", this.keyUp.bind(this) )
        this.button.addEventListener("click", this.start.bind(this))

        this.animation = null
    }

    reset() {
        if (this.animation) {
            cancelAnimationFrame(this.animation)
        }
        this.animation = null
        this.button.innerHTML = "Start"

        this.ball.reset()
    }

    start() {
        if (this.animation === null) {
            this.button.innerHTML = "Pause"
            this.animation = requestAnimationFrame(this.update.bind(this));
        } else {
            cancelAnimationFrame(this.animation);
            this.animation = null;
            this.button.innerHTML = "Start"
        }
    }

    keyUp(e) {
        e.preventDefault()
        this.paddle.keyUp(e)
        if (this.animation === null) {
            this.start()
        }
    }

    keyDown(e) {
        e.preventDefault()
        this.paddle.keyDown(e)
    }

    bounceBall() {
        const bounce = this.container.isCollide(this.ball)
        if ( bounce === "right" || bounce === "left" ) {
            this.ball.turnX()
        } else if ( bounce === "top" || bounce === "bottom") {
            this.ball.turnY()
        }
    
        const hitPosion = this.paddle.isCollide(this.ball)
        if ( hitPosion != 0 ) {
            this.ball.setX(hitPosion)
            this.ball.turnY()
        }
    }

    update() {
        this.paddle.move()
        this.ball.move()
        
        this.bounceBall()

        this.animation = requestAnimationFrame(this.update.bind(this));
    }
}

const brakout = new BreakOut()
brakout.reset()