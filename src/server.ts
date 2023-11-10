import 'dotenv/config'
import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { authRoutes } from './routes/authRoutes'

export const app = fastify()

const url = process.env.DEV_TEST
const jwtsecret = process.env.JWT_SECRET

const authUrl: object = {
  '/createuser': true,
  '/readuser/:id': true,
}

app.register(cors, {
  origin: [`${url}`], // ambiente de teste e de produção
})

app.register(fastifyJwt, {
  secret: jwtsecret!,
})

app.register(authRoutes)

app.addHook('onRequest', async (req, reply) => {
  try {
    const path: string = req.routeOptions.url
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (authUrl[path]) {
      await req.jwtVerify()
    }
  } catch (error) {
    reply.code(401).send({ msg: 'Sessão encerrada' })
  }
})

app
  .listen({
    port: Number(process.env.PORT),
  })
  .then(() => {
    console.log(' Server started!')
  })
