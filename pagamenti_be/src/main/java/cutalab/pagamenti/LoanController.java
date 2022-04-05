package cutalab.pagamenti;

import cutalab.pagamenti.models.ClientEntity;
import cutalab.pagamenti.models.LoanEntity;
import cutalab.pagamenti.models.LoanReturnedEntity;
import cutalab.pagamenti.models.UserEntity;
import cutalab.pagamenti.repositories.ClientRepository;
import cutalab.pagamenti.repositories.LoanRepository;
import cutalab.pagamenti.repositories.ReturnedLoanRepository;
import cutalab.pagamenti.repositories.UserRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
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
public class LoanController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private LoanRepository loanRepository;
    
    @Autowired
    private ReturnedLoanRepository returnedLoanRepository;
    
    private static DateTimeFormatter formatterList = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @GetMapping("/loans/list")
    public ResponseEntity loanList(@RequestParam String token, @RequestParam Integer id) {
        if(!validate(token)) {
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        }
        List<LoanEntity> list = loanRepository.findByClientId(id);
        Iterator<LoanEntity> iterator = list.iterator();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
    
    @GetMapping("/loans/view")
    public ResponseEntity loanView(@RequestParam String token, @RequestParam Integer id) {
        try {
            if(!validate(token)) {
                return new ResponseEntity(HttpStatus.UNAUTHORIZED);
            }
            Optional<LoanEntity> l = loanRepository.findById(id);
            return new ResponseEntity<>(l.get(), HttpStatus.OK);
        } catch(IllegalArgumentException ex) {
            return new ResponseEntity<>("Errore. Sono stati passati parametri inappropriati.", HttpStatus.BAD_REQUEST);
        }
    }
    
    @PostMapping("/loans/create")
    public ResponseEntity paymentCreate(
            @RequestParam String token,
            @RequestParam String clientId,
            @RequestParam String total,
            @RequestParam String currency,
            @RequestParam String dateLoan,
            @RequestParam String dateExpiration
            ) {
        try {
            if(!validate(token)) {
                return new ResponseEntity(HttpStatus.UNAUTHORIZED);
            }
            if(clientId.isEmpty() || total.isEmpty() || currency.isEmpty() || dateLoan.isEmpty() || dateExpiration.isEmpty()) {
                return new ResponseEntity("Errore. Tutti i campi sono richiesti.", HttpStatus.BAD_REQUEST);
            }
            ClientEntity c = clientRepository.getById(Integer.valueOf(clientId));
            LoanEntity l = new LoanEntity();
            l.setClient(c);
            l.setCurrency(currency);
            l.setTotal(Double.valueOf(total));
            LocalDate dateLoanField = LocalDate.parse(dateLoan, formatter);
            LocalDate dateExpirationField = LocalDate.parse(dateExpiration, formatter);
            l.setDateLoan(dateLoanField);
            l.setDateExpiration(dateExpirationField);
            loanRepository.save(l);
        } catch(IllegalArgumentException ex) {
            return new ResponseEntity<>("Errore. Sono stati passati parametri inappropriati.", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
    

    @PutMapping("/loans/update")
    public ResponseEntity loanUpdate (
            @RequestParam String token,
            @RequestParam String id,
            @RequestParam String clientId,
            @RequestParam String total,
            @RequestParam String currency,
            @RequestParam String dateLoan,
            @RequestParam String dateExpiration
            ) {
        try {
            if(!validate(token)) {
                return new ResponseEntity(HttpStatus.UNAUTHORIZED);
            }
            if(clientId.isEmpty() || total.isEmpty() || currency.isEmpty() || dateLoan.isEmpty() || dateExpiration.isEmpty()) {
                return new ResponseEntity("Errore. Tutti i campi sono richiesti.", HttpStatus.BAD_REQUEST);
            }
            ClientEntity c = clientRepository.getById(Integer.valueOf(clientId));
            LoanEntity l = loanRepository.getById(Integer.valueOf(id));
            l.setClient(c);
            l.setCurrency(currency);
            l.setTotal(Double.valueOf(total));
            LocalDate dateLoanField = LocalDate.parse(dateLoan, formatter);
            LocalDate dateExpirationField = LocalDate.parse(dateExpiration, formatter);
            l.setDateLoan(dateLoanField);
            l.setDateExpiration(dateExpirationField);
            loanRepository.save(l);
        } catch(IllegalArgumentException ex) {
            return new ResponseEntity<>("Errore. Sono stati passati parametri inappropriati.", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @DeleteMapping("/loans/delete")
    public ResponseEntity serviceDelete(
            @RequestParam String token,
            @RequestParam String id
            ) {
        try {
            if(!validate(token)) {
                return new ResponseEntity(HttpStatus.UNAUTHORIZED);
            }
            loanRepository.deleteById(Integer.valueOf(id));
        } catch(Exception ex) {
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
    
    @GetMapping("/rloans/list")
    public ResponseEntity rloanList(@RequestParam String token, @RequestParam Integer id) {
        if(!validate(token)) {
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        }
        List<LoanReturnedEntity> list = returnedLoanRepository.findByLoanIdOrderByDateDesc(id);
        Iterator<LoanReturnedEntity> iterator = list.iterator();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
    
    @PostMapping("/rloans/create")
    public ResponseEntity rloanCreate(
            @RequestParam String token,
            @RequestParam String loanId,
            @RequestParam String total
            ) {
        try {
            if(!validate(token)) {
                return new ResponseEntity(HttpStatus.UNAUTHORIZED);
            }
            if(total.isEmpty()) {
                return new ResponseEntity("Errore. Tutti i campi sono richiesti.", HttpStatus.BAD_REQUEST);
            }
            LoanReturnedEntity l = new LoanReturnedEntity();
            l.setDate(LocalDate.now());
            l.setLoanId(Integer.valueOf(loanId));
            l.setTotal(Double.valueOf(total));
            returnedLoanRepository.save(l);
            
            LoanEntity ll = loanRepository.getById(Integer.valueOf(loanId));
            ll.setTotalReturned(ll.getTotalReturned() + Double.valueOf(total));
            loanRepository.save(ll);
            
            
        } catch(IllegalArgumentException ex) {
            return new ResponseEntity<>("Errore. Sono stati passati parametri inappropriati.", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

}