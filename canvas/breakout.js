
let state = {
    ctx: null,  // 描画用のコンテキスト
    container: {
        w: 500,  // コンテナの幅
        h: 500   // コンテナの高さ
    },
    ball: {
        x: 250,    // ボールのX座標
        y: 250,    // ボールのY座標
        r: 5,      // ボールの半径
        xv: 2,     // ボールのX方向の速度
        yv: 5,     // ボールのY方向の速度
    },
    paddle: {
        x: 210,    // パドルのX座標
        y: 470,    // パドルのY座標
        w: 80,     // パドルの幅
        h: 10,     // パドルの高さ
        dir: "stop"     // パドルの動く方向
    },
    bricks: [     // ブロック {x座標、y座標、w幅、h高さ}
        { x: 20, y: 10, w: 80, h: 50 }, { x: 220, y: 10, w: 80, h: 50 }, { x: 400, y: 10, w: 80, h: 50 },
        { x: 120, y: 70, w: 80, h: 50 }, { x: 320, y: 70, w: 80, h: 50 },
        { x: 20, y: 130, w: 80, h: 50 }, { x: 220, y: 130, w: 80, h: 50 }, { x: 400, y: 130, w: 80, h: 50 },
    ]
}

function draw(s) {
    s.ctx.clearRect(0, 0, s.container.w, s.container.h)

    s.ctx.beginPath()
    s.ctx.fillStyle = 'white'
    s.ctx.rect(s.paddle.x, s.paddle.y, s.paddle.w, s.paddle.h)
    s.ctx.arc(s.ball.x, s.ball.y, s.ball.r, 0, Math.PI * 2, false)
    s.ctx.fill()

    s.ctx.fillStyle = 'blue'
    s.bricks.forEach((brick) => {
        s.ctx.fillRect(brick.x, brick.y, brick.w, brick.h)
    })

    if (s.bricks.length == 0) {
        s.ctx.font = '48px serif'
        s.ctx.strokeStyle = "red"
        s.ctx.strokeText('Complete', 150, 250)
    }
}

function paddle(paddle) {
    if (paddle.dir == "right") {
        paddle.x += 5
    } else if (paddle.dir == "left") {
        paddle.x -= 5
    }
    return paddle
}

function ball(ball, container, paddle, bricks) {
    ball.x += ball.xv
    ball.y += ball.yv

    if (ball.x < 0 || ball.x > container.w) {
        ball.xv *= -1
    }
    if (ball.y < 0 || ball.y > container.h) {
        ball.yv *= -1
    }
    if (hit(ball, paddle)) {
        ball.yv *= -1
    }
    bricks.forEach((brick) => {
        if (hit(ball, brick)) {
            ball.yv *= -1
        }
    })
    return ball
}

function briks(briks, ball) {
    return briks.filter((brick) => {
        if (hit(ball, brick)) {
            return false
        } else {
            return true
        }
    })
}

function hit(ball, rect) {
    if (ball.y + ball.r < rect.y ||
        ball.y - ball.r > rect.y + rect.h ||
        ball.x + ball.r < rect.x ||
        ball.x - ball.r > rect.x + rect.w) {
        return false
    }
    return true
}

function update(s) {
    s.paddle = paddle(s.paddle)
    s.ball = ball(s.ball, s.container, s.paddle, s.bricks)
    s.bricks = briks(s.bricks, s.ball)
    return s
}

let animation = null
function start() {
    if (animation == null) {
        animation = requestAnimationFrame(animationFrame)
    } else {
        cancelAnimationFrame(animation)
        animation = null
    }
}

function animationFrame() {
    state = update(state)
    draw(state)
    if (state.bricks.length == 0) {
        return
    }
    animation = requestAnimationFrame(animationFrame)
}

function keyDown(e) {
    if (e.key == "ArrowRight") {
        state.paddle.dir = "right"
    } else if (e.key == "ArrowLeft") {
        state.paddle.dir = "left"
    }
}

function keyUp(e) {
    if (e.key == "ArrowRight" || e.key == "ArrowLeft") {
        state.paddle.dir = "stop"
    }
}

// HTML, CSSが読み込まれると呼び出される関数
function initialize() {
    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)

    let button = document.querySelector('#start')
    button.addEventListener('click', start)

    canvas = document.querySelector('#canvas')
    state.ctx = canvas.getContext("2d")

    draw(state)
}

window.onload = initialize