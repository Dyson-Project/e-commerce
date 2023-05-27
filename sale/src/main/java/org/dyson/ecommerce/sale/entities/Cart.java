package org.dyson.ecommerce.sale.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.util.List;

@Entity
public class Cart {
    BigDecimal shippingFee;

    BigDecimal totalPrice;

    @JdbcTypeCode(SqlTypes.JSON)
    List<CartItem> items;

    @OneToOne
    @Id
    Customer customer;

    @Data
    public static class CartItem {

    }
}
