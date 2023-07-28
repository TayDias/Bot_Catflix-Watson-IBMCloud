function main({action, doc, zipCode, payload}) {
    
	if (action == "plans") {
	    let planList = getPlans()
	    
	    return { 
	        status: "Success",
    	    plans: planList
    	}
    	
	}
	
	else if (action == "validateDoc") {
	    
	    if(doc == null) {
	        return { status: "Failed", message: "Valor não informado para CPF do cliente" }
	    }
	    
	    return { status: "Success", validation: validateDocument(doc) }
    	
	}
	
	else if (action == "validateZC") {
	    
	    if(zipCode == null) {
	        return { status: "Failed", message: "Valor não informado para CEP do cliente" }
	    }
	    
	    return validateZipCode(zipCode)
    	
	}
	
	else if (action == "order") {
	    
	    if (payload == null) {
	        return { status: "Failed", message: "Request sem o parâmetro payload" }
	    }
	    
	    
	    return sendEmail(payload)
	    
	}
	
	
	return { status: "Failed", message: "Valor inválido para parâmetro action" }
	
}


// Lista de planos
function getPlans() {
    return [
        {
            "id": 1,
            "name": "Básico",
    	    "description": "",
    	    "price": "16"
    	},
    	{
    	    "id": 2,
    	    "name": "Padrão",
    	    "description": "",
    	    "price": "29"
    	        
    	},
    	{
    	    "id": 3,
    	    "name": "Premium",
    	    "description": "",
    	    "price": "45"
    	        
    	}
    ]
    
}

// Validar CPF
function validateDocument(text) {
    let strCPF = text

    if (strCPF.length !== 11 || !Array.from(strCPF).filter(e => e !== strCPF[0]).length) 
      return false

    let Soma = 0
    let Resto

    if (strCPF == "00000000000")
	    return false
        
    for (i=1; i<=9; i++)
	    Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i) 
        Resto = (Soma * 10) % 11

    if ((Resto == 10) || (Resto == 11)) 
	    Resto = 0

    if (Resto != parseInt(strCPF.substring(9, 10)) )
	    return false

	Soma = 0

    for (i = 1; i <= 10; i++)
       Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i)
    
    Resto = (Soma * 10) % 11

    if ((Resto == 10) || (Resto == 11)) 
	    Resto = 0

    if (Resto != parseInt(strCPF.substring(10, 11) ) )
        return false
        
    return true
}

// Validar CEP
async function validateZipCode(cep) {
    const axios = require('axios')
    
    let requestError = false
    
    const resp = await axios(`http://viacep.com.br/ws/${cep}/json/`).catch((error) => {
        requestError = true
    })
    
    if (requestError) {
        return { status: "Failed", message: "CEP não localizado" }
    }
    
    return {
        status: "Success",
        ibge: resp.data.ibge,
        cep: resp.data.cep,
        logradouro: resp.data.logradouro,
        bairro: resp.data.bairro,
        localidade: resp.data.localidade,
        uf: resp.data.uf
    }
    
}

// Enviar e-mail para a proposta
function sendEmail(payload) {
    const mailer = require('nodemailer')

    // payload = nome, cpf, zip_code, city, state, neighborhood, plan_id, plan_name
    
    const order = payload
    const planList = getPlans()
    const plan_name = planList[order.plan_id-1].name
    
    let requestError = false
    
    let subject = "Pedido de plano" + plan_name + " - " + order.name
    let text = "O cliente " + order.name + " (CPF: " + order.cpf + ") solicitou a contratação do plano " + plan_name + "."
    text = text + " Local de cobrança no endereço " + order.neighborhood + ", " + order.city + ", " + order.state + " - CEP " + order.zip_code + "."
    
    // Check the credentials in "Email Testing" -> "Inboxes" -> "SMTP Settings" -> "Show Credentials"
    let transporter = mailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '************',
        pass: '************'
      }
    })
    
    let mailOptions = {
      from: '********67@gmail.com',
      to: '********67@gmail.com',
      subject: subject,
      text: text
    }
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        requestError = true
      }
    })
    
    if (requestError) {
        return { status: "Failed", message: "Falha no envio do e-mail com o pedido." }
    }
        
    return { status: "Success", message: "E-mail com o pedido enviado." }
    
}
