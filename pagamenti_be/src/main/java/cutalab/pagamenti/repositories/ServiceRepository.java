package cutalab.pagamenti.repositories;

import cutalab.pagamenti.models.ServiceEntity;
import cutalab.pagamenti.models.ServiceListReduced;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ServiceRepository extends JpaRepository<ServiceEntity, Integer> {
    
    @Query(value="select s.id, s.name, s.fiscal_code, s.piva, s.description, s.address from services s", nativeQuery=true)
    List<ServiceListReduced> selectReducedList();
    
}