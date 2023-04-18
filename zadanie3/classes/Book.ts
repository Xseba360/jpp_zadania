import { IBook } from '../types/IBook'
import BookSpecimen from './BookSpecimen.js'
import { ESpecimenStatus } from './ESpecimenStatus.js'

export default class Book implements IBook {
  public id: number
  public title: string
  public author: string
  public genre: string
  public publisher: string
  public isbn: string
  public releaseDate: Date
  public specimenList: BookSpecimen[]

  private currentSpecimenId = 1

  constructor (props: Omit<IBook, 'specimenList'>) {
    this.specimenList = []
    this.id = props.id
    this.title = props.title
    this.author = props.author
    this.releaseDate = props.releaseDate
    this.publisher = props.publisher
    this.isbn = props.isbn
    this.genre = props.genre
  }

  get count (): number {
    return this.specimenList.length
  }

  createSpecimens (amount: number): void {
    this.specimenList = Array.from({ length: amount }, () => {
      return new BookSpecimen(this.currentSpecimenId++, ESpecimenStatus.IN_LIBRARY)
    })
  }

  getAnyAvailableSpecimen (): BookSpecimen | undefined {
    for (const specimen of this.specimenList) {
      if (specimen.isAvailable()) {
        return specimen
      }
    }
  }

  addNewSpecimen (): void {
    this.specimenList.push(new BookSpecimen(this.currentSpecimenId++, ESpecimenStatus.IN_LIBRARY))
  }

  removeSpecimen (specimen: BookSpecimen): void {
    const index = this.specimenList.indexOf(specimen)
    if (index !== -1) {
      this.specimenList.splice(index, 1)
    }
  }

  removeSpecimenById (id: number): void {
    const specimen = this.specimenList.find(specimen => specimen.id === id)
    if (specimen) {
      this.removeSpecimen(specimen)
    }
  }
}