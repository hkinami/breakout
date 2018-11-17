// ブロック崩しゲーム

// ゲームの状態
let state = {
    field: {
        w: 500,  // フィールドの幅
        h: 500   // フィールドの高さ
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

// Canvas描画用のコンテキスト
let ctx = null

// キャンバスに状態を書き込む
function draw() {
    // キャンバスをクリア
    ctx.clearRect(0, 0, state.field.w, state.field.h)

    // パスを開始。パドルを四角(rect)で描画。ボールを丸(arc)で描画
    ctx.beginPath()
    ctx.rect(state.paddle.x, state.paddle.y, state.paddle.w, state.paddle.h)
    ctx.arc(state.ball.x, state.ball.y, state.ball.r, 0, Math.PI * 2, false)
    ctx.fillStyle = 'white'
    ctx.fill()

    // それぞれのブロックを四角で描画。(fillRect)
    ctx.fillStyle = 'blue'
    for (let i = 0; i < state.bricks.length; ++i) {
        let brick = state.bricks[i]
        ctx.fillRect(brick.x, brick.y, brick.w, brick.h)
    }

    // 全てのブロックがなければ、"Complete"を描画
    if (state.bricks.length == 0) {
        ctx.font = '48px serif'
        ctx.strokeStyle = "red"
        ctx.strokeText('Complete', 150, 250)
    }
}

// 衝突ブロックの削除
function bricks() {
    // 衝突指定ないブロックのリストを作成して、再設定
    state.bricks = state.bricks.filter(notHit)
}

// 衝突していないなら、true
function notHit(rect) {
    // ぶつかっていない状態の判定
    if (state.ball.y + state.ball.r < rect.y ||
        state.ball.y - state.ball.r > rect.y + rect.h ||
        state.ball.x + state.ball.r < rect.x ||
        state.ball.x - state.ball.r > rect.x + rect.w) {
        return true
    }
    return false
}

// ボールと、パドル/ブロックの衝突判定。衝突していれば、true
function hit(rect) {
    if ( notHit(rect) ) {
        return false
    }
    return true
}

// ボールの移動と、衝突判定
function ball() {

    // ボールの移動
    state.ball.x += state.ball.xv
    state.ball.y += state.ball.yv

    // 左右の枠に衝突したら、左右の方向を反転する
    if (state.ball.x < 0 || state.ball.x > state.field.w) {
        state.ball.xv *= -1
    }

    // 上下の枠に衝突したら、上下の方向を反転する
    if (state.ball.y < 0 || state.ball.y > state.field.h) {
        state.ball.yv *= -1
    }

    // パドルに衝突したら、上下の方向を反転
    if (hit(state.paddle)) {
        state.ball.yv *= -1
    }

    // 残っているブロックを全て調査
    for (let i = 0; i < state.bricks.length; ++i) {
        // ブロックに衝突したら、上下の方向を反転
        let brick = state.bricks[i]
        if (hit(brick)) {
            state.ball.yv *= -1
        }
    }
}

// パドルの移動
function paddle() {
    state.paddle.x += state.paddle.xv
}

// 状態を更新する（ボールとパドルの移動、ブロックの削除）
function update() {
    paddle()  // パドルの移動
    ball()    // ボールの移動
    bricks()  // ブロックの削除
}

// スタートボタンが押された時の関数
function start() {

    // 状態を更新する（ボールとパドルの移動、ブロックの削除）
    update()

    // 更新した情報を描画する
    draw()

    // ブロックが残っていれば、もう一度startを呼び出して次の処理を行う
    if (state.bricks.length != 0) {
        window.requestAnimationFrame(start)
    }
}

// キーが離された時の関数
function keyUp(e) {
    if (e.key == "ArrowRight" || e.key == "ArrowLeft") {
        state.paddle.xv = 0
    }
}

// キーが押された時に呼び出される関数
function keyDown(e) {
    if (e.key == "ArrowRight") {
        state.paddle.xv = 5  // 右方向への速度を5にする
    } else if (e.key == "ArrowLeft") {
        state.paddle.xv = -5  // 左方向の速度を5にする (-5)
    }
}

// HTML, CSSが読み込まれると呼び出される関数。window.onloadに設定する
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