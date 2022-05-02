package cutalab.pagamenti.repositories;

import cutalab.pagamenti.models.PaymentEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {
    
    @Query(value="select * from payments where service_id = ? and payment_date between ? and ? order by payment_date desc", nativeQuery=true)
    List<PaymentEntity> list(Integer id, String from, String to);
    
}