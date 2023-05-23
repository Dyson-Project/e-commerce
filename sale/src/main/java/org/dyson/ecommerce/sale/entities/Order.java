package org.dyson.ecommerce.sale.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

@Setter
@Getter
@Entity
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    public Long id;
    public Long customerId;
    public ZonedDateTime createDate;
    public ZonedDateTime updateDate;
    public String paymentMethod;
    public BigDecimal shippingFee;
    public String shippingAddress;
    public BigDecimal totalPrice;
    public String status;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "order", orphanRemoval = true)
    public List<OrderItem> items;
}
