let bancodedados = require('../bancodedados')
let { banco, contas, saques, depositos, transferencias, numeroUnico } = bancodedados
let { nome, numero, agencia, senha } = banco


const validarSenha = (req, res, senha) => {

    if (!senha) {
        return res.status(401).json({ mensagem: "senha não informada" })
    }
    if (senha !== banco.senha) {
        return res.status(401).json({ mensagem: "senha incorreta" })
    }
}

const validarConta = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "Todos os parâmetros são obrigatórios" })
    }

    next()
}

const obterContas = (req, res) => {
    const { senha_banco } = req.query
    validarSenha(req, res, senha_banco)

    return res.status(200).json(contas)
}
const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
    const cpfExistente = contas.find((conta) => {
        return conta.cpf === cpf
    })
    const emailExistente = contas.find((conta) => {
        return conta.email === email
    })

    if (emailExistente && cpfExistente) {
        return res.status(409).json({ mensagem: "já existe uma conta cadastrada com este número de CPF e neste e-mail." })
    }

    if (emailExistente) {
        return res.status(409).json({ mensagem: "já existe uma conta cadastrada com esse e-mail." })
    }

    if (cpfExistente) {
        return res.status(409).json({ mensagem: "já existe uma conta cadastrada com esse número de CPF." })
    }


    const conta = {
        numero: numeroUnico++,
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha,
        saldo: 0
    }

    contas.push(conta)
    return res.status(200).json()
}

const atualizarConta = (req, res) => {
    const { numeroConta } = req.params
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    let contaExistente = contas.find((conta) => {
        return conta.numero === Number(numeroConta)
    })
    if (!contaExistente) {
        return res.status(400).json({ mensagem: `conta de número (${numeroConta}) não encontrada.` })
    }
    let emailExistente = contas.find((conta) => {
        return conta.email === email
    })
    if (emailExistente) {
        return res.status(400).json({ mensagem: `Já existe uma conta vinculada a este endereço e-mail.` })
    }
    let cpfExistente = contas.find((conta) => {
        return conta.cpf === cpf
    })
    if (cpfExistente) {
        return res.status(400).json({ mensagem: `Já existe uma conta vinculada a este número de CPF` })
    }


    const contaAtualizada = {
        numero: contaExistente.numero,
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha,
        saldo: contaExistente.saldo
    }

    contas.splice((numeroConta - 1), 1, contaAtualizada)


    res.status(200).json()
}

const deletarConta = (req, res) => {
    const { numeroConta } = req.params
    let contaExistente = contas.find((conta) => {
        return conta.numero === Number(numeroConta)
    })
    if (!contaExistente) {
        return res.status(400).json({ mensagem: `conta de número (${numeroConta}) não encontrada.` })
    }
    if (contaExistente.saldo !== 0) {
        return res.status(403).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" })
    }

    const posicaoDaConta = contas.findIndex((conta) => {
        return conta.numero === Number(numeroConta)
    })

    contas.splice(posicaoDaConta, 1)


    return res.status(200).json()
}

module.exports = {
    validarSenha,
    validarConta,
    obterContas,
    criarConta,
    atualizarConta,
    deletarConta,
}
