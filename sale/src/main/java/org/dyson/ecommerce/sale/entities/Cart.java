package org.dyson.ecommerce.sale.entities;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.JoinFormula;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Data
public class Cart {
    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;
    BigDecimal shippingFee;

    BigDecimal totalPrice;

    @JdbcTypeCode(SqlTypes.JSON)
    List<CartItem> items;

//    @OneToOne(fetch = FetchType.LAZY)
//    @JoinFormula(value = "customer_id", referencedColumnName = "id")
//    Customer customer;
    Long customerId;

    public Cart(BigDecimal shippingFee, BigDecimal totalPrice, List<CartItem> items) {
        this.shippingFee = shippingFee;
        this.totalPrice = totalPrice;
        this.items = items;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CartItem {
        String skuId;
        String name;
        String variation;
        BigDecimal itemPrice;
        Integer quantity;
        String image;
    }
}
