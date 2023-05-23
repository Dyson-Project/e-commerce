package org.dyson.ecommerce.sale.controller

import org.dyson.ecommerce.sale.dto.CategoryDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/categories")
class CategoryController {
    @GetMapping
    fun getCategory(): ResponseEntity<CategoryDto> {
        throw Exception()
    }

    @PostMapping
    fun create(): ResponseEntity<CategoryDto> {
        throw Exception()
    }
}