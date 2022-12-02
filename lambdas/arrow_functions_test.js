/*

let sum = (a, b) => a + b

let isPositive = number => number >= 0

let randomNumber = () => Math.random();

document.addEventListener('click', () => console.log('Click'))

*/

class Person {
    constructor(name) {
        this.name = name
    }

    printNameArrow() {
        setTimeout(() => {
            console.log('Arrow: ' + this.name)
        }, 100)
    }

    printNameFunction() {
        setTimeout(function() {
            console.log('Function: ' + this.name)
        }, 100)
    }
}

let person = new Person('Bob')
person.printNameArrow()
person.printNameFunction()
console.log(this.name)