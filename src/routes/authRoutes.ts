import 'dotenv/config'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcrypt'

export async function authRoutes(app: FastifyInstance) {
  // Ler um usuário
  app.get('/readuser/:id', async (request, reply) => {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      })
      const { id } = paramsSchema.parse(request.params)

      const user = await prisma.tb_user.findUniqueOrThrow({
        select: {
          id: true,
          name: true,
          login: true,
          dtregister: true,
          lastchange: true,
        },
        where: {
          id,
        },
      })

      reply.code(200).send({ msg: 'Usuário OK', data: user })
    } catch (error) {
      reply.code(404).send({ msg: 'Usuário não cadastrado' })
    }
  })

  // Criação de usuário
  app.post('/createuser', async (request, reply) => {
    try {
      const bodySchema = z.object({
        name: z.string(),
        login: z.string(),
        password: z.string(),
        userchange: z.string(),
      })

      const { name, login, password, userchange } = bodySchema.parse(
        request.body,
      )

      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(password, salt)

      const user = await prisma.tb_user.create({
        data: {
          name,
          login,
          password: passwordHash,
          userchange,
        },
      })

      reply.code(200).send({ msg: 'OK', data: user })
    } catch (error) {
      reply.code(401).send({ msg: 'Usuário já cadastrado' })
    }
  })

  // Autenticação de usuário
  app.post('/authenticate', async (request, reply) => {
    try {
      const bodySchema = z.object({
        login: z.string(),
        password: z.string(),
      })

      const { login, password } = bodySchema.parse(request.body)

      const user = await prisma.tb_user.findUniqueOrThrow({
        select: {
          id: true,
          password: true,
          name: true,
        },
        where: {
          login,
        },
      })

      const checkPassword = await bcrypt.compare(password, user.password)

      if (!checkPassword) throw new Error()

      const token = app.jwt.sign({ id: user.id })

      reply.code(200).send({ msg: 'OK', data: user, token })
    } catch (error) {
      reply.code(401).send({ msg: 'Falha no Login' })
    }
  })
}
