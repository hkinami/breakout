/**
 * コンテナークラス
 * ブロック、パドル、ボールを内部にもつ
 * 現在有効なブロックの配列を持ち、ブロックの追加、削除機能を提供する
 * 内部のボールが、コンテナーの外に出た時の方向の判定メソッドを提供する
 */
class Container {
    // コンテナー要素の初期化と、ブロックの配列の初期化
    constructor(element) {
        this.container = element
        this.bricks = []
    }

    // コンテナーの位置とサイズの情報を返す
    // top, bottom, right, left, width, height, 
    rect() { return this.container.getBoundingClientRect() }

    // 引数のボールがコンテナーの外に出ている方向を判定する
    // "left", "right", "top", "bottom", ""
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

    // ブロックを追加する
    append(brick) {
        this.bricks.push(brick)
        this.container.appendChild(brick.element())
    }

    // ブロックがボールに衝突していれば、ブロックを取り出して、配列から削除する
    // 削除したブロックを返す
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

    // 現在のブロックの数を返す
    numOfBlocks() {
        return this.bricks.length
    }

    // コンテナーにメッセージを表示する
    show(message) {
        let div = document.createElement("div");
        div.setAttribute('class', 'message');
        div.innerHTML = message
        this.container.appendChild(div)
    }
}

/**
 * パドルクラス
 * キーボードイベントで左右に移動する
 * ３つの状態を持つ　'stop', 'right', 'left'
 * moveで5pxの速度で状態の方向へ移動する
 * ボールがパドルに衝突した時に、衝突したパドルの位置を-5から+5の範囲で返す
 */
class Paddle {
    // パドルの初期化と状態の初期化
    constructor(element) {
        this.paddle = element
        this.direction = 'stop'
    }

    // パドル要素を返す
    element() { return this.paddle }

    // パドルの位置を返す
    // top, bottom, right, left, width, height, 
    rect() { return this.paddle.getBoundingClientRect() }

    // キーが押された時に呼び出される。
    // 押されたキーの種類によって、"right"、"left"に状態を変更する
    keyDown(event) {
        if (event.key === "ArrowRight") {
            this.direction = "right"
        } else if (event.key === "ArrowLeft") {
            this.direction = "left"
        }
    }

    // キーが離された時に呼び出される
    // 離されたキーの種類によって、"stop"に状態を変更する
    keyUp(event) {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            this.direction = "stop"
        }
    }

    // パドルの位置を状態に応じて移動させる
    move() {
        let left = this.paddle.offsetLeft;
        if (this.direction === "left") {
            left -= 5;
        } else if (this.direction === "right") {
            left += 5;
        }
        this.paddle.style.left = left + 'px';
    }

    // ボールが衝突した位置を、-5から+5の範囲で返す
    // 衝突していない場合には、Number.NaNを返す
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

/**
 * ボールクラス
 * x方向、y方向の速度の状態を保ち、moveメソッドで状態に応じて移動する
 * rect, offsetLeft, offsetTopで、現在の位置情報を返す
 * moveTo, moveToOnで指定した位置に移動する
 * setSpeed, turnX, turnYで速度や方向を移動する
 */
class Ball {
    // ボール要素の初期化と、速度の初期値の設定
    constructor(element) {
        this.ball = element
        this.speed = { x: 0, y: -5 }
    }

    // ボールの位置を返す
    // top, bottom, right, left, width, height, 
    rect() { return this.ball.getBoundingClientRect() }

    // コンテナー内のボールの位置を返す
    offsetLeft() { return this.ball.offsetLeft }

    // コンテナー内のボールの位置を返す
    offsetTop() { return this.ball.offsetTop }

    // コンテナー内のボールの位置を指定する
    moveTo(x, y) {
        this.ball.style.left = x + 'px'
        this.ball.style.top = y + 'px'
    }

    // 設定した速度で位置を変更する
    move() {
        const x = this.ball.offsetLeft + this.speed.x
        const y = this.ball.offsetTop + this.speed.y
        this.moveTo(x, y)
    }

    // 指定したエレメントの上に場所を移動する
    moveToOn(elem) {
        const x = (elem.offsetLeft + (elem.clientWidth / 2))
        const y = (elem.offsetTop - this.ball.clientHeight)
        this.moveTo(x, y)
    }

