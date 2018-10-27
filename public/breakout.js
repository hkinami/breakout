
class Container {
    constructor(element) {
        this.container = element
        this.bricks = []
    }

    rect() { return this.container.getBoundingClientRect() }

    isCollide(ball) {
        const rec = this.rect()
        if (ball.offsetLeft() <= 0) {
            return "left"
        } else if (rec.width <= ball.offsetLeft()) {
            return "right"
        } else if (ball.offsetTop() <= 0) {
            return "top"
        } else if (rec.height <= ball.offsetTop()) {
            return "bottom"
        }
        return ""
    }

    append(brick) {
        this.bricks.push(brick)
        this.container.appendChild(brick.element())
    }

    removeHitBlock(ball) {
        const index = this.bricks.findIndex((brick) => brick.isCollide(ball))
        if (index >= 0) {
            const brick = this.bricks[index]
            brick.remove()
            this.bricks.splice(index, 1)
            return brick
        }
        return null
    }

    numOfBlocks() {
        return this.bricks.length
    }

    show(message) {
        let div = document.createElement("div");
        div.setAttribute('class', 'message');
        div.innerHTML = message
        this.container.appendChild(div)
    }
}

class Paddle {
    constructor(element) {
        this.paddle = element
        this.direction = 'stop'
    }

    element() { return this.paddle }

    rect() { return this.paddle.getBoundingClientRect() }

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

    isCollide(ball) {
        const rect = this.rect()
        var rectBall = ball.rect();

        if (rect.bottom < rectBall.top || rect.top > rectBall.bottom ||
            rect.right < rectBall.left || rect.left > rectBall.right) {
            return Number.NaN
        }

        const hitPosition = ((rectBall.x - rect.x) / rect.width) * 10 - 5
        return hitPosition
    }
}


class Ball {
    constructor(element) {
        this.ball = element
        this.speed = { x: 0, y: -5 }
    }

    rect() { return this.ball.getBoundingClientRect() }

    offsetLeft() { return this.ball.offsetLeft }

    offsetTop() { return this.ball.offsetTop }

    moveTo(x, y) {
        this.ball.style.left = x + 'px'
        this.ball.style.top = y + 'px'
    }

    move() {
        const x = this.ball.offsetLeft + this.speed.x
        const y = this.ball.offsetTop + this.speed.y
        this.moveTo(x, y)
    }

    moveToOn(elem) {
        const x = (elem.offsetLeft + (elem.clientWidth / 2))
        const y = (elem.offsetTop - this.ball.clientHeight)
        this.moveTo(x, y)
    }

    setSpeed(speed) { this.speed.x = speed }

    turnX() { this.speed.x *= -1 }

    turnY() { this.speed.y *= -1 }
}

class Brick {
    constructor(x, y, points) {
        this.brick = document.createElement("div");
        this.brick.setAttribute('class', 'brick');
        this.brick.style.left = x + 'px';
        this.brick.style.top = y + 'px';

        this.brick.innerText = points;
    }

    element() { return this.brick }

    rect() { return this.brick.getBoundingClientRect() }

    remove() { this.brick.parentNode.removeChild(this.brick) }

    isCollide(ball) {
        const rect = this.rect()
        var rectBall = ball.rect();

        if (rect.bottom < rectBall.top || rect.top > rectBall.bottom ||
            rect.right < rectBall.left || rect.left > rectBall.right) {
            return false
        }
        return true
    }
    
    points() { return parseInt(this.brick.innerText) }
}

class BreakOut {
    constructor() {
        this.status = 'initial'
        this.container = new Container(document.querySelector('#container'))
        this.paddle = new Paddle(document.querySelector('#paddle'))
        this.ball = new Ball(document.querySelector('#ball'))
        this.livesSpan = document.querySelector("#lives");
        this.pointsSpan = document.querySelector("#points");
        this.button = document.querySelector("#start")

        this.button.addEventListener("click", this.start.bind(this))
        document.addEventListener("keydown", this.keyDown.bind(this))
        document.addEventListener("keyup", this.keyUp.bind(this))

        this.setupBricks(3)
        this.animation = null
    }

    setupBricks(numRow) {
        const width = this.container.rect().width
        for (let row = 0; row < numRow; ++row) {

            let x = width % 100 / 2
            let y = row * 70

            while (x < width - 100) {
                let point = Math.ceil(Math.random() * 10 + 2)
                let brick = new Brick(x, y, point)
                this.container.append(brick)
                x += 100
            }
        }

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

    finish(message) {
        this.status = 'finish'
        this.container.show(message)
        if (this.animation !== null) {
            cancelAnimationFrame(this.animation)
        }
        this.animation = null
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

    bounceBall() {
        const hitPosion = this.paddle.isCollide(this.ball)
        if (!Number.isNaN(hitPosion)) {
            this.ball.setSpeed(hitPosion)
            this.ball.turnY()
            return "paddle"
        }

        const bounce = this.container.isCollide(this.ball)
        if (bounce === "right" || bounce === "left") {
            this.ball.turnX()
        } else if (bounce === "top" || bounce === "bottom") {
            this.ball.turnY()
        }
        return bounce
    }

    judgeHittingBlock() {
        const brick = this.container.removeHitBlock(this.ball)
        if (brick !== null) {
            this.ball.turnY()
            this.countup(brick)
        }
    }

    countup(brick) {
        let points = parseInt(this.pointsSpan.innerText)
        points += brick.points()
        this.pointsSpan.innerText = points
        return points
    }

    decrementLives() {
        let lives = parseInt(this.livesSpan.innerText)
        --lives
        this.livesSpan.innerText = lives
        return lives
    }

    update() {
        this.paddle.move()

        if (this.status === 'finish' || this.status === 'initial') {
            return
        } else if (this.status === 'waiting') {
            this.ball.moveToOn(this.paddle.element())
        } else {
            this.ball.move()

            if (this.bounceBall() === 'bottom') {
                const lives = this.decrementLives()
                if (lives <= 0) {
                    this.finish('Game Over')
                    return
                } else {
                    this.status = 'waiting'
                }
            }

            this.judgeHittingBlock()
            if (this.container.numOfBlocks() === 0) {
                this.finish('Complete')
                return
            }
        }
        this.animation = requestAnimationFrame(this.update.bind(this));
    }
}

window.onload = function () {
    window.breakout = new BreakOut()
    console.log(window.breakout)
}
