package cutalab.pagamenti.repositories;

import cutalab.pagamenti.models.ServiceEntity;
import cutalab.pagamenti.models.ServiceNameList;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import cutalab.pagamenti.models.ServiceReducedList;

public interface ServiceRepository extends JpaRepository<ServiceEntity, Integer> {
    
    @Query(value="select s.id, s.name, s.fiscal_code, s.piva, s.description, s.address from services s", nativeQuery=true)
    List<ServiceReducedList> selectReducedList();
    
    @Query(value="select s.id, s.name from services s", nativeQuery=true)
    List<ServiceNameList> selectNameList();
    
}