import { Point } from '../types/Point.js'

export class Intersection implements Point {
  public x: number
  public y: number

  constructor (x: number, y: number) {
    this.x = x
    this.y = y
  }
}