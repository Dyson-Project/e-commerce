package org.dyson.ecommerce.sale.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
@Entity
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    public Long id;
    public Long skuId;
    public String name;
    public String variation;
    public BigDecimal price;
    public Integer quantity;
    public String image;
    @ManyToOne
    public Order order;
}
