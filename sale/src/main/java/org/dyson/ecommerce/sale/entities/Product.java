package org.dyson.ecommerce.sale.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    private Long sellerId;
    private Long categoryId;
    private Long brandId;
    private String productName;
    private String description;
    private String status;
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Sku> skus;
}
