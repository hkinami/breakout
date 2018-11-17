"use strict"
let state = {
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
        xv: 0    // パドルのX方向の速度
    },
    bricks: [     // ブロック {x座標、y座標、w幅、h高さ}
        { x: 20, y: 10, w: 80, h: 50 }, { x: 220, y: 10, w: 80, h: 50 }, { x: 400, y: 10, w: 80, h: 50 },
        { x: 120, y: 70, w: 80, h: 50 }, { x: 320, y: 70, w: 80, h: 50 },
        { x: 20, y: 130, w: 80, h: 50 }, { x: 220, y: 130, w: 80, h: 50 }, { x: 400, y: 130, w: 80, h: 50 },
    ]
}
let ctx = null  // Canvas描画用のコンテキスト

function draw() {
    ctx.clearRect(0, 0, state.container.w, state.container.h)

    ctx.beginPath()
    ctx.fillStyle = 'white'
    ctx.rect(state.paddle.x, state.paddle.y, state.paddle.w, state.paddle.h)
    ctx.arc(state.ball.x, state.ball.y, state.ball.r, 0, Math.PI * 2, false)
    ctx.fill()

    ctx.fillStyle = 'blue'
    for(let i=0; i < state.bricks.length; ++i) {
        let brick = state.bricks[i]
        ctx.fillRect(brick.x, brick.y, brick.w, brick.h)
    }

    if (state.bricks.length == 0) {
        ctx.font = '48px serif'
        ctx.strokeStyle = "red"
        ctx.strokeText('Complete', 150, 250)
    }
}

function briks() {
    state.bricks =  state.bricks.filter(nonhit)
}

function nonhit(rect) {
    return !hit(rect)
}

function hit(rect) {
    if (state.ball.y + state.ball.r < rect.y ||
        state.ball.y - state.ball.r > rect.y + rect.h ||
        state.ball.x + state.ball.r < rect.x ||
        state.ball.x - state.ball.r > rect.x + rect.w) {
        return false
    }
    return true
}

function ball() {
    state.ball.x += state.ball.xv
    state.ball.y += state.ball.yv

    if (state.ball.x < 0 || state.ball.x > state.container.w) {
        state.ball.xv *= -1
    }
    if (state.ball.y < 0 || state.ball.y > state.container.h) {
        state.ball.yv *= -1
    }
    if (hit(state.paddle)) {
        state.ball.yv *= -1
    }

    for(let i=0; i < state.bricks.length; ++i) {
        let brick = state.bricks[i]
        if (hit(brick)) {
            state.ball.yv *= -1
        }
    }
}

function paddle() {
    state.paddle.x += state.paddle.xv
}

function update() {
    paddle()
    ball()
    briks()
}


function start() {
    update()
    draw()
    if (state.bricks.length == 0) {
        return
    }
    window.requestAnimationFrame(start)
}

function keyUp(e) {
    if (e.key == "ArrowRight" || e.key == "ArrowLeft") {
        state.paddle.xv = 0
    }
}

function keyDown(e) {
    if (e.key == "ArrowRight") {
        state.paddle.xv = 5
    } else if (e.key == "ArrowLeft") {
        state.paddle.xv = -5
    }
}

// HTML, CSSが読み込まれると呼び出される関数
function initialize() {
    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)

    let button = window.document.getElementById('start')
    button.addEventListener('click', start)

    let canvas = document.getElementById('canvas')
    ctx = canvas.getContext("2d")

    draw()
}

window.onload = initialize