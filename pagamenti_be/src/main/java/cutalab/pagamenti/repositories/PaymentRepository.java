package cutalab.pagamenti.repositories;

import cutalab.pagamenti.models.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {
    
}