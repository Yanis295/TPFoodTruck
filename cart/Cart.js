class Cart {
    constructor(storage = null) {
        this.items = []
        this.total = 0
        this.storage = storage
        
        if (this.storage) {
            this.loadFromStorage()
        }
    }

    loadFromStorage() {
        const savedItems = this.storage.loadCart()
        if (savedItems.length > 0) {
            this.items = savedItems
            this.updateTotal()
            console.log('Panier restauré depuis le stockage')
        }
    }

    saveToStorage() {
        if (this.storage) {
            this.storage.saveCart(this.items)
        }
    }

    addItem(menuItem) {
        const existingItem = this.items.find(item => item.id === menuItem.id)
        
        if (existingItem) {
            existingItem.quantity += 1
        } else {
            this.items.push({
                id: menuItem.id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: 1
            })
        }
        
        this.updateTotal()
        this.saveToStorage()
        console.log(`${menuItem.name} ajouté au panier`)
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId)
        this.updateTotal()
        this.saveToStorage()
    }

    updateQuantity(itemId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(itemId)
            return
        }
        
        const item = this.items.find(item => item.id === itemId)
        if (item) {
            item.quantity = newQuantity
            this.updateTotal()
            this.saveToStorage()
        }
    }

    updateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }

    getItems() {
        return this.items
    }

    getTotal() {
        return this.total
    }

    isEmpty() {
        return this.items.length === 0
    }

    clear() {
        this.items = []
        this.total = 0
        if (this.storage) {
            this.storage.clearCart()
        }
    }
}

export { Cart }