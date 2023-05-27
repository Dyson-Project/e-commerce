package org.dyson.ecommerce.sale.controller

import org.dyson.ecommerce.sale.dto.ProductDto
import org.springframework.data.domain.Page
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@RequestMapping("/api/products")
class ProductController {
    @GetMapping
    fun getProducts(): ResponseEntity<Page<ProductDto>> {
        return ResponseEntity.ok().build();
    }


}