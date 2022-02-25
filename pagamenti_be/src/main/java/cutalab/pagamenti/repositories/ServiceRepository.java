package cutalab.pagamenti.repositories;

import cutalab.pagamenti.models.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<ServiceEntity, Integer> {
    
}