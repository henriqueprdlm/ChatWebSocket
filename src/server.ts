import express, { Application } from 'express'
import http from 'http'
import {Server} from 'socket.io'
import path from 'path'

class App{
    private app: Application
    private http: http.Server
    private io: Server

    constructor(){
        this.app = express()
        this.http = http.createServer(this.app)
        this.io = new Server(this.http)

        this.listenSocket()
        this.setupRoutes()
        this.app.use(express.static(path.join(__dirname, '../public')))
    }

    listenServer(){
        this.http.listen(3000, ()=> console.log('Server running on port 3000'))
    }

    listenSocket(){
        this.io.on('connection', (socket)=>{
            console.log('User connected => ', socket.id)

            socket.on('user_connected', (username) => {
                console.log(`${username} entrou no chat.`)
            })

            socket.on('message', (msg)=> {
                this.io.emit('message', msg)
            })

            socket.on('user_disconnected', (username) => {
                console.log(`${username} saiu do chat.`);
            });

            socket.on('disconnect', () => {
                console.log('User disconnected => ', socket.id)
            })
        })
    }

    setupRoutes(){
        this.app.get('/', (req, res) =>{
            res.sendFile(path.join(__dirname, '../public/index.html'))
        })
    }
}

const app = new App()

app.listenServer()