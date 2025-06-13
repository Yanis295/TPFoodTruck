class OrderCard {
    constructor(order, onCancel) {
        this.order = order
        this.onCancel = onCancel
        this.statuses = [
            { id: 'preparation', name: 'Préparation' },
            { id: 'delivery', name: 'En livraison' },
            { id: 'delivered', name: 'Livré !' },
            { id: 'cancelled', name: 'Annulée' }
        ]
    }

    createOrderCardElement() {
        const cardDiv = document.createElement('div')
        cardDiv.className = 'order-card'
        cardDiv.setAttribute('data-order-id', this.order.id)

        const header = this.createOrderHeader()
        cardDiv.appendChild(header)

        const status = this.createOrderStatus()
        cardDiv.appendChild(status)

        if (this.order.status === 'preparation') {
            const actions = this.createOrderActions()
            cardDiv.appendChild(actions)
        }

        return cardDiv
    }

    createOrderHeader() {
        const headerDiv = document.createElement('div')
        headerDiv.className = 'order-header'

        const orderId = document.createElement('span')
        orderId.className = 'order-id'
        orderId.innerText = this.order.id

        const orderTotal = document.createElement('span')
        orderTotal.className = 'order-total'
        orderTotal.innerText = `${this.order.total.toFixed(2)} €`

        headerDiv.appendChild(orderId)
        headerDiv.appendChild(orderTotal)

        return headerDiv
    }

    createOrderStatus() {
        const statusContainer = document.createElement('div')

        this.statuses.slice(0, 3).forEach((status, index) => {
            const statusDiv = document.createElement('div')
            statusDiv.className = 'order-status'

            const indicator = document.createElement('div')
            indicator.className = 'status-indicator'

            const text = document.createElement('span')
            text.className = 'status-text'
            text.innerText = status.name

            if (this.order.status === 'cancelled') {
                if (index === 0) {
                    indicator.classList.add('active')
                    text.classList.add('active')
                }
            } else {
                const currentStatusIndex = this.statuses.findIndex(s => s.id === this.order.status)
                
                if (index < currentStatusIndex) {
                    indicator.classList.add('active')
                    text.classList.add('active')
                } else if (index === currentStatusIndex) {
                    indicator.classList.add('current')
                    text.classList.add('current')
                }
            }

            statusDiv.appendChild(indicator)
            statusDiv.appendChild(text)
            statusContainer.appendChild(statusDiv)
        })

        if (this.order.status === 'cancelled') {
            const cancelledDiv = document.createElement('div')
            cancelledDiv.className = 'order-status'
            cancelledDiv.innerHTML = `
                <div class="status-indicator active"></div>
                <span class="status-text active">Commande annulée</span>
            `
            statusContainer.appendChild(cancelledDiv)
        }

        return statusContainer
    }

    createOrderActions() {
        const actionsDiv = document.createElement('div')
        actionsDiv.className = 'order-actions'

        const cancelButton = document.createElement('button')
        cancelButton.className = 'btn-cancel-order'
        cancelButton.innerText = 'Annuler la commande'
        cancelButton.addEventListener('click', () => {
            this.onCancel(this.order.id)
        })

        actionsDiv.appendChild(cancelButton)
        return actionsDiv
    }

    updateStatus(newStatus) {
        this.order.status = newStatus
        const card = document.querySelector(`[data-order-id="${this.order.id}"]`)
        if (card) {
            const oldStatus = card.querySelector('.order-status').parentNode
            const newStatusContainer = this.createOrderStatus()
            oldStatus.replaceChild(newStatusContainer, oldStatus.querySelector('.order-status').parentNode)
        }
    }
}

export { OrderCard }