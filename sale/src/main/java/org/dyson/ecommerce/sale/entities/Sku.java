package org.dyson.ecommerce.sale.entities;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
public class Sku {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    Long id;

    String sellerSku;

    Long available;

    Long quantity;

    String color;

    Long size;

    Long height;

    Long width;

    Long length;

    Long weight;

    BigDecimal price;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "sku", orphanRemoval = true)
    List<Images> images;

    @ManyToOne
    Product product;
}
