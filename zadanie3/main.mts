import LibraryManager from './classes/LibraryManager.js'
import TUIManager from './classes/TUIManager.js'

LibraryManager.populate()

new TUIManager().showMainMenu()