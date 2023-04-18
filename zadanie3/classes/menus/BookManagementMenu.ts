import Menu from '../Menu.js'

export default class BookManagementMenu extends Menu {
  menuOptions = [
    {
      name: 'Add new book',
      action: async () => {
        console.log('Add book')
      }
    },
    {
      name: 'Remove book',
      action: async () => {
        console.log('Remove book')
      }
    }

  ]
}