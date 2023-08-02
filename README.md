<h1 align="center">Bot Watson Assistant + Automações IBM Cloud</h1>

<p>Backup do código de operação. A estrutura é voltada para a captação de leads para planos de uma ferramenta de streaming.</p>

<p>O chatbot informa as opções de planos disponíveis para a contratação e, na escolha de algum pelo cliente, solicita e valida dados pessoais para criar o registro de uma proposta, que é enviada para um e-mail específico.</p>

<p>A estrutura é composta por um fluxo de diálogo e uma lista de entidades e intenções desenvolvidas no IBM Watson Assistant, em interação com uma cloud function criada no IBM Cloud, usando Node.js.</p>


# Índice:

* [Status do projeto](#status-do-projeto)
* [Funcionalidades](#Funcionalidades)
* [Tecnologias](#Tecnologias)
* [Endpoints](#Endpoints)
* [Configuração do ambiente de teste](#configuração-do-ambiente-de-teste)
* [Referências](#Arquitetura)


# Status do projeto

:page_with_curl: Concluído - Em documentação :page_with_curl:

# Funcionalidades

* Boas vindas
* Mostrar planos
* Validação de CPF
* Validação de CEP
* Envio de e-mail com proposta


# Tecnologias

* [WatsonAssistant](https://www.ibm.com/br-pt/watson)
* [IBMCloud](https://www.ibm.com/br-pt/cloud/free)


# Endpoints

<table>
  <thead>
    <th>Endpoint</th>
    <th>Método</th>
    <th>Conteúdo</th>
    <th>Tipo</th>
    <th>Finalidade</th>
  </thead>
  <body>
    <tr>
      <td>/</td>
      <td>Get</td>
      <td>{ "action" = type: String, value:"plans" }</td>
      <td>Corpo (JSON)</td>
      <td>Listagem de planos disponíveis.</td>
    </tr>
    <tr>
      <td>/</td>
      <td>Get</td>
      <td>{ "action" = type:String, value:"validateDoc"; "doc" = type:String }</td>
      <td>Corpo (JSON)</td>
      <td>Validação de formato de documentos CPF e CNPJ.</td>
    </tr>
    <tr>
      <td>/</td>
      <td>Get</td>
      <td>{ "action" = type:String, value:"validateZC"; "zipCode" = type:String }</td>
      <td>Corpo (JSON)</td>
      <td>Validação e consulta de dados do IBGE para CEP.</td>
    </tr>
    <tr>
      <td>/</td>
      <td>Get</td>
      <td>{ "action" = type:String, value:"order"; "payload" = type:JSON, value:{ "city" = type:String, "cpf" = type:String, "name" = type:String, "neighborhood" = type:String, "plan_id" = type:Integer, "plan_name" = type:String, "state" = type:String, "zip_code" = type:String }}
      </td>
      <td>Corpo (JSON)</td>
      <td>Criação de texto com a proposta e envio por e-mail.</td>
    </tr>
  </body>
</table>


# Configuração do ambiente de teste

## Pré-requisitos

- Ter uma conta na **IBM**;
- Ter um cliente SMTP configurado


## Teste em homologação

1. Baixe o arquivo "MVP-Bot.json" deste repositório. 
2. Criando o bot: Abra o gerenciador do [Watson Assistant](https://us-east.assistant.watson.cloud.ibm.com/), vá em "Skills" e clique em "Create skill". Selecione a opção "Dialog Skill" e clique em "Next". Vá na aba "Upload skill", carregue o arquivo json baixado e clique em "Upload".
3. Criando uma função no IBM cloud: Vá em [Actions](https://cloud.ibm.com/functions/actions) e clique em "Criar. Dê um nome para a ação e selecione a opção "Node.js" como tempo de execução. Copie o código de "action.js", da pasta "cloud-functions", no editor e clique em salvar.
4. Altere os parâmetros de direcionamento de e-mail da função "sendEmail" para seus endereços e credenciais. Para mais informações, consulte este [artigo](https://www.bacancytechnology.com/blog/send-email-using-nodemailer).
5. Conectando o bot e a action: Na ação criada, vá na aba "terminais" e habilite a opção "Ativar como ação da web". Após isso, copie o valor da URL de "Método de HTTP".
6. Volte ao Watson Assistant, abra skill do bot e clique "Options" -> "Webhooks". Cole o valor da URl copiado de "Método de HTTP" da ação criada no espaço destinado a URL em Webhooks. Inclua em "Add header" um cabeçalho com o nome "Content-Type" com o valor "application/json".
7. Teste o Chatbot no botão "Try it", localizado no canto superior direito da tela.


# Referências

Como escrever um README incrível no seu Github:
https://www.alura.com.br/artigos/escrever-bom-readme

Emoji-cheat-sheet:
https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md

Introdução ao Watson Assistant:
https://cloud.ibm.com/docs/assistant?topic=assistant-getting-started&locale=pt-BR

NodeMailer Example: How to Send Email Using NodeMailer With Gmail & Mailtrap?:
https://www.bacancytechnology.com/blog/send-email-using-nodemailer