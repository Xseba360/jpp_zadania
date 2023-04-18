import { IMenu } from '../types/IMenu.js'
import { MenuOption } from '../types/MenuOption.js'

export default abstract class Menu implements IMenu {
  menuOptions: MenuOption[] = []

  public getOptions (): MenuOption[] {
    return this.menuOptions
  }

}