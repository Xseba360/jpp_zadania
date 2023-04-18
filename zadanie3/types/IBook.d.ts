import { IBookSpecimen } from './IBookSpecimen'

export interface IBook {
  id: number
  title: string
  author: string
  releaseDate: Date
  publisher: string
  isbn: string
  genre: string
  specimenList: IBookSpecimen[]
}