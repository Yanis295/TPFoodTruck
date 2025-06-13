class OrderModal {
    constructor() {
        this.modal = document.getElementById('order-modal')
        this.orderSummaryContainer = document.getElementById('order-summary')
        this.orderTotalsContainer = document.getElementById('order-totals')
        this.cancelButton = document.getElementById('cancel-order')
        this.validateButton = document.getElementById('validate-order')
        
        this.setupEventListeners()
    }

    setupEventListeners() {
        this.cancelButton.addEventListener('click', () => {
            this.close()
        })
        
        this.modal.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.close()
            }
        })
    }

    open(order, onValidate) {
        this.orderSummaryContainer.innerHTML = ''
        this.orderTotalsContainer.innerHTML = ''
        
        const summary = order.createOrderSummary()
        this.orderSummaryContainer.appendChild(summary)
        
        const totals = order.createTotalsSummary()
        this.orderTotalsContainer.appendChild(totals)
        
        this.validateButton.onclick = () => {
            onValidate(order)
            this.close()
        }
        
        this.modal.style.display = 'block'
        
        console.log('Modale de commande ouverte')
    }

    close() {
        this.modal.style.display = 'none'
        console.log('Modale de commande fermée')
    }
}

export { OrderModal }