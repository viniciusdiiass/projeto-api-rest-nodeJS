
module.exports = app => {

  /* Envia dados para o cliente   */
    app.get('/atendimentos', function (req, res) {
        res.send('você está na rota de atendimentos')})

    app.post('/atendimentos', (req, res) => {
      console.log(req.body)
      res.send('Você está na rota de atendimentos e está realizando um post')
  })
}

