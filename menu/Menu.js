class Menu {
    constructor() {
        this.items = []
    }

    async loadMenu() {
        try {
            const response = await fetch('menu.json')
            this.items = await response.json()
            return this.items
        } catch (error) {
            console.error('Erreur lors du chargement du menu:', error)
            throw error
        }
    }

    getItems() {
        return this.items
    }
}

export { Menu }