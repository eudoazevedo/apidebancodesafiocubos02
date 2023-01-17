
const bancodedados = require("../bancodedados");
 
const {v4:uuidv4} = require("uuid");
const verificaDadosEnviados = require("./funcoescontroladoras");

const dataFormatada = (date) => {
    return `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  };

const criarConta = (req, res) => {
    const{contas} = bancodedados
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    try {
         let id = uuidv4()
         let conta = uuidv4()
         


verificaDadosEnviados(req,res,nome, cpf, data_nascimento, telefone, email, senha) 
        const encontraConta = contas.find((conta) => {
            return conta.usuario.cpf === cpf || conta.usuario.email === email
        })
      
        if (encontraConta) {
            return res.status(401).json({ mensagem: "ja existe um conta com cpf informado ou email" })
        }

    let  cadastrarUsuario = {numero:conta,saldo:0,usuario:{id,...req.body}}
     contas.push(cadastrarUsuario)
     return res.status(200).json({})
        
}
    catch(error) { res.status(500).json(error.mensagem)}
}
  
const listaConta = (req, res) => {
    const {contas} = bancodedados
    try{ res.status(200).json(contas) } 
    catch(error) { res.status(500).json(error.mensagem)}    
}
const atualizarConta = (req, res) => { 
    const {numeroConta} = req.params

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
try{ 
   verificaDadosEnviados(req,res,nome, cpf, data_nascimento, telefone, email, senha)

 const {contas} = bancodedados
const encontraConta = contas.find((conta) => {
    return conta.numero === numeroConta
})

if (!encontraConta) {
    return res.status(404).json()
}
encontraConta.usuario = {...req.body}
const verificaContaExistente = contas.find((conta,index )=>{
    if (contas[index].numero !== encontraConta.numero){
        if(conta.usuario.cpf === encontraConta.usuario.cpf ||conta.usuario.email === encontraConta.usuario.email){
            return conta
        }
    }

})
    if(verificaContaExistente){
    return res.status(401).json({mensagem:"ja existe uma conta com email  ou cpf informado"})
}
     for(let [index,conta ]of contas.entries()){
        if(conta.numero === numeroConta)
        contas[index].usuario = encontraConta.usuario
     }
     return res.status(204).json()
}
catch(error) { res.status(500).json(error.mensagem)}  
}


const depositarConta = (req, res) => { 
    const {contas} = bancodedados
    const { numero_conta, valor} = req.body
    try{
        if(!numero_conta && !valor)
        return res.status(401).json({mensagem: "numero da conta não econcotrado ou o valor"})
     const encontraConta = contas.find((conta)=>{
        return conta.numero === numero_conta
})
     if(!encontraConta){
        return res.status(404).json({mensagem:"conta não econtrada"})
     }
     if(valor <= 0){
        return res.status(400).json({mensagem:"so e permitido valores maiores que  0"})
     }
    encontraConta.saldo += valor

    for(let[index,conta]of contas.entries()){
        if(conta.numero === numero_conta){
            contas[index] = encontraConta
        }
    }
    const data = dataFormatada(new Date())
    const deposito = {
        data,
        numero_conta,
         valor}
    bancodedados.depositos.push(deposito)
    
    return res.status(204).json()

    }  catch(error) { res.status(500).json(error.mensagem)}  
    }


const sacarConta = (req, res) => {
    const {contas} = bancodedados
    const { numero_conta, valor, senha} = req.body
    try{
        
        if(!numero_conta && !valor)
        return res.status(401).json({mensagem: "numero da conta não econcotrado ou o valor"})
     const encontraConta = contas.find((conta)=>{
        return conta.numero === numero_conta
})
     if(encontraConta.usuario.senha !== senha){
        return res.status(401).json({mensagem:"senha ivalida"})

     }
     if(!encontraConta){
        return res.status(404).json({mensagem:"conta não econtrada"})
     }
     if(valor <= 0){
        return res.status(400).json({mensagem:"so e permitido valores maiores que  0"})
     }
     if(encontraConta.saldo < valor){
        return res.status(403).json({mensagem:"saldo insuficiente"})
     }
    encontraConta.saldo -= valor

    for(let[index,conta]of contas.entries()){
        if(conta.numero === numero_conta){
            contas[index] = encontraConta
        }
    }
    const data = dataFormatada(new Date())
    const saque = {data,numero_conta, valor}
    bancodedados.saques.push(saque)
    
    return res.status(204).json()
    }
    catch(error) { res.status(500).json(error.mensagem)}  
    }

 
const traferirValor = (req, res) => { 
    const {contas} = bancodedados
    const {numero_conta_origem, numero_conta_destino, senha, valor} = req.body
    
    try{
     if (!numero_conta_origem && !numero_conta_destino){
        return res.status(401).json({mensagem:" numero da conta destino e origem são obrigatorios "})
        
     }

       const contaOrigemLocalizada = contas.find((conta)=>{
        return conta.numero === numero_conta_origem
     })
     if(!contaOrigemLocalizada){
        return res.status(404).json({mensagem:"conta origem não encontrada"})
    }
    const contaDestinoLocalizado = contas.find((conta)=>{
        return conta.numero === numero_conta_destino
    })
    if(!contaDestinoLocalizado){
        return res.status(404).json({mensagem:"conta destino não localizada"})
    }
    if(!senha){
        return  res.status(404).json({mensagem:"senha obrigatoria"})
    }

    if(senha !== contaOrigemLocalizada.usuario.senha ){
        return res.status(404).json({mensagem:"senha invalida"})
    }

    if(valor > contaOrigemLocalizada.saldo){
        return res.status(404).json({mensagem:"saldo insuficente"})
    }
     contaOrigemLocalizada.saldo -= valor
     contaDestinoLocalizado.saldo += valor

     const data = dataFormatada (new Date())
     const trasferencia = {
        data,
        numero_conta_origem,
        numero_conta_destino,
        valor
     }
     bancodedados.transferencias.push(trasferencia)
        return res.status(204).json()
     
}
    catch(error) { res.status(500).json(error.mensagem)}  
    }
const consultarSaldo = (req, res) => { 
    const {contas} = bancodedados
    const {numero_conta, senha} = req.query
    try{

        if(!numero_conta && !senha){
            return res.status(404).json({mensagme:"são obrigatorios senha e numero da conta"})
        }
        const contaLocalizada = contas.find((conta)=>{
            return conta.numero === numero_conta
         })
          if(!contaLocalizada){
            return res.status(404).json({mensagem:"conta não encostrada"})
          }
          if(senha !== contaLocalizada.usuario.senha){
            return res.status(400).json({mensagem:"senha invalida"})
          }
          return res.status(201).json({saldo:contaLocalizada.saldo})

    }
    catch(error) { res.status(500).json(error.mensagem)}  
    }
const excluirConta = (req, res) => { 
    const {contas} = bancodedados
    const {numeroConta} = req.params
    try{
       
         const encontraConta = contas.find( conta =>{
            return conta.numero === numeroConta
         })
         
         if(!encontraConta){
            return res.status(404).json()
         }
          if(encontraConta.saldo !== 0){
            return res.status(400).json({mensagem:" conta so pode ser removida se o saldo for 0"})
          }


        const atualizarDados = contas.filter(dadoConta =>{
          
            return dadoConta.numero !== numeroConta
        
        })
        
        bancodedados.contas = atualizarDados
          return res.status(204).json()
          
    }
    catch(error) { res.status(500).json(error.mensagem)}  
    }
//     Verificar se o numero da conta e a senha foram informadas (passado como query params na url)
// !
// Verificar se a senha informada é uma senha válida
// Retornar a lista de transferências, depósitos e saques da conta em questão.
const emitirExtrato = (req, res) => { 
    const {contas} = bancodedados
    const {numero_conta, senha} = req.query
    try{
        if(!numero_conta && senha){
            return res.status(404).json({mensagem:" numero da conta e senha são obrigatorios"})
        }
        const encontraConta = contas.find( conta =>{
            return conta.numero === numero_conta
         })
         
         if(!encontraConta){
            return res.status(404).json({mensagem:"conta não encontrada"})
         }
         if(senha !== encontraConta.usuario.senha){
            return res.status(404).json({mensagem:'senha invalida'})
         }
         const depositos = bancodedados.depositos.filter(deposito =>{
            return deposito.numero_conta === numero_conta
        
         })
         const saques = bancodedados.saques.filter(saque=>{
            return saque.numero_conta === numero_conta
         })
          const transferenciaRecebidas = []
          const transferenciaEnviadas  = []
           
         for(const transferencia of bancodedados.transferencias){
            if(transferencia.numero_conta_origem === numero_conta ){ 
            transferenciaEnviadas.push({data: transferencia.data,
                numero_conta_origem: transferencia.numero_conta_origem,
                numero_conta_destino: transferencia.numero_conta_destino,
                valor: transferencia.valor,})
}

         if(transferencia.numero_conta_destino === numero_conta){
            transferenciaRecebidas.push({data: transferencia.data,
                numero_conta_origem: transferencia.numero_conta_origem,
                numero_conta_destino: transferencia.numero_conta_destino,
                valor: transferencia.valor,})
 }
}
        
            return res.status(200).json({depositos, saques,transferenciaEnviadas,transferenciaRecebidas})
    }
    
    catch(error) { res.status(500).json(error.mensagem)}  
    }

module.exports = {
    criarConta, listaConta, atualizarConta, depositarConta, sacarConta, traferirValor,
    consultarSaldo, excluirConta, emitirExtrato
}