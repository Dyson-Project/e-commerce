package org.dyson.ecommerce.sale.controller

import org.dyson.ecommerce.sale.dto.CartDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/1.0/customers/{id}/cart")
class CartController {
    @GetMapping
    fun getCart(@PathVariable id: Long): CartDto {
        throw Exception()
    }

    @PutMapping
    fun updateCart(@PathVariable id: Long, cartDto: CartDto): ResponseEntity<Void> {
        throw Exception()
    }
}