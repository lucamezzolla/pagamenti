package cutalab.pagamenti;

import cutalab.pagamenti.models.ServiceEntity;
import cutalab.pagamenti.models.UserEntity;
import cutalab.pagamenti.repositories.UserRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import cutalab.pagamenti.models.UserListReduced;
import cutalab.pagamenti.models.UserReduced;
import org.springframework.dao.DataAccessException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@CrossOrigin
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users/list")
    public ResponseEntity usersList(@RequestParam String token) {
        if (!validate(token)) {
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        }
        List<UserListReduced> list = userRepository.getReducedList();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/users/view")
    public ResponseEntity usersView(@RequestParam String token, @RequestParam Integer id) {
        try {
            if (!validate(token)) {
                return new ResponseEntity(HttpStatus.UNAUTHORIZED);
            }
            UserReduced u = userRepository.getReducedUser(id);
            return new ResponseEntity<>(u, HttpStatus.OK);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>("Errore. Sono stati passati parametri inappropriati.", HttpStatus.BAD_REQUEST);
        }
    }
    
    @DeleteMapping("/users/delete")
    public ResponseEntity usersDelete(
            @RequestParam String token,
            @RequestParam Integer id
            ) {
        try {
            if(!validate(token)) {
                return new ResponseEntity(HttpStatus.UNAUTHORIZED);
            }
            List<UserEntity> findAll = userRepository.findAll();
            if(findAll.size() == 1) {
                return new ResponseEntity<>("Errore. Non è possibile rimuovere quest'utenza.", HttpStatus.NOT_ACCEPTABLE);
            }
            userRepository.deleteById(id);
        } catch(Exception ex) {
            if(ex.getMessage().contains("ConstraintViolationException")) {
                return new ResponseEntity<>("Errore. Impossibile rimuovere il servizio perché esistono uno o più pagamenti che lo usano.", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/users/update")
    public ResponseEntity usersUpdate(
            @RequestParam String token,
            @RequestParam Integer id,
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password1,
            @RequestParam String password2
    ) {
        try {
            if (!validate(token)) {
                return new ResponseEntity(HttpStatus.UNAUTHORIZED);
            }
            if (name.isEmpty() || email.isEmpty()) {
                return new ResponseEntity("Errore. I campi con * sono richiesti.", HttpStatus.BAD_REQUEST);
            }
            if (!password1.isEmpty()) {
                if (!password1.equals(password2)) {
                    return new ResponseEntity("Errore. Le password non coincidono.", HttpStatus.BAD_REQUEST);
                }
            }
            UserEntity u = userRepository.getById(id);
            u.setName(name);
            u.setEmail(email);
            if (!password1.isEmpty()) {
                String encryptedPassword = CryptoUtil.encrypt(password1);
                u.setPassword(encryptedPassword);
            }
            try {
                userRepository.save(u);
            } catch (DataAccessException ex) {
                return new ResponseEntity("Errore. L'email indicata è in uso.", HttpStatus.CONFLICT);
            }
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>("Errore. Sono stati passati parametri inappropriati.", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    public boolean validate(String token) {
        boolean retval = false;
        String tokenDecrypted = CryptoUtil.decrypt(token);
        String[] split = tokenDecrypted.split("cuta");
        Integer userId = Integer.valueOf(split[1]);
        LocalDateTime date = LocalDateTime.now();
        long now = date.toEpochSecond(ZoneOffset.UTC);                          //data attuale (confronto)  
        long expirationDate = Long.valueOf(split[4]);                           //data di scadenza token
        Optional<UserEntity> user = userRepository.findById(userId);
        if (now < expirationDate && user != null) {
            retval = true;                                                      //autorizzato        
        }
        return retval;
    }

}
