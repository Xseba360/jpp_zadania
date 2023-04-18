import Menu from '../Menu.js'
import BookManagementMenu from './BookManagementMenu.js'
import ClientManagementMenu from './ClientManagementMenu.js'

export default class MainMenu extends Menu {
  menuOptions = [
    {
      name: 'Book management',
      subMenu: new BookManagementMenu().getOptions()
    },
    {
      name: 'Client management',
      subMenu: new ClientManagementMenu().getOptions()
    }
  ]

}