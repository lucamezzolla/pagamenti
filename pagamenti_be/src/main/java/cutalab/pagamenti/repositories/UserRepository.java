package cutalab.pagamenti.repositories;

import java.util.List;
import cutalab.pagamenti.models.UserEntity;
import cutalab.pagamenti.models.UserListReduced;
import cutalab.pagamenti.models.UserReduced;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    
    UserEntity findByEmailAndPassword(String email, String password);
    
    @Query(value="select u.id, u.name, u.email from users u", nativeQuery=true)
    List<UserListReduced> getReducedList();
    
    @Query(value="select u.id, u.name, u.email from users u where u.id = ?1", nativeQuery=true)
    UserReduced getReducedUser(Integer id);
    
}