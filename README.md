# 入門プログラミング

HTML/CSS/JavaScriptを使って、プログラミングの基礎を学びましょう。

# HTMLとは

HTMLとは、

```html

```

# CSSとは

CSSとは、

```html

```

# 座標系

X座乗
Y座標


# JavaScriptとは

JavaScriptとは

```javascript
console.log("Hello, World!")
```

# 変数

```javascript
let paddle = 210
```

```javascript
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
```

# 関数

```javascript
function initialize() {
}
window.onload = initialize
```

# イベント駆動


# 条件分岐

```javascript
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
```

# アニメーションション

```javascript
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

```

# ループ


```javascript
    for (let i = 0; i < state.bricks.length; ++i) {
        // ブロックに衝突したら、上下の方向を反転
        let brick = state.bricks[i]
        if (hit(brick)) {
            state.ball.yv *= -1
        }
    }
```

# 衝突判定

```javascript
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
```

#  配列のフィルター

```javascript
// 衝突ブロックの削除
function bricks() {
    // 衝突指定ないブロックのリストを作成して、再設定
    state.bricks = state.bricks.filter(notHit)
}
```

# 

```javascript
```

# 

```javascript
```

# 

```javascript
```

# 

```javascript
```

# 

```javascript
```

