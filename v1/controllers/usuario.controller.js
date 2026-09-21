import {obtenerUsuariosService, crearUsuarioService, obtenerUsuarioService, 
    actualizarUsuarioService, eliminarUsuarioService} from "../services/usuarios.services.js";

export const obtenerUsuarios = async (req, res) => {
    const busqueda = req.query//{activo:true
    const usuarios = await obtenerUsuariosService(busqueda);
    res.status(200).json({ usuarios });
}

export const obtenerUsuarioPorId = async (req, res) => {
    const { id } = req.params;
    const usuario = await obtenerUsuarioService(id);
    res.status(200).json({ usuario });
}

export const crearUsuario = async (req, res) => {
    const usuarioData = req.validatedBody;
    const nuevoUsuario = await crearUsuarioService(usuarioData);
    res.status(201).json({ nuevoUsuario });
}

export const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const usuarioData = req.validatedBody;
    const usuarioActualizado = await actualizarUsuarioService(id, usuarioData);
    res.status(200).json({ usuarioActualizado });
} 

export const eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    const usuarioEliminado = await eliminarUsuarioService(id);
    res.status(200).json({ usuarioEliminado });
}
