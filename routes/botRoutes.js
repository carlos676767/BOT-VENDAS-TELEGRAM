const CartaoDeCredito = require('../controllers/ComprasCartaoCreditoController')
const Compras = require('../controllers/ComprasPixController')
const MercadoPagoPagamentos = require('../utils/mercadoPago')
const StripeApi = require('../utils/stripe')

const expressApiRouter = require('express').Router()


expressApiRouter.post('/mercadoPago', MercadoPagoPagamentos.routerWebhook)
expressApiRouter.post('/stripeNotificao', StripeApi.notificacoesPagamento)

module.exports = expressApiRouter