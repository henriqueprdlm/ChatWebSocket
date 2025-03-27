let socket;
const message = document.getElementById('messages')
const input = document.getElementById('input')
const usernameContainer = document.getElementById('username-container')
const usernameInput = document.getElementById('username')
const saveUsernameBtn = document.getElementById('save-username')
const logoutBtn = document.getElementById('logout')
const form = document.getElementById('form')

let username = ''

saveUsernameBtn.addEventListener('click', (e)=> {
    e.preventDefault()

    if(usernameInput.value.trim() !== '') {
        username = usernameInput.value.trim()
        usernameContainer.style.display = 'none'
        form.style.display = 'flex'

        socket = io()

        socket.emit('user_connected', username)

        socket.on('message', (msg)=> {
            const li = document.createElement('li')
            li.innerHTML = `<strong>${msg.user}:</strong> ${msg.text}`
        
            if (msg.user === username) {
                li.classList.add('my-message')
            }
        
            message.appendChild(li)
        })
    }
})

form.addEventListener('submit', (e)=> {
    e.preventDefault()
    if(input.value) {
        socket.emit('message', { user: username, text: input.value})
        input.value = ''
    }
})

logoutBtn.addEventListener('click', ()=> {
    if (socket) {
        socket.emit('user_disconnected', username)
        socket.disconnect()
        socket = null
    }
    usernameContainer.style.display = 'block';
    form.style.display = 'none';
    usernameInput.value = '';
    message.innerHTML = '';
})