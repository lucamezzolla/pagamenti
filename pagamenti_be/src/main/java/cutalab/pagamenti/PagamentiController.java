package cutalab.pagamenti;

import cutalab.pagamenti.models.UserEntity;
import cutalab.pagamenti.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class PagamentiController {
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/signup")
    public ResponseEntity signup(@RequestParam String name, @RequestParam String email, @RequestParam String password1, @RequestParam String password2) {
        if(name.isEmpty() || email.isEmpty() || password1.isEmpty() || password2.isEmpty()) {
            return new ResponseEntity("Errore. Campi vuoti.", HttpStatus.BAD_REQUEST);
        }
        if(!password1.equals(password2)) {
            return new ResponseEntity("Errore. La password non coincidono.", HttpStatus.BAD_REQUEST);
        }
        String encryptedPassword = AES.encrypt(password1, AES.KEY);
        UserEntity user = new UserEntity();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(encryptedPassword);
        try {
            userRepository.save(user);
        } catch(DataAccessException ex) {
            return new ResponseEntity("Errore. L'email indicata è in uso.", HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @PostMapping("/signin")
    public ResponseEntity signin(@RequestParam String email, @RequestParam String password) {
        if(email.isEmpty() || password.isEmpty()) {
            return new ResponseEntity("Errore. Campi vuoti.", HttpStatus.BAD_REQUEST);
        }
        String encryptedPassword = AES.encrypt(password, AES.KEY);
        UserEntity user = userRepository.findByEmailAndPassword(email, encryptedPassword);
        if(user == null) {
            return new ResponseEntity("Utente non trovato.", HttpStatus.BAD_REQUEST);
        }
        String token = Login.buildToken(user.getId());
        return new ResponseEntity<>(token, HttpStatus.OK);
    }

}