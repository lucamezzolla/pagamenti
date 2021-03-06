package cutalab.pagamenti;

import cutalab.pagamenti.models.UserEntity;
import cutalab.pagamenti.repositories.ClientRepository;
import cutalab.pagamenti.repositories.UserRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;
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
    
    @Autowired
    private ClientRepository clientRepository;
    
    @PostMapping("/validate")
    public ResponseEntity validateService(@RequestParam String token) {
        if(!validate(token)) {
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity(HttpStatus.OK);
    }
    
    @PostMapping("/signup")
    public ResponseEntity signup(@RequestParam String name, @RequestParam String email, @RequestParam String password1, @RequestParam String password2, @RequestParam String code) {
        if(name.isEmpty() || email.isEmpty() || password1.isEmpty() || password2.isEmpty() || code.isEmpty()) {
            return new ResponseEntity("Errore. Campi vuoti.", HttpStatus.BAD_REQUEST);
        }
        if(!password1.equals(password2)) {
            return new ResponseEntity("Errore. La password non coincidono.", HttpStatus.BAD_REQUEST);
        }
        if(!code.equals("EvwTPsubs5jvzA5SZepP")) {
            return new ResponseEntity("Errore. Il codice di registrazione è invalido.", HttpStatus.BAD_REQUEST);
        }
        String encryptedPassword = CryptoUtil.encrypt(password1);
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
        String encryptedPassword = CryptoUtil.encrypt(password);
        UserEntity user = userRepository.findByEmailAndPassword(email, encryptedPassword);
        if(user == null) {
            return new ResponseEntity("Errore. Utente non trovato.", HttpStatus.BAD_REQUEST);
        }
        String token = buildToken(user.getId());
        return new ResponseEntity<>(token, HttpStatus.OK);
    }
    
    public String buildToken(Integer userId) {
        LocalDateTime now = LocalDateTime.now();
        long d0 = now.toEpochSecond(ZoneOffset.UTC);                            //data attuale (login)
        long d1 = now.minusYears(1).toEpochSecond(ZoneOffset.UTC);
        long d2 = now.plusYears(1).toEpochSecond(ZoneOffset.UTC);
        long d3 = now.plusDays(3).toEpochSecond(ZoneOffset.UTC);                //data di scadenza
        long d4 = now.minusDays(3).toEpochSecond(ZoneOffset.UTC);
        String originalString = d0+"cuta"+userId+"cuta"+d1+"cuta"+d2+"cuta"+d3+"cuta"+d4;
        String token = CryptoUtil.encrypt(originalString);
        return token;
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
        if(now < expirationDate && user != null) {
            retval = true;                                                      //autorizzato        
        }
        return retval;
    }

}