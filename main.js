import { Menu } from './menu/Menu.js'
import { MenuItem } from './menu/MenuItem.js'
import { Cart } from './cart/Cart.js'
import { CartItem } from './cart/CartItem.js'
import { Order } from './order/Order.js'
import { OrderModal } from './order/OrderModal.js'
import { OrderTracker } from './order/OrderTracker.js'
import { OrderCard } from './order/OrderCard.js'
import { Toast } from './utils/Toast.js'
import { Storage } from './utils/Storage.js'
import { DeliveryPopup } from './utils/DeliveryPopup.js'

const loadingElement = document.getElementById('loading')
const menuContainer = document.getElementById('menu-container')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotalElement = document.getElementById('cart-total')
const orderButton = document.getElementById('order-btn')
const ordersListContainer = document.getElementById('orders-list')
const ordersCountElement = document.getElementById('orders-count')
const clearAllButton = document.getElementById('clear-all-btn')

const storage = new Storage()
const cart = new Cart(storage)
const orderTracker = new OrderTracker(storage)
const orderModal = new OrderModal()
const toast = new Toast()
const deliveryPopup = new DeliveryPopup()

orderTracker.setDeliveredCallback((orderId) => {
    toast.success(`🎉 Commande ${orderId} livrée !`)
    deliveryPopup.show(orderId)
})

let updateInterval

function updateCartDisplay() {
    cartItemsContainer.innerHTML = ''
    
    if (cart.isEmpty()) {
        cartItemsContainer.innerHTML = '<p>Votre panier est vide</p>'
        orderButton.disabled = true
    } else {
        cart.getItems().forEach(item => {
            const cartItem = new CartItem(
                item,
                (itemId, newQuantity) => {
                    cart.updateQuantity(itemId, newQuantity)
                    updateCartDisplay()
                },
                (itemId) => {
                    cart.removeItem(itemId)
                    updateCartDisplay()
                }
            )
            const cartItemElement = cartItem.createCartItemElement()
            cartItemsContainer.appendChild(cartItemElement)
        })
        orderButton.disabled = false
    }
    
    cartTotalElement.innerText = `Total: ${cart.getTotal().toFixed(2)} €`
}

function updateOrdersDisplay() {
    ordersListContainer.innerHTML = ''
    
    const orders = orderTracker.getOrders()
    const activeOrdersCount = orderTracker.getActiveOrdersCount()
    
    ordersCountElement.innerText = `${activeOrdersCount}/${orderTracker.maxOrders} commandes en cours`
    
    if (orders.length === 0) {
        ordersListContainer.innerHTML = '<p>Aucune commande en cours</p>'
        return
    }
    
    const sortedOrders = orders.sort((a, b) => {
        const statusOrder = { 'preparation': 1, 'delivery': 2, 'delivered': 3, 'cancelled': 4 }
        return statusOrder[a.status] - statusOrder[b.status]
    })
    
    sortedOrders.forEach(order => {
        const orderCard = new OrderCard(order, handleOrderCancel)
        const orderElement = orderCard.createOrderCardElement()
        ordersListContainer.appendChild(orderElement)
    })
}

function handleOrderCancel(orderId) {
    const success = orderTracker.cancelOrder(orderId)
    if (success) {
        toast.success('Commande annulée avec succès')
        updateOrdersDisplay()
    } else {
        toast.error('Impossible d annuler cette commande')
    }
}

function handleClearAll() {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les données (panier + commandes) ?')) {
        cart.clear()
        orderTracker.clearAllOrders()
        updateCartDisplay()
        updateOrdersDisplay()
        toast.success('Toutes les données ont été effacées')
    }
}

function addToCart(menuItem) {
    cart.addItem(menuItem)
    updateCartDisplay()
}

async function handleOrderValidation(order) {
    try {
        if (!orderTracker.canAddOrder()) {
            toast.error(`Limite de ${orderTracker.maxOrders} commandes en cours atteinte`)
            return
        }
        
        toast.success('Envoi de votre commande en cours...')
        
        const processedOrder = await orderTracker.addOrder(order)
        
        toast.success(`Commande ${processedOrder.id} validée avec succès !`)
        
        cart.clear()
        updateCartDisplay()
        updateOrdersDisplay()
        
        console.log('Commande traitée:', processedOrder)
        
    } catch (error) {
        console.error('Erreur lors de la validation:', error)
        toast.error(`Erreur: ${error.message}`)
    }
}

orderButton.addEventListener('click', () => {
    if (!cart.isEmpty()) {
        const order = new Order(cart.getItems())
        orderModal.open(order, handleOrderValidation)
    }
})

clearAllButton.addEventListener('click', handleClearAll)

async function loadAndDisplayMenu() {
    try {
        const menu = new Menu()
        const menuItems = await menu.loadMenu()
        
        loadingElement.style.display = 'none'
        
        menuItems.forEach(item => {
            const menuItem = new MenuItem(
                item.id,
                item.name,
                item.description,
                item.price,
                item.image
            )
            const menuItemElement = menuItem.createMenuItemElement(addToCart)
            menuContainer.appendChild(menuItemElement)
        })
        
        console.log('Menu chargé avec succès')
        
    } catch (error) {
        loadingElement.innerText = 'Erreur lors du chargement du menu'
        toast.error('Erreur lors du chargement du menu')
        console.error('Erreur:', error)
    }
}

function startOrdersUpdate() {
    updateInterval = setInterval(() => {
        updateOrdersDisplay()
    }, 1000)
}

window.addEventListener('beforeunload', () => {
    if (updateInterval) {
        clearInterval(updateInterval)
    }
})

console.log('Application Food Truck démarrée avec persistance')
updateCartDisplay()
updateOrdersDisplay()
startOrdersUpdate()

loadAndDisplayMenu()