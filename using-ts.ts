const input1 = document.getElementById('num1')! as HTMLInputElement
const input2 = document.getElementById('num2')! as HTMLInputElement
const button = document.querySelector('button')

const add = (num1: number, num2: number) => {
    return num1 + num2
}

button?.addEventListener('click', () => {
    add(+input1.value, +input2.value)
})

button?.removeEventListener('click', () => add)