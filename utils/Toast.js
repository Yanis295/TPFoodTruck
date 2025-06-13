class Toast {
    constructor() {
        this.container = document.getElementById('toast-container')
        if (!this.container) {
            this.container = document.createElement('div')
            this.container.id = 'toast-container'
            this.container.className = 'toast-container'
            document.body.appendChild(this.container)
        }
    }

    show(message, type = 'success', duration = 3000) {
        const toast = document.createElement('div')
        toast.className = `toast ${type}`
        toast.innerText = message

        this.container.appendChild(toast)

        toast.offsetHeight

        toast.classList.add('show')

        setTimeout(() => {
            this.hide(toast)
        }, duration)

        return toast
    }

    hide(toast) {
        toast.classList.remove('show')
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast)
            }
        }, 300)
    }

    success(message, duration = 3000) {
        return this.show(message, 'success', duration)
    }

    error(message, duration = 5000) {
        return this.show(message, 'error', duration)
    }
}

export { Toast }