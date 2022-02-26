package cutalab.pagamenti.repositories;

import cutalab.pagamenti.models.ClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<ClientEntity, Integer> {
    
}