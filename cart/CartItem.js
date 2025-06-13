class CartItem {
    constructor(item, onQuantityChange, onRemove) {
        this.item = item
        this.onQuantityChange = onQuantityChange
        this.onRemove = onRemove
    }

    createCartItemElement() {
        const cartItemDiv = document.createElement('div')
        cartItemDiv.className = 'cart-item'
        
        const itemInfo = document.createElement('div')
        itemInfo.className = 'cart-item-info'
        
        const itemName = document.createElement('strong')
        itemName.innerText = this.item.name
        
        const itemPrice = document.createElement('div')
        itemPrice.innerText = `${this.item.price.toFixed(2)} € x ${this.item.quantity}`
        
        itemInfo.appendChild(itemName)
        itemInfo.appendChild(itemPrice)
        
        const controls = document.createElement('div')
        controls.className = 'cart-item-controls'
        
        const decreaseBtn = document.createElement('button')
        decreaseBtn.className = 'quantity-btn'
        decreaseBtn.innerText = '-'
        decreaseBtn.addEventListener('click', () => {
            this.onQuantityChange(this.item.id, this.item.quantity - 1)
        })
        
        const quantity = document.createElement('span')
        quantity.className = 'quantity'
        quantity.innerText = this.item.quantity
        
        const increaseBtn = document.createElement('button')
        increaseBtn.className = 'quantity-btn'
        increaseBtn.innerText = '+'
        increaseBtn.addEventListener('click', () => {
            this.onQuantityChange(this.item.id, this.item.quantity + 1)
        })
        
        const removeBtn = document.createElement('button')
        removeBtn.className = 'btn'
        removeBtn.innerText = 'Supprimer'
        removeBtn.addEventListener('click', () => {
            this.onRemove(this.item.id)
        })
        
        controls.appendChild(decreaseBtn)
        controls.appendChild(quantity)
        controls.appendChild(increaseBtn)
        controls.appendChild(removeBtn)
        
        cartItemDiv.appendChild(itemInfo)
        cartItemDiv.appendChild(controls)
        
        return cartItemDiv
    }
}

export { CartItem }