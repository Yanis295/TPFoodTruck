class Order {
    constructor(cartItems) {
        this.items = cartItems
        this.subtotal = 0
        this.tva = 0
        this.total = 0
        this.tvaRate = 0.20 // 20% de TVA
        this.calculateTotals()
    }

    calculateTotals() {
        this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        this.tva = this.subtotal * this.tvaRate
        this.total = this.subtotal + this.tva
    }

    getSubtotal() {
        return this.subtotal
    }

    getTva() {
        return this.tva
    }

    getTotal() {
        return this.total
    }

    getItems() {
        return this.items
    }

    createOrderSummary() {
        const summaryDiv = document.createElement('div')
        
        this.items.forEach(item => {
            const itemDiv = document.createElement('div')
            itemDiv.className = 'order-summary-item'
            
            const itemInfo = document.createElement('span')
            itemInfo.innerText = `${item.name} x${item.quantity}`
            
            const itemPrice = document.createElement('span')
            itemPrice.innerText = `${(item.price * item.quantity).toFixed(2)} €`
            
            itemDiv.appendChild(itemInfo)
            itemDiv.appendChild(itemPrice)
            summaryDiv.appendChild(itemDiv)
        })
        
        return summaryDiv
    }

    createTotalsSummary() {
        const totalsDiv = document.createElement('div')
        
        const subtotalLine = document.createElement('div')
        subtotalLine.className = 'total-line'
        subtotalLine.innerHTML = `<span>Sous-total HT:</span><span>${this.subtotal.toFixed(2)} €</span>`
        
        const tvaLine = document.createElement('div')
        tvaLine.className = 'total-line'
        tvaLine.innerHTML = `<span>TVA (${(this.tvaRate * 100)}%):</span><span>${this.tva.toFixed(2)} €</span>`
        
        const totalLine = document.createElement('div')
        totalLine.className = 'total-line final'
        totalLine.innerHTML = `<span>Total TTC:</span><span>${this.total.toFixed(2)} €</span>`
        
        totalsDiv.appendChild(subtotalLine)
        totalsDiv.appendChild(tvaLine)
        totalsDiv.appendChild(totalLine)
        
        return totalsDiv
    }
}

export { Order }