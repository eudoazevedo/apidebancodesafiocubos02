const  validaSenha = (req, res, next) => {
 const { senha_banco } = req.query;

 try{
    if (!senha_banco){
        return res.status(401).json({mensagem:"nenhuma senha informada!"})}
    
     if (senha_banco !=='Cubos123Bank'){
        return res.status(401).json({mensagme:"A senha do banco informada é inválida!"})
    }
    next();
    } catch(erro){
        return res.status(500).json(erro.mensagem)
    }


}
module.exports = validaSenha;

