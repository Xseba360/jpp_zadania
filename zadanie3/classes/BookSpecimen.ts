import { IBookSpecimen } from '../types/IBookSpecimen.js'
import { ESpecimenStatus } from './ESpecimenStatus.js'
import { ILibraryClient } from '../types/ILibraryClient.js'

export default class BookSpecimen implements IBookSpecimen {
  public id: number
  public status: ESpecimenStatus

  borrowedBy?: ILibraryClient
  borrowedDate?: Date
  returnDate?: Date

  constructor (id: number, status: ESpecimenStatus) {
    this.id = id
    this.status = status
  }

  public borrow (): void {
    this.status = ESpecimenStatus.BORROWED
  }

  public return (): void {
    this.status = ESpecimenStatus.IN_LIBRARY
  }

  public isBorrowed (): boolean {
    return this.status === ESpecimenStatus.BORROWED
  }

  public isAvailable (): boolean {
    return this.status === ESpecimenStatus.IN_LIBRARY
  }

}