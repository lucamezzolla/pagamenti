package cutalab.pagamenti.repositories;

import cutalab.pagamenti.models.PaymentEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {
    List<PaymentEntity> findByServiceIdOrderByPaymentDateTimeDesc(Integer id);
}