package org.dyson.ecommerce.sale.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Seller {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    Long id;
    String phoneNumber;
    String name;
    String email;
    String password;
    String secretKey;
}
