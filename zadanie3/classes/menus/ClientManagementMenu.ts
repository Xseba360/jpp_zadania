import Menu from '../Menu.js'

export default class ClientManagementMenu extends Menu {
  menuOptions = [
    {
      name: 'Add new client',
      action: async () => {
        console.log('Add client')
      }
    },
    {
      name: 'Remove client',
      action: async () => {
        console.log('Remove client')
      }
    }
  ]
}