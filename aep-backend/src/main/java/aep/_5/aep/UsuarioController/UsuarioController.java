package aep._5.aep.UsuarioController;

import aep._5.aep.UsuarioModel.UsuarioModel;
import aep._5.aep.UsuarioService.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    @GetMapping
    public List<UsuarioModel>listarUsuarios(){
        return service.ListarUsuarios();
    }

    @PostMapping
    public UsuarioModel criarPessoa(@RequestBody UsuarioModel usuario){
        return service.criarUsuario(usuario);
    }

    @DeleteMapping("/{id}")
    public void deletarPessoa(@PathVariable Long id){
        service.deletarUsuario(id);
    }
}
