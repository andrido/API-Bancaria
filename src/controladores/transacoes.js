let bancodedados = require('../bancodedados')
let { banco, contas, saques, depositos, transferencias, numeroUnico } = bancodedados
let { nome, numero, agencia, senha } = banco



const registroDeData = () => {
    const momento = new Date().toLocaleString()


    let registro = momento.split(",")

    let data = registro[0].split("/")
    let hora = registro[1].trim()  // ou .slice(1)




    return horario = `${data[0]}-${data[1]}-${data[2]} ${hora}`


}
const depositar = (req, res) => {

    const { numero_conta, valor } = req.body

    let contaExistente = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })
    if (!valor) {
        return res.status(400).json({ mensagem: "o valor a depositar deve ser informado." })
    }

    if (!contaExistente) {
        return res.status(400).json({ mensagem: `conta de número (${numero_conta}) não encontrada.` })
    }
    if (valor <= 0) {
        return res.status(400).json({ mensagem: `valor (${valor}) inválido.` })
    }
    contaExistente.saldo += Number(valor)
    const horario = registroDeData();
    const registroDeTransacao = {
        data: horario,
        numero_conta,
        valor
    }

    depositos.push(registroDeTransacao)
    return res.status(200).json()


}
const sacar = (req, res) => {

    const { numero_conta, valor, senha } = req.body
    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: "Todos os parâmetros devem ser informados." })
    }
    let contaExistente = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })
    if (!contaExistente) {
        return res.status(400).json({ mensagem: `conta de número (${numero_conta}) não encontrada.` })
    }

    if (contaExistente.senha !== senha) {
        return res.status(404).json({ mensagem: "senha incorreta." })
    }
    if (Number(valor) < 0) {
        return res.status(404).json({ mensagem: "valor a sacar não pode ser negativo." })
    }
    if (Number(valor) === 0) {
        return res.status(400).json({ mensagem: "valor a sacar não pode ser nulo." })
    }


    if (Number(valor) > contaExistente.saldo) {
        return res.status(404).json({ mensagem: `Saldo (${contaExistente.saldo}) insuficiente ` })
    }


    const horario = registroDeData();
    const registroDeTransacao = {
        data: horario,
        numero_conta,
        valor
    }
    saques.push(registroDeTransacao)
    contaExistente.saldo -= Number(valor);

    return res.status(200).json()
}

const transferencia = (req, res) => {

    const { numeroContaOrigem, numeroContaDestino, senha_origem, valor } = req.body

    if (!numeroContaOrigem || !numeroContaDestino || !senha_origem || !valor) {
        return res.status(404).json({ mensagem: "Todos os parâmetros devem ser informados." })
    }
    const origemExiste = contas.find((conta) => {
        return conta.numero === Number(numeroContaOrigem)
    })
    if (!origemExiste) { return res.status(400).json(`Não foi encontrada conta de origem com número (${numeroContaOrigem}).`) }

    const destinoExiste = contas.find((conta) => {
        return conta.numero === Number(numeroContaDestino)
    })
    if (!destinoExiste) { return res.status(400).json(`Não foi encontrada conta de destino com número (${numeroContaDestino}).`) }

    if (numeroContaDestino === numeroContaOrigem) {
        return res.status(404).json({ mensagem: "As contas de destino e de origem não podem ter o mesmo número." })
    }
    if (Number(valor) < 0) {
        return res.status(400).json({ mensagem: "valor a transferir não pode ser negativo." })
    }

    if (Number(valor) === 0) {
        return res.status(400).json({ mensagem: "valor a transferir não pode ser nulo." })
    }

    if (valor > origemExiste.saldo || origemExiste.saldo === 0) {
        return res.status(404).json({ mensagem: `Saldo (${origemExiste.saldo}) insuficiente para realizar a operação.` })
    }

    if (senha_origem !== origemExiste.senha) {
        return res.status(404).json({ mensagem: "Senha incorreta." })
    }

    origemExiste.saldo -= Number(valor)
    destinoExiste.saldo += Number(valor)
    const horario = registroDeData();
    const registroDeTransacao = {
        data: horario,
        numeroContaOrigem,
        numeroContaDestino,
        valor
    }
    transferencias.push(registroDeTransacao)
    return res.status(200).json()
}

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query
    if (!numero_conta || !senha) {
        return res.status(404).json({ mensagem: `Todos os parâmetros devem ser informados.` })
    }
    let contaExistente = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })
    if (!contaExistente) {
        return res.status(400).json({ mensagem: `Conta bancária não encontrada!` })
    }

    if (contaExistente.senha !== senha) {
        return res.status(404).json({ mensagem: "Senha incorreta." })
    }

    return res.status(201).json({ saldo: contaExistente.saldo })
}

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query
    if (!numero_conta || !senha) {
        return res.status(404).json({ mensagem: `Todos os parâmetros devem ser informados.` })
    }
    let contaExistente = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })
    if (!contaExistente) {
        return res.status(400).json({ mensagem: `Conta bancária não encontrada!` })
    }
    if (contaExistente.senha !== senha) {
        return res.status(404).json({ mensagem: "Senha incorreta." })
    }

    const registroDeExtrato = {
        depositos: depositos.filter((deposito) => {
            return deposito.numero_conta === numero_conta
        }),
        saques: saques.filter((saques) => {
            return saques.numero_conta === numero_conta
        }),

        transferenciasEnviadas: transferencias.filter((transferencia) => {
            return transferencia.numeroContaOrigem === numero_conta
        }),
        transferenciaRecebidas: transferencias.filter((transferencia) => {
            return transferencia.numeroContaDestino === numero_conta
        })

    }

    return res.status(201).json(registroDeExtrato)
}
module.exports = {
    depositar,
    sacar,
    transferencia,
    saldo,
    extrato

}