package org.dyson.ecommerce.sale.controller

import org.dyson.ecommerce.sale.dto.RegistryRequest
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController

@RestController("/api")
class AuthController {
    @PostMapping("/login")
    fun login(): ResponseEntity<Void> {
        throw Exception()
    }

    @PostMapping("/register")
    fun register(registry: RegistryRequest): ResponseEntity<Void> {
        throw Exception()
    }
}