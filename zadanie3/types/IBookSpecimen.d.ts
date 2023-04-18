import { ESpecimenStatus } from '../classes/ESpecimenStatus'
import { ILibraryClient } from './ILibraryClient'

export interface IBookSpecimen {
  id: number
  status: ESpecimenStatus
  borrowedBy?: ILibraryClient
  borrowedDate?: Date
  returnDate?: Date
}