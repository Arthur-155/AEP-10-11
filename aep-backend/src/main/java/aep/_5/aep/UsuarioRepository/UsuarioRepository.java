package aep._5.aep.UsuarioRepository;

import aep._5.aep.UsuarioModel.UsuarioModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<UsuarioModel, Long> {
}
