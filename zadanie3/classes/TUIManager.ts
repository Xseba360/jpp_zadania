import * as readline from 'readline'
import MainMenu from './menus/MainMenu.js'
import { MenuOption, MenuOptionAction, MenuOptionSubmenu } from '../types/MenuOption.js'

export default class TUIManager {
  private rl: readline.Interface

  showMainMenu () {
    this.showMenu(new MainMenu().getOptions()).then()
  }

  private isSubmenu (option: MenuOption): option is MenuOptionSubmenu {
    return (option as MenuOptionSubmenu).subMenu !== undefined
  }

  private isAction (option: MenuOption): option is MenuOptionAction {
    return (option as MenuOptionAction).action !== undefined
  }

  private showMenuOptions (options: MenuOption[]) {
    for (let i = 0; i < options.length; i++) {
      const option = options[i]
      console.log(`${i + 1}. ${option.name}`)
    }
    console.log('Your choice: ')
  }

  async showMenu (options: MenuOption[]) {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    console.clear()
    this.showMenuOptions(options)

    for await (const line of this.rl) {
      const choice = parseInt(line)
      if (choice > 0 && choice <= options.length) {
        const option = options[choice - 1]
        this.rl.close()
        if (this.isSubmenu(option)) {
          this.showMenu(option.subMenu).then()
          break
        } else if (this.isAction(option)) {
          option.action().then()
          break
        } else {
          console.error('Unknown option')
        }
        break
      } else {
        this.showMenuOptions(options)
      }
    }
  }
}

