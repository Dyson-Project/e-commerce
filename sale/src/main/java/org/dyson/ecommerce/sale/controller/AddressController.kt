package org.dyson.ecommerce.sale.controller

import org.dyson.ecommerce.sale.dto.AddressResponse
import org.springframework.data.domain.Page
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController("/api")
class AddressController {
    @GetMapping()
    fun getAddresses(): ResponseEntity<Page<AddressResponse>> {
        throw Exception()
    }

    @GetMapping("/{id}")
    fun getUserAddress(@PathVariable id: String): ResponseEntity<AddressResponse> {
        throw Exception()
    }

    @PostMapping
    fun createAddress(addressResponse: AddressResponse): ResponseEntity<AddressResponse> {
        throw Exception()
    }

    @PutMapping("/{id}")
    fun updateAddress(
        @PathVariable id: Int,
        @RequestBody addressResponse: AddressResponse
    ): ResponseEntity<AddressResponse> {
        throw Exception()
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Int): ResponseEntity<Void> {
        throw Exception()
    }
}
