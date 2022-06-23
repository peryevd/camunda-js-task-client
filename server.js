const axios = require('axios')
const { Client, logger } = require('camunda-external-task-client-js')
const config = { baseUrl: 'http://localhost:8080/engine-rest/', use: logger }
const { Variables } = require('camunda-external-task-client-js')

const client = new Client(config)
client.subscribe('GetCatFact', async function ({ task, taskService }) {
  const processVariables = new Variables()

  axios.get('https://catfact.ninja/fact').then(response => {
    processVariables.set('catFact', response.data.fact)
    console.log(response.data.fact)
    taskService.complete(task, processVariables)
  })
})

const client2 = new Client(config)
client2.subscribe('SendTG', async function ({ task, taskService }) {
  console.log('start sent')

  const catFact = task.variables.get('catFact')
  console.log('==============', catFact)

  axios.get(`https://api.telegram.org/yourbot=${catFact}`).then(response => {
    //   processVariables.set('docFact', response.data.fact)
    console.log('sent')
    taskService.complete(task)
  })
})
