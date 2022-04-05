package cutalab.pagamenti.repositories;

import java.util.List;
import cutalab.pagamenti.models.LoanReturnedEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReturnedLoanRepository extends JpaRepository<LoanReturnedEntity, Integer> {
    List<LoanReturnedEntity> findByLoanIdOrderByDateDesc(Integer id);
}