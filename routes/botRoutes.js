const Compras = require('../controllers/FinalizarComprasController')
const MercadoPagoPagamentos = require('../utils/mercadoPago')

const myApiEXPRESS = require('express').Router()


myApiEXPRESS.post('/mercadoPago', MercadoPagoPagamentos.routerWebhook)

module.exports = myApiEXPRESS