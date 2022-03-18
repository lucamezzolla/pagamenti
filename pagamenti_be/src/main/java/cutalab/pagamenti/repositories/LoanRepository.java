package cutalab.pagamenti.repositories;

import java.util.List;
import cutalab.pagamenti.models.LoanEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanRepository extends JpaRepository<LoanEntity, Integer> {
    List<LoanEntity> findByClientId(Integer id);
}