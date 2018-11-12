
let state = {}

function draw(state) {
    console.log('draw')
}

function update(state) {
    console.log('update')
    return state
}

function keyDown(state, e) {
    console.log('keyDown', e)
   return state
}

function keyUp(state, e) {
    console.log('keyUp', e)
    return state
}

let animation = null
function animationFrame() {
    state = update(state)
    draw(state)
    animation = requestAnimationFrame(animationFrame)
}

// HTML, CSSが読み込まれると呼び出される関数
window.onload = function () {
    window.addEventListener('keydown', (e) => {
        state = keyDown(state, e)
    })
    window.addEventListener('keyup', (e) => {
        state = keyDown(state, e)
    })

    let button = document.querySelector('#start')
    button.addEventListener('click', () => {
         if (animation === null) {
             animation = requestAnimationFrame(animationFrame)
         } else {
             cancelAnimationFrame(animation)
             animation = null
         }
    })
}
