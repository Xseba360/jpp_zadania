import { Intersection } from './Intersection.js'
import { Car } from './Car.js'
import { District } from './District.js'

export class Street {
  public name: string
  public readonly intersections: [Intersection, Intersection]

  // Length in meters
  public readonly length: number

  public readonly district: District

  constructor (name: string, intersections: [Intersection, Intersection], district: District) {
    this.name = name
    this.intersections = intersections

    const x1 = this.intersections[0].x
    const y1 = this.intersections[0].y

    const x2 = this.intersections[1].x
    const y2 = this.intersections[1].y

    this.length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

    this.district = district
  }

  private _cars: Car[] = []

  get cars (): Readonly<Car[]> {
    return Object.freeze(Array.from(this._cars))
  }

  carEntered (car: Car) {
    this._cars.push(car)
  }

  carLeft (car: Car) {
    this._cars = this._cars.filter(c => c !== car)
  }

  getStrokeBasedOnCarsCount (): string {
    switch (this.cars.length) {
      case 0:
      case 1:
        return 'limegreen'
      case 2:
      case 3:
        return 'orange'
      default:
        return 'red'
    }
  }

  draw (ctx: CanvasRenderingContext2D, minX: number, minY: number, scaleX: number, scaleY: number, padding: number) {
    const color = this.getStrokeBasedOnCarsCount()
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(((this.intersections[0].x - minX) * scaleX) + padding, ((this.intersections[0].y - minY) * scaleY) + padding)
    ctx.lineTo(((this.intersections[1].x - minX) * scaleX) + padding, ((this.intersections[1].y - minY) * scaleY) + padding)
    ctx.stroke()
    // draw name in the midpoint of the street
    const midX = (this.intersections[0].x + this.intersections[1].x) / 2
    const midY = (this.intersections[0].y + this.intersections[1].y) / 2
    ctx.font = '20px Arial'
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    // rotate text
    ctx.fillText(this.name, ((midX - minX) * scaleX) + padding, ((midY - minY) * scaleY) + padding)
    // district name below
    ctx.font = '15px Arial'
    ctx.fillText(this.district.name, ((midX - minX) * scaleX) + padding, ((midY - minY) * scaleY) + padding + 20)

  }
}