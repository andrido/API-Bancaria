const express = require('express')
const rotas = express()
const { obterContas, criarConta, atualizarConta, validarConta, deletarConta } = require('./controladores/contas')
const { depositar, sacar, transferencia, saldo, extrato } = require('./controladores/transacoes')
rotas.get('/contas', obterContas); //Esse endpoint deverá listar todas as contas bancárias existentes.

rotas.post('/contas', validarConta, criarConta); // Esse endpoint deverá criar uma conta bancária, onde será gerado um 
//número único para identificação da conta (número da conta).

rotas.put('/contas/:numeroConta/usuario', validarConta, atualizarConta); //Esse endpoint deverá atualizar apenas os dados do usuário de uma conta bancária.

rotas.delete('/contas/:numeroConta', deletarConta); // Esse endpoint deve excluir uma conta bancária existente.

rotas.post('/transacoes/depositar', depositar); //Esse endpoint deverá somar o valor 
//do depósito ao saldo de uma conta válida e registrar essa transação.

rotas.post('/transacoes/sacar', sacar); //Esse endpoint deverá realizar o saque de um valor em uma 
//determinada conta bancária e registrar essa transação.

rotas.post('/transacoes/transferir', transferencia); //Esse endpoint deverá permitir a transferência de recursos (dinheiro)
// de uma conta bancária para outra e registrar essa transação.

rotas.get('/contas/saldo', saldo); //Esse endpoint deverá retornar o saldo de uma conta bancária.

rotas.get('/contas/extrato', extrato); //Esse endpoint deverá listar as transações realizadas de uma conta específica.



module.exports = rotas;