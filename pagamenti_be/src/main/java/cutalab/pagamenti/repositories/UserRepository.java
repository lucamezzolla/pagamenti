package cutalab.pagamenti.repositories;

import cutalab.pagamenti.models.UserEntity;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<UserEntity, Integer> {
    UserEntity findByEmailAndPassword(String email, String password);
}