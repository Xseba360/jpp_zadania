import { Intersection } from './classes/Intersection.js'
import { Car } from './classes/Car.js'
import { Street } from './classes/Street.js'
import { District } from './classes/District.js'
import { CanvasManager } from './classes/CanvasManager.js'

const intersections = [
  new Intersection(0, 0), // Prosta, Krzywa
  new Intersection(1000, 0), // Krzywa, Długa
  new Intersection(1000, 1000), // Długa, Krótka, Chopina, Paderewskiego
  new Intersection(-500, 1000), // Krótka, Prosta, Elsnera
  new Intersection(0, 2000), // Elsnera, Moniuszki, Paderewskiego
  new Intersection(1500, 2500), // Moniuszki, Chopina
]

const districts = [
  new District('Śródmieście'),
  new District('Osiedle Południowe'),
]

const streets = [
  // Śródmieście
  new Street('Prosta', [intersections[0], intersections[1]], districts[0]),
  new Street('Krzywa', [intersections[1], intersections[2]], districts[0]),
  new Street('Długa', [intersections[2], intersections[3]], districts[0]),
  new Street('Krótka', [intersections[3], intersections[0]], districts[0]),

  // Osiedle Południowe
  new Street('Elsnera', [intersections[3], intersections[4]], districts[1]),
  new Street('Moniuszki', [intersections[4], intersections[5]], districts[1]),
  new Street('Chopina', [intersections[5], intersections[2]], districts[1]),
  new Street('Paderewskiego', [intersections[2], intersections[4]], districts[1]),
]

const cars = [
  new Car('Toyota | ELW 0666', streets),
  new Car('Subaru | EL 15234', streets),
  new Car('Lexus | EZG 5P23', streets),
  new Car('Nissan | EPA 59214', streets),
  new Car('Mazda | EPJ GD94', streets),
  new Car('Honda | EPI 29123', streets),
  new Car('Acura | ESK 00023', streets),
  new Car('Infiniti | ERA 4G21', streets),
  new Car('Suzuki | ESI M113', streets),
  new Car('Mitsubishi | ELA 29121', streets),
  new Car('Daihatsu | ES L3121', streets),
  new Car('Isuzu | ERW 2137', streets),
]

if (typeof process !== 'object') {
  // Browser
  new CanvasManager(intersections, streets, cars, districts, 128)
} else {
  // Node.js
  setInterval(() => {
    console.clear()
    cars.forEach(car => {
      car.drive()
      console.log(`${car.name} is at ${car.currentStreet.name} at \t${car.currentX.toFixed(1)},\t ${car.currentY.toFixed(1)}\t | speed: ${Math.round(car.currentSpeed * 3.6)} km/h`)
    })
  }, 100)
}

