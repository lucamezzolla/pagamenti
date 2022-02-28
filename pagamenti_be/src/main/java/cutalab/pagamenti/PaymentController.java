package cutalab.pagamenti;

import cutalab.pagamenti.models.ClientEntity;
import cutalab.pagamenti.models.PaymentEntity;
import cutalab.pagamenti.models.ServiceEntity;
import cutalab.pagamenti.models.UserEntity;
import cutalab.pagamenti.repositories.ClientRepository;
import cutalab.pagamenti.repositories.PaymentRepository;
import cutalab.pagamenti.repositories.ServiceRepository;
import cutalab.pagamenti.repositories.UserRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
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
public class PaymentController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping("/payments/list")
    public ResponseEntity serviceList(@RequestParam String token) {
        if(!validate(token)) {
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        }
        List<PaymentEntity> list = paymentRepository.findAll();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
    
    @GetMapping("/payments/view")
    public ResponseEntity paymentView(@RequestParam String token, @RequestParam Long id) {
        try {
            if(!validate(token)) {
                return new ResponseEntity(HttpStatus.UNAUTHORIZED);
            }
            Optional<PaymentEntity> p = paymentRepository.findById(id);
            return new ResponseEntity<>(p.get(), HttpStatus.OK);
        } catch(IllegalArgumentException ex) {
            return new ResponseEntity<>("Errore. Sono stati passati parametri inappropriati.", HttpStatus.BAD_REQUEST);
        }
    }
    
    @PostMapping("/payments/create")
    public ResponseEntity paymentCreate(
            @RequestParam String token,
            @RequestParam String code,
            @RequestParam String description,
            @RequestParam String invoice,
            @RequestParam String iva,
            @RequestParam String ivaCode,
            @RequestParam String paymentDate,
            @RequestParam Double price,
            @RequestParam Integer qty,
            @RequestParam String receipt,
            @RequestParam String clientId,
            @RequestParam String serviceId
            ) {
        try {
            if(!validate(token)) {
                return new ResponseEntity(HttpStatus.UNAUTHORIZED);
            }
            if(description.isEmpty() || paymentDate == null || price == 0 || qty == 0 || clientId.isEmpty() || clientId.isEmpty()) {
                return new ResponseEntity("Errore. I campi con * sono richiesti.", HttpStatus.BAD_REQUEST);
            }
            if(iva.isEmpty()) {
                iva = "00000000000";
            }
            ClientEntity c = clientRepository.getById(Integer.valueOf(clientId));
            ServiceEntity s = serviceRepository.getById(Integer.valueOf(serviceId));
            PaymentEntity p = new PaymentEntity();
            p.setCode(code);
            p.setDescription(description);
            p.setInvoice(invoice);
            p.setIva(iva);
            p.setIvaCode(ivaCode);
            paymentDate = paymentDate.replace("T", " ");
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            LocalDateTime dateTime = LocalDateTime.parse(paymentDate, formatter);
            p.setPaymentDateTime(dateTime);
            p.setPrice(price);
            p.setQuantity(qty);
            p.setReceipt(receipt);
            p.setService(s);
            p.setClient(c);
            System.out.println(p);
            paymentRepository.save(p);
        } catch(IllegalArgumentException ex) {
            return new ResponseEntity<>("Errore. Sono stati passati parametri inappropriati.", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @PutMapping("/payments/update")
    public ResponseEntity paymentUpdate(
            @RequestParam String token,
            @RequestParam Long id,
            @RequestParam String code,
            @RequestParam String description,
            @RequestParam String invoice,
            @RequestParam String iva,
            @RequestParam String ivaCode,
            @RequestParam LocalDateTime paymentDate,
            @RequestParam Double price,
            @RequestParam Integer qty,
            @RequestParam String receipt,
            @RequestParam String clientId,
            @RequestParam String serviceId
            ) {
        try {
            if(!validate(token)) {
                return new ResponseEntity(HttpStatus.UNAUTHORIZED);
            }
            if(description.isEmpty() || paymentDate == null || price == 0 || qty == 0 || clientId.isEmpty() || clientId.isEmpty()) {
                return new ResponseEntity("Errore. I campi con * sono richiesti.", HttpStatus.BAD_REQUEST);
            }
            if(iva.isEmpty()) {
                iva = "00000000000";
            }
            PaymentEntity p = paymentRepository.getById(id);
            p.setCode(code);
            p.setDescription(description);
            p.setInvoice(invoice);
            p.setIva(iva);
            p.setIvaCode(ivaCode);
            p.setPaymentDateTime(paymentDate);
            p.setPrice(price);
            p.setQuantity(qty);
            p.setReceipt(receipt);
            p.setService(null);
            p.setClient(null);
            paymentRepository.save(p);
        } catch(IllegalArgumentException ex) {
            return new ResponseEntity<>("Errore. Sono stati passati parametri inappropriati.", HttpStatus.BAD_REQUEST);
        } catch(DataAccessException ex) {
            return new ResponseEntity<>("Errore. Accertarsi che tutti i campi siano stati compilati correttamente.", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @DeleteMapping("/payments/delete")
    public ResponseEntity serviceDelete(
            @RequestParam String token,
            @RequestParam Long id
            ) {
        try {
            if(!validate(token)) {
                return new ResponseEntity(HttpStatus.UNAUTHORIZED);
            }
            PaymentEntity p = paymentRepository.getById(id);
            paymentRepository.deleteById(id);
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
    
}
