package cutalab.pagamenti.repositories;

import java.util.List;
import cutalab.pagamenti.models.ClientEntity;
import cutalab.pagamenti.models.ClientListReduced;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ClientRepository extends JpaRepository<ClientEntity, Integer> {
    
    @Query(value="select c.id, c.name, c.fiscal_code, c.piva, c.state from clients c", nativeQuery=true)
    List<ClientListReduced> selectReducedList();
    
}