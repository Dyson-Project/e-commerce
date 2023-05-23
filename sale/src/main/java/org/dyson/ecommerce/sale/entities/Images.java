package org.dyson.ecommerce.sale.entities;

import jakarta.persistence.*;

@Entity
public class Images {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    Long id;
    String url;
    @ManyToOne
    Sku sku;
}
