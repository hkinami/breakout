/**
 * コンテナークラス
 * ブロック、パドル、ボールを内部にもつ
 * 現在有効なブロックの配列を持ち、ブロックの追加、削除機能を提供する
 * 内部のボールが、コンテナーの外に出た時の方向の判定メソッドを提供する
 */
class Container {
    constructor(element) {
        this.container = element
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
    constructor(element) {
        this.paddle = element
        this.direction = 'stop'
    }

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
}


/**
 * ボールクラス
 * x方向、y方向の速度の状態を保ち、moveメソッドで状態に応じて移動する
 * rect, offsetLeft, offsetTopで、現在の位置情報を返す
 * moveTo, moveToOnで指定した位置に移動する
 * setSpeed, turnX, turnYで速度や方向を移動する
 */
class Ball {
    constructor(element) {
        this.ball = element
    }
}

/**
 * ブロッククラス
 * x方向、y方向の位置を保ち、ボールと衝突したかどうかの判定を行う
 * 内部に特典情報を保持する
 */
class Brick {
}

/**
 * ブロック崩しゲーム
 * コンテナ、パドル、ボールなどの要素を操作してゲームを実行する
 * キーイベントの検知や、アニメーションフレームの更新を行う
 * ゲームのルールのロジックを実装する
 */
class BreakOut {
    constructor() {
        this.status = 'initial'  // 状態の初期化
        this.animation = null

        this.container = new Container(document.querySelector('#container'))
        this.paddle = new Paddle(document.querySelector('#paddle'))
        this.ball = new Ball(document.querySelector('#ball'))
        this.button = document.querySelector("#start")

        // キーイベントのリスナーの追加。
        document.addEventListener("keydown", this.keyDown.bind(this))
        document.addEventListener("keyup", this.keyUp.bind(this))

        // ボタンリスナーの登録
        this.button.addEventListener("click", this.start.bind(this))
    }

    // キーが押された時の処理
    keyDown(e) {
        e.preventDefault()
        this.paddle.keyDown(e)
    }

    // キーが離された時の処理
    keyUp(e) {
        e.preventDefault()
        this.paddle.keyUp(e)
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

    // アニメーションのアップデート
    update() {
        this.paddle.move()

        this.animation = requestAnimationFrame(this.update.bind(this))
    }
}

// HTML, CSSが読み込まれると呼び出される関数
window.onload = function () {
    window.breakout = new BreakOut()
    console.log(window.breakout)
}
