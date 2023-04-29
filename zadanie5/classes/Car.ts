import { Street } from './Street.js'
import { Intersection } from './Intersection.js'
import { ArrayPoint } from '../types/ArrayPoint.js'
import { Point } from '../types/Point.js'

export class Car {
  name: string
  streets: Street[]
  currentStreet: Street
  currentX: number
  currentY: number

  // Meters
  distanceSinceLastIntersection: number = 0
  // Meters
  currentStreetLength: number = 0

  currentProgress: number = 0

  lastIntersection: Intersection
  nextIntersection: Intersection

  isAtIntersection: boolean = false

  // Speed in meters per second
  currentSpeed: number = 0
  currentAngle: number = 0

  // Meters per second
  private readonly MAX_SPEED = (60 + (Math.random() * 70)) / 3.6
  private readonly ACCELERATION = 2 + (Math.random() * 1.5)
  private readonly DECELERATION = 4 + (Math.random() * 1.5)
  private readonly BRAKE_DIST_BEFORE_INTERSECTION = this.MAX_SPEED * 4.5
  private readonly HARD_BRAKE_DIST_BEFORE_INTERSECTION = 20
  private readonly TARGET_SPEED_AT_INTERSECTION = 25 / 3.6

  private lastTimeUpdated: number = performance.now()

  constructor (name: string, streets: Street[]) {
    this.name = name
    this.streets = streets
    const randomStreetIndex = Math.floor(Math.random() * this.streets.length)
    this.currentStreet = this.streets[randomStreetIndex]
    this.currentStreet.carEntered(this)
    this.currentProgress = Math.random()
    const randomPointOnStreet = Car.getCoordinatesByProgress(
      [this.currentStreet.intersections[0].x, this.currentStreet.intersections[0].y],
      [this.currentStreet.intersections[1].x, this.currentStreet.intersections[1].y],
      this.currentProgress
    )
    this.currentX = randomPointOnStreet.x
    this.currentY = randomPointOnStreet.y
    this.currentStreetLength = this.currentStreet.length
    this.distanceSinceLastIntersection = this.currentProgress * this.currentStreet.length

    const randomDirection = Math.random() > 0.5

    this.lastIntersection = this.currentStreet.intersections[randomDirection ? 0 : 1]
    this.nextIntersection = this.currentStreet.intersections[randomDirection ? 1 : 0]

    this.currentAngle = Math.atan2(
      this.nextIntersection.y - this.lastIntersection.y,
      this.nextIntersection.x - this.lastIntersection.x
    )

    if (this.currentX === this.lastIntersection.x && this.currentY === this.lastIntersection.y) {
      this.isAtIntersection = true
    }
  }

  private _isAccelerating: boolean = false

  get isAccelerating (): boolean {
    return this._isAccelerating
  }

  private _isDecelerating: boolean = false

  get isDecelerating (): boolean {
    return this._isDecelerating
  }

  static getCoordinatesByProgress (first: ArrayPoint, second: ArrayPoint, progress: number): Point {
    const x1 = first[0]
    const y1 = first[1]

    const x2 = second[0]
    const y2 = second[1]

    const x = x1 + (x2 - x1) * progress
    const y = y1 + (y2 - y1) * progress

    return { x, y }
  }

  /**
   * Perform a single update step for the car. This function should be called every "frame" or "tick".
   */
  public drive (): void {

    if (this.isAtIntersection) {
      // leave the current street and enter the next one
      this.currentStreet.carLeft(this)
      this.currentStreet = this.findNextStreet()
      this.currentStreet.carEntered(this)
      this.currentStreetLength = this.currentStreet.length // for faster access

      // update the intersections, reset angles, distances, etc.
      this.lastIntersection = this.nextIntersection
      this.nextIntersection = this.findNextIntersection(this.currentStreet)
      this.currentAngle = Math.atan2(
        this.nextIntersection.y - this.lastIntersection.y,
        this.nextIntersection.x - this.lastIntersection.x
      )

      this.distanceSinceLastIntersection = 0

      this.currentProgress = 0
      this.isAtIntersection = false
    }

    this.performBrakingAndAcceleration()

    // update the car's position
    this.distanceSinceLastIntersection += this.getDistanceMadeByCurrentSpeed()

    if (this.distanceSinceLastIntersection > this.currentStreetLength) {
      this.distanceSinceLastIntersection = this.currentStreetLength
    }

    this.currentProgress = this.distanceSinceLastIntersection / this.currentStreetLength

    const newCoordinates = Car.getCoordinatesByProgress(
      [this.lastIntersection.x, this.lastIntersection.y],
      [this.nextIntersection.x, this.nextIntersection.y],
      this.currentProgress
    )

    this.currentX = newCoordinates.x
    this.currentY = newCoordinates.y

    // if the car is at the intersection, set the flag to true, so that the next update can handle the intersection
    if (this.currentProgress >= 1) {
      this.isAtIntersection = true
    }
    // reset the last time updated, so that the next update can calculate the time elapsed since this one
    this.lastTimeUpdated = performance.now()
  }

