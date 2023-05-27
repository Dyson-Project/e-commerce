package org.dyson.ecommerce.sale.controller

import org.dyson.ecommerce.sale.dto.CustomerDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/1.0/customers")
class CustomerController {
    @GetMapping
    fun getCustomers(phoneNumber: String): ResponseEntity<List<CustomerDto>> {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    fun getCustomer(id: Long): ResponseEntity<CustomerDto> {

        return ResponseEntity.ok().build();
    }

    @GetMapping("/info")
    fun getCustomerInfoFromToken(): ResponseEntity<CustomerDto> {

        return ResponseEntity.ok().build();
    }

    @PostMapping
    fun createCustomer(@RequestBody customer: CustomerDto): ResponseEntity<CustomerDto> {

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    fun updateCustomer(@PathVariable id: Long, @RequestBody customer: CustomerDto): ResponseEntity<Void> {

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    fun deleteCustomer(@PathVariable id: Long): ResponseEntity<Void> {

        return ResponseEntity.ok().build();
    }
}