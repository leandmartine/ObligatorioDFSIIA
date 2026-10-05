import {
    obtenerUsuariosService,
    crearUsuarioService,
    obtenerUsuarioService,
    obtenerPublicacionesDelUsuarioService,
    actualizarUsuarioService,
    eliminarUsuarioService,
} from "../services/usuarios.services.js";

export const obtenerUsuarios = async (req, res) => {
    const busqueda = req.query;
    const usuarios = await obtenerUsuariosService(busqueda);
    res.status(200).json({ usuarios });
}

export const obtenerUsuarioPorId = async (req, res) => {
    const { id } = req.params;
    const usuario = await obtenerUsuarioService(id);
    res.status(200).json({ usuario });
}

export const obtenerPublicacionesDelUsuario = async (req, res) => {
    const publicaciones = await obtenerPublicacionesDelUsuarioService(req.user?.email);
    res.status(200).json({ publicaciones });
}

export const crearUsuario = async (req, res) => {
    const usuarioData = req.validatedBody;
    const nuevoUsuario = await crearUsuarioService(usuarioData);
    res.status(201).json({ nuevoUsuario });
}

export const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const usuarioData = req.validatedBody;
    const usuarioActualizado = await actualizarUsuarioService(id, usuarioData, req.user);
    res.status(200).json({ usuarioActualizado });
} 

export const altaUsuarioPremium = async (req, res) => {
    const { id } = req.params;
    const usuarioData = { esPremium: true };
    const usuarioActualizado = await actualizarUsuarioService(id, usuarioData, req.user);
    res.status(200).json({ usuarioActualizado });
} 

export const eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    const usuarioEliminado = await eliminarUsuarioService(id, req.user);
    res.status(200).json({ usuarioEliminado });
}
