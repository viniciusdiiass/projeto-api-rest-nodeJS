const Atendimento = require('../models/atendimentos')
module.exports = app => {

  /* Envia dados para o cliente   */
    app.get('/atendimentos', function (req, res) {
        res.send('você está na rota de atendimentos')})

    app.post('/atendimentos', (req, res) => {
      const atendimento = req.body

      Atendimento.adiciona(atendimento)
      res.send('Post Atendimento')
  })
}

