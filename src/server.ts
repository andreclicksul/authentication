import fastify from 'fastify'
import cors from '@fastify/cors'
import { authRoutes } from './routes/authRoutes'

const app = fastify()

app.register(cors, {
  origin: ['http://localhost:3333'], // ambiente de teste e de produção
})
app.register(authRoutes)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log(' Server started!')
  })
