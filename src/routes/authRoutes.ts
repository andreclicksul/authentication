import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function authRoutes(app: FastifyInstance) {
  app.post('/authenticate', async (request) => {
    const bodySchema = z.object({
      login: z.string(),
      password: z.string(),
    })

    let status = 200

    const { login, password } = bodySchema.parse(request.body)

    const user = await prisma.tb_user.findUnique({
      select: {
        id: true,
        password: true,
        name: true,
      },
      where: {
        login,
      },
    })

    if (!user || user.password !== password) status = 300

    return { user, status }
  })
}
