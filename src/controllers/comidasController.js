import * as comidasModel from './../models/comidasModels.js';

export const listAll = async (req, res) => {
    try {
        const comidas = await comidasModel.findAll();

        if (!comidas || comidas.length === 0) {
            res.status(404).json({
                total: comidas.length,
                mensagem: 'Não há comidas na lista',
                comidas
            })
        }

        res.status(200).json({
            total: comidas.length,
            mensagem: 'Lista de comidas',
            comidas
        })

    } catch (error) {
        res.status(500).json({
            erro: 'Erro interno de servidor',
            detalhes: error.message,
            status: 500
        })
    }
}

export const listOne = async (req, res) => {
    try {
        const id = req.params.id;
        const comida = await comidasModel.findOne(id);

        if (!comida) {
            return res.status(404).json({
                erro: 'Comida não encontrado!',
                mensagem: 'Verifique se o id da comida existe',
                id: id
            })
        }

        res.status(200).json({
            mensagem: 'Comida encontrada',
            comida
        })

    } catch (error) {
        res.status(500).json({
            erro: 'Erro ao buscar comida por id',
            detalhes: error.message
        })
    }
}

export const create = async (req, res) => {
    try {
        const { nome, tipo, preco, descricao } = req.body;
        if(!nome || !tipo || !preco || !descricao) {
            return res.status(400).json({
                error: "Todos os campos devem ser preenchidos: nome, tipo, preço, descrição"
            });
        }

        const dados = { nome, tipo, preco, descricao };

         const camposObrigatorios = ["nome", "tipo", "preco", "descricao"];

    const faltando = camposObrigatorios.filter((campo) => !dados[campo]);

    if (faltando.length > 0) {
      return res.status(400).json({
        erro: `Os seguintes campos são obrigatórios: ${faltando.join(", ")}.`,
      });
    }

    const novaComida = await comidasModel.create(req.body);

    res.status(201).json({
        mensagem: "Comida nova no restaurante!",
        comida: novaComida
    });
    } catch (error) {
            res.status(500).json({
      erro: "Erro ao criar nova comida",
      detalhes: error.message,
    });
    }
};

export const deletar = async (req, res) => { 
    try {
        const id = parseInt(req.params.id);

        const comidaExiste = await comidasModel.findOne(id);

        if (!comidaExiste) {
            return res.status(404).json({
                erro: 'Bruxo não encontrado com esse id',
                id: id
            })
        }

        await comidasModel.deleteComida(id)

         res.status(200).json({
            mensagem: 'Comida removido com sucesso',
            comidaRemovida: comidaExiste
        })

    } catch (error) {
        res.status(500).json({
            erro: 'Erro ao apagar comida!',
            detalhes: error.message
        })
    }
}

export const atualizar = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const dados = req.body;

        const comidaExiste = await comidasModel.findOne(id);

        if (!comidaExiste) {
            return res.status(404).json({
                erro: 'Comida não encontrada com esse id',
                id: id
            })
        }

        
        const comidaAtualizada = await comidasModel.atualizar(id, dados);

        res.status(200).json({
            mensagem: 'Comida atualizada com sucesso',
            comida: comidaAtualizada
        })

    } catch (error) {
        res.status(500).json({
            erro: 'Erro ao atualizar comida',
            detalhes: error.message
        })
    }
};