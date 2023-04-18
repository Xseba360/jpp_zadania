type Gender = 'M' | 'F';

abstract class Animal {
  name: string
  age: number
  gender: Gender

  constructor (name: string, age: number, gender: Gender) {
    this.name = name
    this.age = age
    this.gender = gender
  }

  abstract makeSound(): void
}

abstract class Mammal extends Animal {
  produceMilk (): void {
    if (this.gender === 'M') {
      console.error('Male mammals cannot produce milk!')
    } else {
      console.log('Producing milk...')
    }
  }

  giveBirth (): void {
    if (this.gender === 'M') {
      console.error('Male mammals cannot give birth!')
    } else {
      console.log('Giving birth...')
    }
  }
}

abstract class Reptile extends Animal {
  produceEggs (): void {
    if (this.gender === 'M') {
      console.error('Male reptiles cannot produce eggs!')
    } else {
      console.log('Producing eggs...')
    }
  }

}

class Cat extends Mammal {
  makeSound(): void {
    console.log('Meow!')
  }
}

class Dog extends Mammal {
  makeSound(): void {
    console.log('Woof!')
  }
}

class Snake extends Reptile {
  makeSound(): void {
    console.log('Hiss!')
  }
}

class Lizard extends Reptile {
  makeSound(): void {
    console.log('Hiss!')
  }
}

class Platypus extends Mammal {
  makeSound(): void {
    console.log('Quack!')
  }

  produceEggs (): void {
    if (this.gender === 'M') {
      console.error('Male platypuses cannot produce eggs!')
    }
    console.log('Producing eggs...')
  }

  giveBirth (): void {
    console.error('Platypuses cannot give birth!')
  }
}

const cat = new Cat('Kitty', 2, 'F')
const dog = new Dog('Doggy', 3, 'M')
const snake = new Snake('Snek', 1, 'F')
const lizard = new Lizard('Lizard', 1, 'M')
const platypus = new Platypus('Platypus', 1, 'F')

cat.makeSound()
dog.makeSound()
snake.makeSound()
lizard.makeSound()
platypus.makeSound()

cat.giveBirth()
dog.giveBirth() // Error, dog is male
snake.produceEggs()
lizard.produceEggs() // Error, lizard is male
platypus.produceEggs()
platypus.giveBirth() // Error, platypuses lay eggs

cat.produceMilk()
dog.produceMilk() // Error, dog is male.

