package org.dyson.ecommerce.sale.entities;

import jakarta.persistence.*;

@Entity
public class SellerAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    Long id;

    Long sellerId;

    String street;
    String address1;
    String address2;
    String address3;
    Boolean isDefault;
    @ManyToOne
    Seller seller;
}
