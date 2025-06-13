class Storage {
    constructor() {
        this.cartKey = 'foodtruck_cart'
        this.ordersKey = 'foodtruck_orders'
        this.orderIdKey = 'foodtruck_next_order_id'
    }

    saveCart(cartItems) {
        try {
            const cartData = {
                items: cartItems,
                timestamp: new Date().toISOString()
            }
            localStorage.setItem(this.cartKey, JSON.stringify(cartData))
            console.log('Panier sauvegardé')
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du panier:', error)
        }
    }

    loadCart() {
        try {
            const cartData = localStorage.getItem(this.cartKey)
            if (cartData) {
                const parsed = JSON.parse(cartData)
                console.log('Panier chargé depuis le stockage')
                return parsed.items || []
            }
        } catch (error) {
            console.error('Erreur lors du chargement du panier:', error)
        }
        return []
    }

    clearCart() {
        try {
            localStorage.removeItem(this.cartKey)
            console.log('Panier vidé du stockage')
        } catch (error) {
            console.error('Erreur lors du vidage du panier:', error)
        }
    }

    saveOrders(orders) {
        try {
            const ordersData = {
                orders: orders,
                timestamp: new Date().toISOString()
            }
            localStorage.setItem(this.ordersKey, JSON.stringify(ordersData))
            console.log('Commandes sauvegardées')
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des commandes:', error)
        }
    }

    loadOrders() {
        try {
            const ordersData = localStorage.getItem(this.ordersKey)
            if (ordersData) {
                const parsed = JSON.parse(ordersData)
                console.log('Commandes chargées depuis le stockage')
                return parsed.orders || []
            }
        } catch (error) {
            console.error('Erreur lors du chargement des commandes:', error)
        }
        return []
    }

    saveNextOrderId(nextId) {
        try {
            localStorage.setItem(this.orderIdKey, nextId.toString())
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l ID de commande:', error)
        }
    }

    loadNextOrderId() {
        try {
            const savedId = localStorage.getItem(this.orderIdKey)
            if (savedId) {
                return parseInt(savedId, 10)
            }
        } catch (error) {
            console.error('Erreur lors du chargement de l ID de commande:', error)
        }
        return 1
    }

    clearAllData() {
        try {
            localStorage.removeItem(this.cartKey)
            localStorage.removeItem(this.ordersKey)
            localStorage.removeItem(this.orderIdKey)
            console.log('Toutes les données effacées')
        } catch (error) {
            console.error('Erreur lors de l effacement des données:', error)
        }
    }
}

export { Storage }