
class Container {
    constructor(element) {
        this.container = element
        this.bricks = []
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

    append(brick) {
        this.bricks.push(brick)
        this.container.appendChild(brick.element())
    }

    removeHitBlock(ball) {
        const index = this.bricks.findIndex( (brick) => brick.isCollide(ball) !== 0 )
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

    complete() {
        let message = document.createElement("div");
        message.setAttribute('class', 'message');
        message.innerHTML = "Complete"
        this.container.appendChild(message)
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

class Brick {
    constructor(x, y) {
        this.brick = document.createElement("div");
        this.brick.setAttribute('class', 'brick');
        this.brick.style.left = x + 'px';
        this.brick.style.top = y + 'px';
    }

    element() {
        return this.brick
    }

    rect() {
        return this.brick.getBoundingClientRect()
    }

    remove() {
        this.brick.parentNode.removeChild(this.brick)
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
        this.setupBricks(3)
    }

    setupBricks(numRow) {
        const width = this.container.rect().width
        for(let row=0; row < numRow; ++row) {
            
            let x = width % 100 / 2
            let y = row * 70
            
            while( x < width - 100 ) {
                let brick = new Brick(x, y)
                this.container.append(brick)
                x += 100
            }
        }
        
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

    hitBlock() {
        const brick = this.container.removeHitBlock(this.ball)
        if (brick !== null) {
            this.ball.turnY()
            return brick
        }
        return null
    }

    update() {
        this.paddle.move()
        this.ball.move()
        
        this.hitBlock()
        this.bounceBall()

        if (this.container.numOfBlocks() === 0) {
            this.container.complete()
        } else {
            this.animation = requestAnimationFrame(this.update.bind(this));
        }
    }
}

const brakout = new BreakOut()
brakout.reset()