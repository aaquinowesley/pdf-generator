const express = require('express')
const ejs = require('ejs')
const path = require('path')
const puppeteer = require('puppeteer')
const app = express()

const pedidos = [
    {
        nome: "Joyce",
        pediu: 'pão de Queijo',
        horario: "18h00",
        valor: 2.50,
    },
    {
        nome: "Carol",
        pediu: 'X-salada',
        horario: "12h00",
        valor: 10.00,
    },
    {
        nome: "Daniel",
        pediu: 'café frio',
        horario: "10h00",
        valor: 1.50,
    },
];

app.get('/pdf', async(request, response) => {

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    
    await page.goto('http://localhost:3000/', {
        waitUntil: 'networkidle0'
    })
    
    const pdf = await page.pdf({
        printBackground: true,
        format: 'A4',
    })

    await browser.close()

    response.contentType("application/pdf")

    return response.send(pdf)

})

app.get('/', (request, response) => {

    const filePath = path.join(__dirname, "print.ejs")
    ejs.renderFile(filePath, { pedidos }, (err, html) => {
        if(err) {
            return response.send('Erro na leitura do arquivo')
        }
    
        // enviar para o navegador
        return response.send(html)
    })
   
})

app.listen(3000, () => console.log('Servidor Rodando'))