  /**
   * Called before nextIntersection is updated, so the **property name** here is a slightly misleading at this point.
   *
   * What it does is it gets a list of all the streets that intersect with the intersection that the car is about to
   * enter, that are NOT the street that the car is currently on. Then it picks one of those streets at random and
   * returns it.
   * @private
   */
  private findNextStreet (): Street {
    const streetsOnNextIntersection = this.streets.filter(
      street =>
        street.intersections.includes(this.nextIntersection) &&
        street !== this.currentStreet
    )

    const randomStreetIndex = Math.floor(Math.random() * streetsOnNextIntersection.length)
    return streetsOnNextIntersection[randomStreetIndex]
  }

  /**
   * Used find the target intersection, that is not the intersection the car is about to enter.
   * @param street
   * @private
   */
  private findNextIntersection (street: Street): Intersection {
    /*const intersections = street.intersections.filter(intersection => intersection !== this.nextIntersection)
    const randomIntersectionIndex = Math.floor(Math.random() * intersections.length)
    return intersections[randomIntersectionIndex]*/
    return street.intersections.find(intersection => intersection !== this.nextIntersection)
  }

  /**
   * This method is very important so the cars don't go extremely fast or extremely slow depending on the framerate.
   * @private
   */
  private getTimeElapsedSinceLastUpdate (): number {
    const timeNow = performance.now()
    return timeNow - this.lastTimeUpdated
  }

  /**
   * Perform the acceleration
   * @private
   */
  private accelerate (): void {
    const timeElapsed = this.getTimeElapsedSinceLastUpdate()
    if (this.currentSpeed < this.MAX_SPEED) {
      this.currentSpeed += this.ACCELERATION * (timeElapsed / 1000)
      if (this.currentSpeed > this.MAX_SPEED) {
        this.currentSpeed = this.MAX_SPEED
      }
    } else {
      this.currentSpeed = this.MAX_SPEED
    }
    this._isAccelerating = true
  }

  /**
   * Perform the braking
   * Percentage is a number between 0 and 2
   * @param percentage a number between 0 and 2
   * @private
   */
  private decelerate (percentage: number): void {
    if (percentage < 0 || percentage > 2) {
      if (percentage < 0) {
        percentage = 0
      } else if (percentage > 2) {
        percentage = 2
      }
    }
    const timeElapsed = this.getTimeElapsedSinceLastUpdate()
    if (this.currentSpeed > 0) {
      this.currentSpeed -= (this.DECELERATION * percentage) * (timeElapsed / 1000)
      if (this.currentSpeed < 0) {
        this.currentSpeed = 0
      }
    } else {
      this.currentSpeed = 0
    }
    this._isDecelerating = true
  }

  /**
   * How much distance the car has made since the last update in meters.
   * @private
   */
  private getDistanceMadeByCurrentSpeed (): number {
    return this.currentSpeed * (this.getTimeElapsedSinceLastUpdate() / 1000)
  }

