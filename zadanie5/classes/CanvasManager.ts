import { Intersection } from './Intersection.js'
import { Street } from './Street.js'
import { Car } from './Car.js'
import { District } from './District.js'

export class CanvasManager {
  constructor (intersections: Intersection[], streets: Street[], cars: Car[], districts: District[], tickRate: number) {
    const canvas = document.createElement('canvas')
    canvas.width = 1000
    canvas.height = 1000

    const padding = 50
    const minX = Math.min(...intersections.map(i => i.x))
    const maxX = Math.max(...intersections.map(i => i.x))
    const minY = Math.min(...intersections.map(i => i.y))
    const maxY = Math.max(...intersections.map(i => i.y))

    const scaleX = (canvas.width - padding * 2) / (maxX - minX)
    const scaleY = (canvas.height - padding * 2) / (maxY - minY)

    document.body.appendChild(canvas)

    const ctx = canvas.getContext('2d')
    setInterval(() => {
      // clear the whole canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      streets.forEach(street => {
        street.draw(ctx, minX, minY, scaleX, scaleY, padding)
      })

      cars.forEach(car => {
        // perform one tick of driving for each car
        car.drive()

        let color: string
        if (car.isAccelerating) {
          color = 'yellow'
        } else if (car.isDecelerating) {
          color = 'red'
        } else {
          color = 'cyan'
        }

        // place box representing a car
        ctx.fillStyle = color
        const x = ((car.currentX - minX) * scaleX) + padding
        const y = ((car.currentY - minY) * scaleY) + padding
        ctx.fillRect(x - 5, y - 5, 10, 10)

        // draw name and speed next to it
        ctx.fillStyle = color
        ctx.font = '12px sans-serif'
        ctx.textAlign = 'left'

        ctx.fillText(`${car.name} | ${(car.currentSpeed * 3.6).toFixed(1)}km/h`, x + 10, y + 5)
      })
    }, 1000 / tickRate)
  }
}