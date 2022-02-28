package cutalab.pagamenti;

import cutalab.pagamenti.models.ClientEntity;
import cutalab.pagamenti.models.ClientListReduced;
import cutalab.pagamenti.models.UserEntity;
import cutalab.pagamenti.repositories.ClientRepository;
import cutalab.pagamenti.repositories.UserRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    public ResponseEntity signup(@RequestParam String name, @RequestParam String email, @RequestParam String password1, @RequestParam String password2) {
        if(name.isEmpty() || email.isEmpty() || password1.isEmpty() || password2.isEmpty()) {
            return new ResponseEntity("Errore. Campi vuoti.", HttpStatus.BAD_REQUEST);
        }
        if(!password1.equals(password2)) {
            return new ResponseEntity("Errore. La password non coincidono.", HttpStatus.BAD_REQUEST);
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
            return new ResponseEntity("Utente non trovato.", HttpStatus.BAD_REQUEST);
        }
        String token = buildToken(user.getId());
        return new ResponseEntity<>(token, HttpStatus.OK);
    }
    
    @GetMapping("/personal_data/list")
    public ResponseEntity personalDataList(@RequestParam String token) {
        if(!validate(token)) {
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        }
        List<ClientListReduced> list = clientRepository.selectReducedList();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
    
    @GetMapping("/personal_data/view")
    public ResponseEntity personalDataView(@RequestParam String token, @RequestParam Integer id) {
        try {
            if(!validate(token)) {
                return new ResponseEntity(HttpStatus.UNAUTHORIZED);
            }
            Optional<ClientEntity> c = clientRepository.findById(id);
            return new ResponseEntity<>(c.get(), HttpStatus.OK);
        } catch(IllegalArgumentException ex) {
            return new ResponseEntity<>("Errore. Sono stati passati parametri inappropriati.", HttpStatus.BAD_REQUEST);
        }
    }
    
    @PostMapping("/personal_data/create")
    public ResponseEntity personalDataCreate(
            @RequestParam String token,
            @RequestParam String name,
            @RequestParam String address,
            @RequestParam String cap,
            @RequestParam String city,       
            @RequestParam String state,
            @RequestParam String country,
            @RequestParam String fiscal_code,
            @RequestParam String piva,
            @RequestParam String phone,
            @RequestParam String cell,
            @RequestParam String email,
            @RequestParam String code
            ) {
        try {
            if(!validate(token)) {
                return new ResponseEntity(HttpStatus.UNAUTHORIZED);
            }
            if(name.isEmpty() || fiscal_code.isEmpty()) {
                return new ResponseEntity("Errore. Il nome e il codice fiscale sono richiesti.", HttpStatus.BAD_REQUEST);
            }
            if(piva.isEmpty()) {
                piva = "00000000000";
            }
            ClientEntity c = new ClientEntity();
            c.setName(name);
            c.setAddress(address);
            c.setCap(cap);
            c.setCity(city);
            c.setState(state);
            c.setCountry(country);
            c.setFiscalCode(fiscal_code.toUpperCase());
            c.setPartitaIva(piva);
            c.setPhone(phone);
            c.setCell(cell);
            c.setEmail(email);
            c.setCode(code);
            clientRepository.save(c);
        } catch(IllegalArgumentException ex) {
            return new ResponseEntity<>("Errore. Sono stati passati parametri inappropriati.", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @PutMapping("/personal_data/update")
    public ResponseEntity personalDataUpdate(
            @RequestParam String token,
            @RequestParam Integer id,
            @RequestParam String name,
            @RequestParam String address,
            @RequestParam String cap,
            @RequestParam String city,       
            @RequestParam String state,
            @RequestParam String country,
            @RequestParam String fiscal_code,
            @RequestParam String piva,
            @RequestParam String phone,
            @RequestParam String cell,
            @RequestParam String email,
            @RequestParam String code
            ) {
        try {
            if(!validate(token)) {
                return new ResponseEntity(HttpStatus.UNAUTHORIZED);
            }
            if(name.isEmpty() || fiscal_code.isEmpty()) {
                return new ResponseEntity("Errore. Il nome e il codice fiscale sono richiesti.", HttpStatus.BAD_REQUEST);
            }
            if(piva.isEmpty()) {
                piva = "00000000000";
            }
            ClientEntity c = clientRepository.getById(id);
            c.setName(name);
            c.setAddress(address);
            c.setCap(cap);
            c.setCity(city);
            c.setState(state);
            c.setCountry(country);
            c.setFiscalCode(fiscal_code.toUpperCase());
            c.setPartitaIva(piva);
            c.setPhone(phone);
            c.setCell(cell);
            c.setEmail(email);
            c.setCode(code);
            clientRepository.save(c);
        } catch(IllegalArgumentException ex) {
            return new ResponseEntity<>("Errore. Sono stati passati parametri inappropriati.", HttpStatus.BAD_REQUEST);
        } catch(DataAccessException ex) {
            return new ResponseEntity<>("Errore. Accertarsi che tutti i campi siano stati compilati correttamente.", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @DeleteMapping("/personal_data/delete")
    public ResponseEntity personalDataDelete(
            @RequestParam String token,
            @RequestParam Integer id
            ) {
        try {
            if(!validate(token)) {
                return new ResponseEntity(HttpStatus.UNAUTHORIZED);
            }
            ClientEntity c = clientRepository.getById(id);
            clientRepository.deleteById(id);
        } catch(Exception ex) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
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