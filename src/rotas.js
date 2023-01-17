
const express = require("express");
const { listaConta, criarConta, atualizarConta, excluirConta, consultarSaldo, emitirExtrato, depositarConta, sacarConta, traferirConta, traferirValor } = require("./controlador/controlador");
const validaSenha = require('./intermediario/intermediarios');

const rotas = express.Router();

rotas.get("/contas",validaSenha,listaConta)
rotas.post("/contas",criarConta)
rotas.put("/contas/:numeroConta/usuario",atualizarConta)
rotas.delete("/contas/:numeroConta",excluirConta)
rotas.get("/contas/saldo",consultarSaldo)
rotas.get("/contas/extrato",emitirExtrato)
rotas.post("/transacoes/depositar",depositarConta)
rotas.post("/transacoes/sacar",sacarConta)
rotas.post("/transacoes/trasferir",traferirValor)



module.exports = {
    rotas
}
