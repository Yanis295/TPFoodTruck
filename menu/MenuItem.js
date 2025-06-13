class MenuItem {
    constructor(id, name, description, price, image) {
        this.id = id
        this.name = name
        this.description = description
        this.price = price
        this.image = image
    }

    createMenuItemElement(onAddToCart) {
        const menuItemDiv = document.createElement('div')
        menuItemDiv.className = 'menu-item'
        
        const img = document.createElement('img')
        img.src = this.image
        img.alt = this.name
        
        const title = document.createElement('h3')
        title.innerText = this.name
        
        const description = document.createElement('p')
        description.innerText = this.description
        
        const price = document.createElement('div')
        price.className = 'price'
        price.innerText = `${this.price.toFixed(2)} €`
        
        const button = document.createElement('button')
        button.className = 'btn'
        button.innerText = 'Ajouter au panier'
        button.addEventListener('click', () => {
            onAddToCart(this)
        })
        
        menuItemDiv.appendChild(img)
        menuItemDiv.appendChild(title)
        menuItemDiv.appendChild(description)
        menuItemDiv.appendChild(price)
        menuItemDiv.appendChild(button)
        
        return menuItemDiv
    }
}

export { MenuItem }