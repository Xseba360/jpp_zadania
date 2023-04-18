import LibraryBookManager from './LibraryBookManager.js'
import LibraryClientManager from './LibraryClientManager.js'
import Book from './Book.js'

declare interface FakerResponse<T> {
  status: string
  code: number
  total: number
  data: T[]
}

declare type FakerBook = {
  id: number
  title: string
  author: string
  genre: string
  description: string
  isbn: string
  image: string
  publisher: string
  published: string
}

declare type FakerPerson = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  birthday: string
  gender: string
  address: {
    id: number
    street: string
    streetName: string
    buildingNumber: string
    city: string
    zipcode: string
    country: string
    county_code: string
    latitude: number
    longitude: number
  }
  website: string
  image: string
}

export default class LibraryManager {
  static _clientManager: LibraryClientManager
  static _bookManager: LibraryBookManager

  static get clientManager (): LibraryClientManager {
    if (!this._clientManager) {
      this._clientManager = new LibraryClientManager()
    }
    return this._clientManager
  }

  static get bookManager (): LibraryBookManager {
    if (!this._bookManager) {
      this._bookManager = new LibraryBookManager()
    }
    return this._bookManager
  }

  static populate (): void {

    this.createRandomBooks()
      .then(() => this.createRandomClients())
  }

  static async createRandomBooks (): Promise<void> {
    const req = await fetch('https://fakerapi.it/api/v1/books?_quantity=10')
    const res: FakerResponse<FakerBook> = await req.json()
    for (const book of res.data) {
      const newBook = new Book({
        id: this.bookManager.newBookId,
        title: book.title,
        author: book.author,
        genre: book.genre,
        publisher: book.publisher,
        isbn: book.isbn,
        releaseDate: new Date(book.published)
      })
      this.bookManager.addBook(newBook)
    }
  }

  static async createRandomClients (): Promise<void> {
    const req = await fetch('https://fakerapi.it/api/v1/persons?_quantity=10')
    const res: FakerResponse<FakerPerson> = await req.json()
    for (const client of res.data) {
      this.clientManager.createNewClient({
        id: this._clientManager.newClientId,
        address: client.address.street + ', ' + client.address.city,
        email: client.email,
        firstName: client.firstname,
        lastName: client.lastname,
        phoneNumber: client.phone
      })
    }
  }
}