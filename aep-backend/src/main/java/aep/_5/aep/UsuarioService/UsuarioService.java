package aep._5.aep.UsuarioService;

import aep._5.aep.UsuarioModel.UsuarioModel;
import aep._5.aep.UsuarioRepository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<UsuarioModel> ListarUsuarios() {
        return usuarioRepository.findAll();
    }

    public UsuarioModel criarUsuario(UsuarioModel usuario){
        return usuarioRepository.save(usuario);
    }

    public void deletarUsuario(Long id){
        usuarioRepository.deleteById(id);
    }



}
