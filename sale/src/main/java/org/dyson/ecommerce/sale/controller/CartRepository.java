package org.dyson.ecommerce.sale.controller;

import org.dyson.ecommerce.sale.entities.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CartRepository extends JpaRepository<Cart, UUID> {
}
