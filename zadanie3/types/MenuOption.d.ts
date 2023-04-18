export type MenuOption = MenuOptionAction | MenuOptionSubmenu

export type MenuOptionAction = {
  name: string
  action: () => Promise<void>
}

export type MenuOptionSubmenu = {
  name: string
  subMenu: MenuOption[]
}