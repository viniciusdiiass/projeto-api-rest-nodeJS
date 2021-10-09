const conexao = require('../infraestrutura/conexao')
const moment = require('moment')
const axios = require('axios')

class Atendimento{
    adiciona(atendimento, res){
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
        const data = moment(atendimento.data,'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
       
        const dataValida = moment(data).isSameOrAfter(dataCriacao)
        const clienteValido = atendimento.cliente.length >= 5

        const validacoes = [
            {
            nome: 'data',
            valido: dataValida,
            mensagem: 'Data deve ser maior que data atual'
        },
            {
            nome: 'cliente',
            valido: clienteValido,
            mensagem: 'Cliente deve ter no minimo 5 caracteres.'
        }
        ]

        const erros = validacoes.filter(campo => !campo.valido)
        const existemErros = erros.length

        if (existemErros) {
            res.status(400).json(erros)
        } else {
        const atendimentoDatado = {...atendimento, dataCriacao, data}

        const sql = 'INSERT INTO Atendimentos set?'

        conexao.query(sql, atendimentoDatado, (erro, resultados) => {
            if(erro){
                res.status(400).json(erro)
            } else {
                res.status(201).json(atendimento)           
             }
        })
    }
}

lista(res){
    const sql = 'SELECT * FROM atendimentos'

    conexao.query(sql, (erro, resultados) => {
        if (erro) {
            res.status(400)
        } else {
            res.status(200).json(resultados)
        }
    })
}

buscaPorID(id, res){
    const sql = `SELECT * FROM atendimentos WHERE id=${id}`

    conexao.query(sql, async (erro,resultados)=>{
        const atendimento = resultados[0]
        const cpf = atendimento.cliente
        if (erro) {
            res.status(400).json(erro)
        } else {
            const { data } = await axios.get(`http://localhost:8082/$(cpf)`)

            atendimento.cliente = data

            res.status(200).json(atendimento)
        }
    })
}

altera(id, valores, res) {
    if (valores.data) {
        valores.data = moment(valores.data,'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        }

        const sql = 'UPDATE atendimentos SET ? WHERE id=?'

        conexao.query(sql, [valores, id], (erro, resultados) => { 
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultados)
        }
    })
}

delete(id, res){
    const sql = 'DELETE FROM atendimentos WHERE id=?'
    conexao.query(sql, id, (erro, resultados)=>{
        if (erro) {
            res.status(400).json(erro)
        } else {
            res.status(200).json(resultados)
        }
    })
}

}

module.exports = new Atendimento