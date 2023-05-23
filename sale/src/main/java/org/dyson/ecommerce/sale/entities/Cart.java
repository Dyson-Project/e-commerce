package org.dyson.ecommerce.sale.entities;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.util.List;

@Entity
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    Long customerId;

    BigDecimal shippingFee;

    BigDecimal totalPrice;

    @JdbcTypeCode(SqlTypes.JSON)
    List<CartItem> items;

    @OneToOne
    Customer customer;

    @Data
    public static class CartItem {

    }
}
