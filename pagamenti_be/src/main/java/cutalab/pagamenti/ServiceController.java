package cutalab.pagamenti;

import cutalab.pagamenti.models.ServiceEntity;
import cutalab.pagamenti.models.ServiceNameList;
import cutalab.pagamenti.models.UserEntity;
import cutalab.pagamenti.repositories.ServiceRepository;
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
import cutalab.pagamenti.models.ServiceReducedList;

@RestController
@CrossOrigin
public class ServiceController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    @GetMapping("/services/name-list")
    public ResponseEntity serviceNameList(@RequestParam String token) {
        if(!validate(token)) {
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        }
        List<ServiceNameList> list = serviceRepository.selectNameList();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
    
    @GetMapping("/services/list")
    public ResponseEntity serviceList(@RequestParam String token) {
        if(!validate(token)) {
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        }
        List<ServiceReducedList> list = serviceRepository.selectReducedList();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
    
    @GetMapping("/services/view")
    public ResponseEntity serviceView(@RequestParam String token, @RequestParam Integer id) {
        try {
            if(!validate(token)) {
                return new ResponseEntity(HttpStatus.UNAUTHORIZED);
            }
            Optional<ServiceEntity> s = serviceRepository.findById(id);
            return new ResponseEntity<>(s.get(), HttpStatus.OK);
        } catch(IllegalArgumentException ex) {
            return new ResponseEntity<>("Errore. Sono stati passati parametri inappropriati.", HttpStatus.BAD_REQUEST);
        }
    }
    
    @PostMapping("/services/create")
    public ResponseEntity serviceCreate(
            @RequestParam String token,
            @RequestParam String name,
            @RequestParam String address,
            @RequestParam String fiscal_code,
            @RequestParam String piva,
            @RequestParam String description
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
            ServiceEntity s = new ServiceEntity();
            s.setName(name);
            s.setAddress(address);
            s.setFiscalCode(fiscal_code.toUpperCase());
            s.setPiva(piva);
            s.setDescription(description);
            serviceRepository.save(s);
        } catch(IllegalArgumentException ex) {
            return new ResponseEntity<>("Errore. Sono stati passati parametri inappropriati.", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @PutMapping("/services/update")
    public ResponseEntity serviceUpdate(
            @RequestParam String token,
            @RequestParam Integer id,
            @RequestParam String name,
            @RequestParam String address,
            @RequestParam String fiscal_code,
            @RequestParam String piva,
            @RequestParam String description
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
            ServiceEntity s = serviceRepository.getById(id);
            s.setName(name);
            s.setAddress(address);
            s.setFiscalCode(fiscal_code.toUpperCase());
            s.setPiva(piva);
            s.setDescription(description);
            serviceRepository.save(s);
        } catch(IllegalArgumentException ex) {
            return new ResponseEntity<>("Errore. Sono stati passati parametri inappropriati.", HttpStatus.BAD_REQUEST);
        } catch(DataAccessException ex) {
            return new ResponseEntity<>("Errore. Accertarsi che tutti i campi siano stati compilati correttamente.", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @DeleteMapping("/services/delete")
    public ResponseEntity serviceDelete(
            @RequestParam String token,
            @RequestParam Integer id
            ) {
        try {
            if(!validate(token)) {
                return new ResponseEntity(HttpStatus.UNAUTHORIZED);
            }
            ServiceEntity s = serviceRepository.getById(id);
            serviceRepository.deleteById(id);
        } catch(Exception ex) {
            if(ex.getMessage().contains("ConstraintViolationException")) {
                return new ResponseEntity<>("Errore. Impossibile rimuovere il servizio perché esistono uno o più pagamenti che lo usano.", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
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
        if(now < expirationDate && user != null) {
            retval = true;                                                      //autorizzato        
        }
        return retval;
    }

}
