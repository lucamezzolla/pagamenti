package cutalab.pagamenti.models;

import java.io.Serializable;
import java.time.LocalDateTime;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

@Entity
@Table(name="payments")
public class PaymentEntity implements Serializable {
    
    @Id 
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade=CascadeType.ALL)
    @JoinColumn(referencedColumnName="id", name="service_id", insertable=true, updatable=true, nullable=false)
    private ServiceEntity service;
    
    @OneToOne(cascade=CascadeType.ALL)
    @JoinColumn(referencedColumnName="id", name="client_id", insertable=true, updatable=true, nullable=false)
    private ClientEntity payment;
    
    @Column(name="payment_date", nullable=false)
    private LocalDateTime paymentDateTime;
    
    @Column(name="invoice", nullable=true)
    private String invoice;
    
    @Column(name="receipt", nullable=true)
    private String receipt;
    
    @Column(name="code", nullable=true)
    private String code;
    
    @Column(name="description", nullable=false)
    private String description;
    
    @Column(name="quantity", nullable=false)
    private Integer quantity;
    
    @Column(name="price", nullable=false)
    private Double price;
    
    @Column(name="iva", nullable=true)
    private String iva;
    
    @Column(name="iva_code", nullable=true)
    private String ivaCode;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ServiceEntity getService() {
        return service;
    }

    public void setService(ServiceEntity service) {
        this.service = service;
    }

    public LocalDateTime getPaymentDateTime() {
        return paymentDateTime;
    }

    public void setPaymentDateTime(LocalDateTime paymentDateTime) {
        this.paymentDateTime = paymentDateTime;
    }

    public String getInvoice() {
        return invoice;
    }

    public void setInvoice(String invoice) {
        this.invoice = invoice;
    }

    public String getReceipt() {
        return receipt;
    }

    public void setReceipt(String receipt) {
        this.receipt = receipt;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getIva() {
        return iva;
    }

    public void setIva(String iva) {
        this.iva = iva;
    }

    public String getIvaCode() {
        return ivaCode;
    }

    public void setIvaCode(String ivaCode) {
        this.ivaCode = ivaCode;
    }
    
}