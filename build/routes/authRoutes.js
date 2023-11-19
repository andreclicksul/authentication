"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function authRoutes(app) {
    app.get('/', () => {
        console.log('OK');
    });
    // Ler um usuário
    app.get('/readuser/:id', async (request, reply) => {
        try {
            const paramsSchema = zod_1.z.object({
                id: zod_1.z.string().uuid(),
            });
            const { id } = paramsSchema.parse(request.params);
            const user = await prisma_1.prisma.tb_user.findUniqueOrThrow({
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
            });
            reply.code(200).send({ msg: 'Usuário OK', data: user });
        }
        catch (error) {
            reply.code(404).send({ msg: 'Usuário não cadastrado' });
        }
    });
    // Criação de usuário
    app.post('/createuser', async (request, reply) => {
        try {
            const bodySchema = zod_1.z.object({
                name: zod_1.z.string(),
                login: zod_1.z.string(),
                password: zod_1.z.string(),
                userchange: zod_1.z.string(),
            });
            const { name, login, password, userchange } = bodySchema.parse(request.body);
            const salt = await bcrypt_1.default.genSalt(12);
            const passwordHash = await bcrypt_1.default.hash(password, salt);
            const user = await prisma_1.prisma.tb_user.create({
                data: {
                    name,
                    login,
                    password: passwordHash,
                    userchange,
                },
            });
            reply.code(200).send({ msg: 'OK', data: user });
        }
        catch (error) {
            reply.code(401).send({ msg: 'Usuário já cadastrado' });
        }
    });
    // Autenticação de usuário
    app.post('/authenticate', async (request, reply) => {
        try {
            const bodySchema = zod_1.z.object({
                login: zod_1.z.string(),
                password: zod_1.z.string(),
            });
            const { login, password } = bodySchema.parse(request.body);
            const user = await prisma_1.prisma.tb_user.findUniqueOrThrow({
                select: {
                    id: true,
                    password: true,
                    name: true,
                },
                where: {
                    login,
                },
            });
            const checkPassword = await bcrypt_1.default.compare(password, user.password);
            if (!checkPassword)
                throw new Error();
            const token = app.jwt.sign({ id: user.id });
            reply.code(200).send({ msg: 'OK', data: user, token });
        }
        catch (error) {
            reply.code(401).send({ msg: 'Falha no Login' });
        }
    });
}
exports.authRoutes = authRoutes;
