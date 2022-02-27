package cutalab.pagamenti.models;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Column;

@Entity
@Table(name="clients")
public class ClientEntity implements Serializable {

    @Id 
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    @Column(name="name", columnDefinition = "varchar(80)")
    private String name;
    
    @Column(name="address", columnDefinition = "varchar(80)")
    private String address;
    
    @Column(name="cap", columnDefinition = "varchar(5)")
    private String cap;
    
    @Column(name="country", columnDefinition = "varchar(30)")
    private String country;

    @Column(name="city", columnDefinition = "varchar(30)")
    private String city;
    
    @Column(name="state", columnDefinition = "varchar(2)")
    private String state;
    
    @Column(name="piva", columnDefinition = "varchar(25)")
    private String partitaIva;
    
    @Column(name="fiscal_code", columnDefinition = "varchar(30)")
    private String fiscalCode;
    
    @Column(name="phone", columnDefinition = "varchar(30)")
    private String phone;
    
    @Column(name="cell", columnDefinition = "varchar(30)")
    private String cell;
    
    @Column(name="email", columnDefinition = "varchar(50)")
    private String email;

    @Column(name="code", columnDefinition = "varchar(255)")
    private String code;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCap() {
        return cap;
    }

    public void setCap(String cap) {
        this.cap = cap;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPartitaIva() {
        return partitaIva;
    }

    public void setPartitaIva(String partitaIva) {
        this.partitaIva = partitaIva;
    }

    public String getFiscalCode() {
        return fiscalCode;
    }

    public void setFiscalCode(String fiscalCode) {
        this.fiscalCode = fiscalCode;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCell() {
        return cell;
    }

    public void setCell(String cell) {
        this.cell = cell;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
    
}