import { ILibraryClient } from '../types/ILibraryClient'

export default class LibraryClientManager {
  private _currentClientId = 0
  private clientList: Set<ILibraryClient> = new Set<ILibraryClient>()

  public get newClientId (): number {
    return ++this._currentClientId
  }

  createNewClient (client: ILibraryClient): void {
    this.clientList.add(client)
  }

  removeClient (client: ILibraryClient): void {
    this.clientList.delete(client)
  }

  getClientList (): ILibraryClient[] {
    return Array.from(this.clientList)
  }

  getClientById (id: number): ILibraryClient | undefined {
    return this.getClientList().find(client => client.id === id)
  }

  updateClient (client: ILibraryClient): void {
    const foundClient = this.getClientById(client.id)
    if (foundClient) {
      this.removeClient(foundClient)
      this.createNewClient(client)
    } else {
      throw new Error('Client not found')
    }
  }
}