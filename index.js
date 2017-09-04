var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})



// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === '912193bd-3ccc-46c7-a416-e12c32403874') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})



app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'Texto') {
                sendGenericMessage(sender)
                continue
            }
        }



        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'Button') {
                sendButtonMessage(sender)
                continue
            }
            sendTextMessage(sender, "Eu não entendi o que você quis dizer com: " + text.substring(0, 200))
        }

        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})

let token = "EAABqgKLBCIMBADt70pPRVbZCT8JgZBBzgnRVqWCcAsYU7Guht95M7M4VZAJrZBuDrNhaZCzGcQpTx0NrrFL0CZBjJxtYeruegCS7Bjrfe10Xk9xXaTRFFjhJkIZCrO0HeQFCZCkwy8ZC6SwKQPLsJeDIDNpkACTb0cfF0E8Eet7iedCReWeUGxdQ8"


// Templates de Resposta
function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}



function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


function sendButtonMessage(sender) {
    messageData = {
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"button",
            "text":"What do you want to do next?",
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.messenger.com",
                "title":"Visit Messenger"
              },
              {
                "type":"web_url",
                "url":"https://www.messenger.com",
                "title":"Visit Messenger"
              }
            ]
          }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}



// Criar uma persona de um instrutor
// Ter um Hub de Soluções de Aprendizagem (HSA) ou mais conhecido como Material de Apoio que podemos chamar de "Continue aprendendo", "Recursos de Extra Classe (REC)"
// onde teremos recursos de aprendizagens como Jogos, Chatbots, Aplicativos, Infográficos e etc.
// 

//E se pudessemos acompanhar os condutores de primeira habilitação mesmo após o curso?
//Utilizando o Facebook Messenger, conseguimos enviar mensagens periódicas de lembrete e de boa conduta
//no trânsito. Por exemplo, procurar saber qual foi a ultima vêz que trocou o óleo, ou que olho a água
//definir o perfil do usuário perguntando qual foi a ultima vez que dirigiu, ou que fez uma revisão do carro
//podendo expandir as mensagens para retornar publicidade de empresas interessadas, autopeças, autoeletrico 
//e serviços uteis para quem o recebe com base no perfil do usuário
//as mensagens também podem conter texto de boas práticas e boa conduta no trânsito
//lembretes de "Como você está dirigindo hoje?" pedindo para o mesmo atribuir uma nota para sua própria direção
//teste