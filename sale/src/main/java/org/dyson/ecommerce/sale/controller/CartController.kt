package org.dyson.ecommerce.sale.controller

import org.dyson.ecommerce.sale.dto.CartDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/customer")
class CartController {
    @GetMapping
    fun getCart(): CartDto {
        throw Exception()
    }

    @PutMapping("/{id}")
    fun updateCart(@PathVariable id: String, cartDto: CartDto): ResponseEntity<Void> {
        throw Exception()
    }
}