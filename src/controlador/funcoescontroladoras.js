const verificaDadosEnviados = (
    req,
    res,
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha
  ) => {
    if (!nome) {
      return res.status(400).json({ mensagem: "O nome é obrigatório" });
    }
    if (!cpf) {
      return res.status(400).json({ mensagem: "O cpf é obrigatório" });
    }
    if (!data_nascimento) {
      return res
        .status(400)
        .json({ mensagem: "A data de nascimento é obrigatória" });
    }
    if (!telefone) {
      return res.status(400).json({ mensagem: "O telefone é obrigatório" });
    }
    if (!email) {
      return res.status(400).json({ mensagem: "O email é obrigatório" });
    }
    if (!senha) {
      return res.status(400).json({ mensagem: "A senha é obrigatória" });
    }
    if (!Number(cpf)) {
      return res
        .status(400)
        .json({ mensagem: "O CPF deve conter apenas números" });
    }
  };
  const verificadadosdosaque = ()=>{
    
  }
  module.exports = verificaDadosEnviados


