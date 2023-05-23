package org.dyson.ecommerce.sale.controller

import org.dyson.ecommerce.sale.dto.CustomerDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/customers")
class CustomerController {
    @GetMapping
    fun getCustomers(phoneNumber: String): ResponseEntity<List<CustomerDto>> {

    }

    @GetMapping("/{id}")
    fun getCustomer(id: Long): ResponseEntity<CustomerDto> {

    }

    @GetMapping("/info")
    fun getCustomerInfoFromToken(): ResponseEntity<CustomerDto> {

    }

    @PostMapping
    fun createCustomer(customer:CustomerDto): CustomerDto {

    }

    @
}