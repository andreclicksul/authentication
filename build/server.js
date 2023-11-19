"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv/config");
const fastify_1 = __importDefault(require("fastify"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cors_1 = __importDefault(require("@fastify/cors"));
const authRoutes_1 = require("./routes/authRoutes");
exports.app = (0, fastify_1.default)();
const url = process.env.DEV_TEST;
const jwtsecret = process.env.JWT_SECRET;
const authUrl = {
    '/createuser': true,
    '/readuser/:id': true,
};
exports.app.register(cors_1.default, {
    origin: [`${url}`], // ambiente de teste e de produção
});
exports.app.register(jwt_1.default, {
    secret: jwtsecret,
});
exports.app.register(authRoutes_1.authRoutes);
exports.app.addHook('onRequest', async (req, reply) => {
    try {
        const path = req.routeOptions.url;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (authUrl[path]) {
            await req.jwtVerify();
        }
    }
    catch (error) {
        reply.code(401).send({ msg: 'Sessão encerrada' });
    }
});
exports.app
    .listen({
    port: Number(process.env.PORT),
})
    .then(() => {
    console.log(' Server started!');
});
