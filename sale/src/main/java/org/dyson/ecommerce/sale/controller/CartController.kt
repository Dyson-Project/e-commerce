package org.dyson.ecommerce.sale.controller

import jakarta.persistence.EntityNotFoundException
import org.dyson.ecommerce.sale.dto.CartDto
import org.dyson.ecommerce.sale.entities.Cart
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.math.BigDecimal
import java.util.*

@RestController
@RequestMapping("/api/1.0/customers/cart")
class CartController @Autowired constructor(val cartRepository: CartRepository) {
    @GetMapping("/{id}")
    fun getCart(@PathVariable(required = false) id: UUID?): ResponseEntity<Cart> {
        if (id == null) {
            throw EntityNotFoundException("cart.not.found")
        }
        val cart = cartRepository.findById(id).orElseThrow { EntityNotFoundException("cart.not.found") };
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/{id}")
    fun post(@RequestBody input: CartDto): ResponseEntity<Cart> {
        val cart = Cart(
            BigDecimal.ZERO,
            BigDecimal.ZERO,
            emptyList()
        )
        cartRepository.save(cart)
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/{id}")
    fun updateCart(@PathVariable id: UUID, cartDto: CartDto): ResponseEntity<Void> {
        cartRepository.findById(id).ifPresentOrElse({
            it.items = cartDto.items.map { item ->
                Cart.CartItem(
                    item.skuId,
                    item.name,
                    item.variation,
                    item.itemPrice,
                    item.quantity,
                    item.image
                )
            }
        }, {
            throw EntityNotFoundException("cart.not.found")
        })
        return ResponseEntity.noContent().build();
    }
}