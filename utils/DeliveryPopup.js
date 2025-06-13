class DeliveryPopup {
    constructor() {
        this.popup = document.getElementById('delivery-popup')
        this.closeButton = document.getElementById('close-delivery-popup')
        this.setupEventListeners()
    }

    setupEventListeners() {
        this.closeButton.addEventListener('click', () => {
            this.close()
        })

        this.popup.addEventListener('click', (event) => {
            if (event.target === this.popup) {
                this.close()
            }
        })

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.popup.style.display === 'block') {
                this.close()
            }
        })
    }

    show(orderId) {
        console.log(`🤮 Popup de livraison pour la commande ${orderId}`)
        
        this.popup.style.display = 'block'
        
        this.playDeliverySound()
        
        setTimeout(() => {
            if (this.popup.style.display === 'block') {
                this.close()
            }
        }, 10000)
    }

    close() {
        this.popup.style.display = 'none'
        console.log('Popup de livraison fermée')
    }

    playDeliverySound() {
        try {
            const audio = new Audio('sounds/vomi.mp3')
            audio.volume = 0.3
            audio.play().catch(() => {
                console.log('Son non disponible (normal)')
            })
        } catch (error) {
            console.log('Son non chargé')
        }
    }
}

export { DeliveryPopup }