    // X方向の速度を変更する
    setSpeed(speed) { this.speed.x = speed }

    // X方向の速度を逆転する
    turnX() { this.speed.x *= -1 }

    // Y方向の速度を逆転する
    turnY() { this.speed.y *= -1 }
}

/**
 * ブロッククラス
 * x方向、y方向の位置を保ち、ボールと衝突したかどうかの判定を行う
 * 内部に特典情報を保持する
 */
class Brick {
    // ブロック要素の初期化と、得点情報の初期化
    constructor(x, y, points) {
        this.brick = document.createElement("div");
        this.brick.setAttribute('class', 'brick');
        this.brick.style.left = x + 'px';
        this.brick.style.top = y + 'px';

        this.brick.innerText = points;
    }

    // ブロック要素を返す
    element() { return this.brick }

    // ボールの位置を返す
    // top, bottom, right, left, width, height, 
    rect() { return this.brick.getBoundingClientRect() }

    // 自分を包含する親要素から自分自身を削除する
    remove() { this.brick.parentNode.removeChild(this.brick) }

    // ボールとの衝突判定
    isCollide(ball) {
        const rect = this.rect()
        var rectBall = ball.rect();

        if (rect.bottom < rectBall.top || rect.top > rectBall.bottom ||
            rect.right < rectBall.left || rect.left > rectBall.right) {
            return false
        }
        return true
    }
    
    // ボールの得点を返す
    points() { return parseInt(this.brick.innerText) }
}

/**
 * ブロック崩しゲーム
 * コンテナ、パドル、ボールなどの要素を操作してゲームを実行する
 * キーイベントの検知や、アニメーションフレームの更新を行う
 * ゲームのルールのロジックを実装する
 */
class BreakOut {
    // 各要素の参照取得してリスナーを登録する
    // ブロックを作成する
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

    // 指定した行数のブロックの作成する。
    // ブロックの大きさは、80px, 50pxで固定
    // ポイントは乱数で決める
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

    // スタートボタンが押された時の処理
    // すでに終了していれば、reloadで初期状態から開始する
    // 停止状態であれば、ボールを待ち状態にして開始
    // 動作中であれば、アニメーションを停止する
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

    // ゲームを停止して、メッセージを表示する
    finish(message) {
        this.status = 'finish'
        this.container.show(message)
        if (this.animation !== null) {
            cancelAnimationFrame(this.animation)
        }
        this.animation = null
    }

    // キーが離された時の処理
    keyUp(e) {
        e.preventDefault()
        if (this.status === 'waiting' && e.key === 'ArrowUp') {
            this.status = 'moving'
        }
        this.paddle.keyUp(e)
    }

    // キーが押された時の処理
    keyDown(e) {
        e.preventDefault()
        this.paddle.keyDown(e)
    }

    // ボールの衝突判定
    // パドルに当たれば、速度を変更する
    // コンテナに当たれば、速度を反転する
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

    // ブロックの衝突判定
    // ブロックに当たれば、方向を反転して、ポイントを加算する
    judgeHittingBlock() {
        const brick = this.container.removeHitBlock(this.ball)
        if (brick !== null) {
            this.ball.turnY()
            this.countup(brick)
        }
    }

    // ポイントを加算して、表示する
    countup(brick) {
        let points = parseInt(this.pointsSpan.innerText)
        points += brick.points()
        this.pointsSpan.innerText = points
        return points
    }

    // ライフを減少させて、表示する
    decrementLives() {
        let lives = parseInt(this.livesSpan.innerText)
        --lives
        this.livesSpan.innerText = lives
        return lives
    }

    // アニメーションのアップデート
    // 開始状態、終了状態では何もしない
    // 待ち状態の時には、ボールをパドルの上に表示する
    // 動作中は、ボールを動かして、コンテナー、ブロック、パドルとの衝突判定を行う
    // コンテナーの下に衝突したら、ライフを減少
    // ブロックがなくなれば、成功で終了する
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

// HTML, CSSが読み込まれると呼び出される関数
window.onload = function () {
    window.breakout = new BreakOut()
    console.log(window.breakout)
}
