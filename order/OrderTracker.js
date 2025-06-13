class OrderTracker {
    constructor(storage = null) {
        this.orders = []
        this.nextOrderId = 1
        this.maxOrders = 5
        this.storage = storage
        this.statuses = [
            { id: 'preparation', name: 'Préparation', delay: 3000 },
            { id: 'delivery', name: 'En livraison', delay: 4000 },
            { id: 'delivered', name: 'Livré !', delay: 0 }
        ]
        
        if (this.storage) {
            this.loadFromStorage()
        }
    }

    loadFromStorage() {
        const savedOrders = this.storage.loadOrders()
        const savedNextId = this.storage.loadNextOrderId()
        
        if (savedOrders.length > 0) {
            this.orders = savedOrders
            console.log('Commandes restaurées depuis le stockage')
            
            this.resumeActiveOrders()
        }
        
        this.nextOrderId = savedNextId
    }

    resumeActiveOrders() {
        const activeOrders = this.orders.filter(order => 
            order.status === 'preparation' || order.status === 'delivery'
        )
        
        activeOrders.forEach(order => {
            console.log(`Reprise du suivi pour la commande ${order.id}`)
            this.startOrderTracking(order.id)
        })
    }

    saveToStorage() {
        if (this.storage) {
            this.storage.saveOrders(this.orders)
            this.storage.saveNextOrderId(this.nextOrderId)
        }
    }

    async fakePostCommande(order) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() < 0.1) {
                    reject(new Error('Erreur serveur lors de l envoi de la commande'))
                    return
                }
                
                const orderId = this.generateOrderId()
                resolve({
                    id: orderId,
                    status: 'preparation',
                    items: order.getItems(),
                    total: order.getTotal(),
                    timestamp: new Date().toISOString()
                })
            }, 1500)
        })
    }

    generateOrderId() {
        return `CMD-${this.nextOrderId++}`
    }

    canAddOrder() {
        const activeOrders = this.orders.filter(order => 
            order.status !== 'delivered' && order.status !== 'cancelled'
        )
        return activeOrders.length < this.maxOrders
    }

    getActiveOrdersCount() {
        return this.orders.filter(order => 
            order.status !== 'delivered' && order.status !== 'cancelled'
        ).length
    }

    async addOrder(order) {
        if (!this.canAddOrder()) {
            throw new Error(`Limite de ${this.maxOrders} commandes en cours atteinte`)
        }

        try {
            const processedOrder = await this.fakePostCommande(order)
            this.orders.push(processedOrder)
            this.saveToStorage()
            
            this.startOrderTracking(processedOrder.id)
            
            return processedOrder
        } catch (error) {
            throw error
        }
    }

    async startOrderTracking(orderId) {
        const order = this.orders.find(o => o.id === orderId)
        if (!order) return

        for (let i = 0; i < this.statuses.length; i++) {
            const status = this.statuses[i]
            
            const currentOrder = this.orders.find(o => o.id === orderId)
            if (!currentOrder || currentOrder.status === 'cancelled') break
            
            currentOrder.status = status.id
            this.saveToStorage()
            
            if (status.id === 'delivered' && this.onDelivered) {
                this.onDelivered(orderId)
            }
            
            if (i < this.statuses.length - 1 && status.delay > 0) {
                await this.delay(status.delay)
            }
        }
    }

    setDeliveredCallback(callback) {
        this.onDelivered = callback
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    cancelOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId)
        if (order && order.status === 'preparation') {
            order.status = 'cancelled'
            this.saveToStorage()
            console.log(`Commande ${orderId} annulée`)
            return true
        }
        return false
    }

    getOrders() {
        return this.orders
    }

    getActiveOrders() {
        return this.orders.filter(order => 
            order.status !== 'delivered' && order.status !== 'cancelled'
        )
    }

    clearAllOrders() {
        this.orders = []
        this.nextOrderId = 1
        if (this.storage) {
            this.storage.clearAllData()
        }
        console.log('Toutes les commandes effacées')
    }
}

export { OrderTracker }