  /**
   * Perform various checks to see if there's a car in front of the current car
   * @private
   */
  private getCarInFrontOfCurrentCar (): Car | null {
    if (this.isAtIntersection) {
      return null
    }
    if (this.currentStreet.cars.length <= 1) {
      return null
    }

    const cars = this.currentStreet.cars.filter(car => car !== this)

    // just in case of floating point errors or something
    const carsInSimilarDirection = cars.filter(car => {
      const angleDifference = Math.abs(car.currentAngle - this.currentAngle)
      return angleDifference < 0.2
    })

    if (carsInSimilarDirection.length === 0) {
      return null
    }

    const carsInFront = carsInSimilarDirection.filter(car => {
      return car.distanceSinceLastIntersection >= this.distanceSinceLastIntersection
    })
    if (carsInFront.length === 0) {
      return null
    }
    // find the closest car
    const closestCar = carsInFront.reduce((closestCar, car) => {
      if (this.getDistanceToCar(car) < this.getDistanceToCar(closestCar)) {
        return car
      } else {
        return closestCar
      }
    })

    // not sure if this is necessary, but just in case
    if (this.getDistanceToCar(closestCar) > this.currentStreet.length) {
      return null
    }
    return closestCar

  }

  /**
   * Returns the distance between the cars on the same street. Since this function is private, the cars are guaranteed
   * to be on the same street and no additional checks are necessary.
   * @param car Car to compare distance to
   * @private
   */
  private getDistanceToCar (car: Car): number {
    return Math.abs(this.distanceSinceLastIntersection - car.distanceSinceLastIntersection)
  }

  /**
   * Secondary function used for braking/accelerating. This function is used when all other checks have been done and
   * the last thing to check for is if there's a car in front of the current car.
   * @param isIntersectionCheck
   * @param doAccelerateIfClear
   * @private
   */
  private checkForCarInFrontAndBrakeOrAccelerate (isIntersectionCheck: boolean, doAccelerateIfClear: boolean): void {
    const carInFront = this.getCarInFrontOfCurrentCar()
    if (carInFront === null) {
      if (doAccelerateIfClear) {
        this.accelerate()
      }
      return
    }
    const dist = this.getDistanceToCar(carInFront)
    if (isIntersectionCheck) {
      // since we're closer to the intersection we're going slower, so we can drive closer to the car in front
      if (dist < 40) {
        this.decelerate(((40 - dist) / 20) + 0.2)
      } else if (doAccelerateIfClear) {
        this.accelerate()
      }
    } else {
      const dist = this.getDistanceToCar(carInFront)
      if (dist < 80) {
        this.decelerate(((80 - dist) / 40) + 0.2)
      } else if (doAccelerateIfClear) {
        this.accelerate()
      }
    }
  }

  /**
   * Perform the braking and acceleration based on the current speed and the distance to the intersection.
   * @private
   */
  private performBrakingAndAcceleration (): void {
    // clear acceleration and deceleration flags in case we maintain the speed
    this._isAccelerating = false
    this._isDecelerating = false
    // how far away are we from the intersection?
    if (this.currentStreetLength - this.distanceSinceLastIntersection <= this.BRAKE_DIST_BEFORE_INTERSECTION) {
      // What I tried to achieve here is make the car slow down as much as possible before the intersection, but not
      // perform a full stop. The car should start braking as soon as it can, but not too hard. Once it gets closer to
      // somewhere around half of the braking distance, it should start less and less until it reaches the target speed.
      if (this.currentSpeed > this.TARGET_SPEED_AT_INTERSECTION) {
        const distanceToIntersection = this.currentStreetLength - this.distanceSinceLastIntersection
        const percentageOfBrakeDistance = distanceToIntersection / this.BRAKE_DIST_BEFORE_INTERSECTION
        const percentageOfTargetSpeed = this.currentSpeed / this.TARGET_SPEED_AT_INTERSECTION
        const percentage = Math.max(Math.min(percentageOfBrakeDistance, percentageOfTargetSpeed), 0.2)

        // If the car speed is higher than the target speed, a couple of meters before the intersection, it should start
        // braking pretty hard.
        if ((distanceToIntersection <= this.HARD_BRAKE_DIST_BEFORE_INTERSECTION) && (percentage < 1)) {
          this.decelerate(1)
        } else {
          this.decelerate(percentage)
        }
      } else if (this.currentSpeed < (this.TARGET_SPEED_AT_INTERSECTION - this.ACCELERATION)) {
        this.checkForCarInFrontAndBrakeOrAccelerate(true, true)
      } else {
        this.checkForCarInFrontAndBrakeOrAccelerate(true, false)
      }

    } else if (this.currentSpeed < this.MAX_SPEED) {
      this.checkForCarInFrontAndBrakeOrAccelerate(false, true)
    } else {
      this.checkForCarInFrontAndBrakeOrAccelerate(false, false)
    }
  }
}