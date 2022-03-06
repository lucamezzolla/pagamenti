package cutalab.pagamenti.repositories;

import cutalab.pagamenti.models.PaymentAttachmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentAttachmentRepository extends JpaRepository<PaymentAttachmentEntity, Long> {
    PaymentAttachmentEntity getByPaymentId(Long id);
}