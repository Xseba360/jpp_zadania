import Book from './Book.js'

export default class LibraryBookManager {
  bookList = new Set<Book>()
  private _currentBookId = 0

  public get newBookId (): number {
    return ++this._currentBookId
  }

  public addBook (book: Book): void {
    this.bookList.add(book)
  }

  public removeBook (book: Book): void {
    this.bookList.delete(book)
  }

  public updateBook (book: Book): void {
    const foundBook = this.getBookById(book.id)
    if (foundBook) {
      this.removeBook(foundBook)
      this.addBook(book)
    } else {
      throw new Error('Book not found')
    }
  }

  public getBookList (): Book[] {
    return Array.from(this.bookList)
  }

  public getBookById (id: number): Book | undefined {
    return this.getBookList().find(book => book.id === id)
  }

  public searchBookByTitle (title: string): Book[] {
    return this.getBookList().filter(book => book.title.toLowerCase().includes(title.toLowerCase()))
  }

  public searchBookByAuthor (author: string): Book[] {
    return this.getBookList().filter(book => book.author.toLowerCase().includes(author.toLowerCase()))
  }

  public searchBookByGenre (genre: string): Book[] {
    return this.getBookList().filter(book => book.genre.toLowerCase().includes(genre.toLowerCase()))
  }
}