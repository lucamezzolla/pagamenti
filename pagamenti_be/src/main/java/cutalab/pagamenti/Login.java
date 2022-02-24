package cutalab.pagamenti;

import java.time.ZoneOffset;
import java.time.LocalDateTime;
import cutalab.pagamenti.models.UserEntity;
import cutalab.pagamenti.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

public class Login {
    
    @Autowired
    private static UserRepository userRepository;
    
    public static String buildToken(Integer userId) {
        LocalDateTime now = LocalDateTime.now();
        long d0 = now.toEpochSecond(ZoneOffset.UTC);                            //data attuale (login)
        long d1 = now.minusYears(1).toEpochSecond(ZoneOffset.UTC);
        long d2 = now.plusYears(1).toEpochSecond(ZoneOffset.UTC);
        long d3 = now.plusDays(3).toEpochSecond(ZoneOffset.UTC);                //data di scadenza
        long d4 = now.minusDays(3).toEpochSecond(ZoneOffset.UTC);
        String originalString = d0+"#"+userId+"#"+d1+"#"+d2+"#"+d3+"#"+d4;
        String token = AES.encrypt(originalString, AES.KEY);
        return token;
    }
    
    public static boolean validate(String str) {
        boolean retval = false;
        String token = AES.decrypt(str, AES.KEY);
        String[] split = token.split("#");
        Integer userId = Integer.valueOf(split[1]);
        LocalDateTime date = LocalDateTime.now();
        long now = date.toEpochSecond(ZoneOffset.UTC);                          //data attuale (confronto)  
        long expirationDate = Long.valueOf(split[4]);                           //data di scadenza token
        UserEntity user = userRepository.findById(userId).get();
        if(now < expirationDate && user != null) {
            retval = true;                                                      //autorizzato        
        }
        return retval;
    }

}
