package org.dyson.ecommerce.sale.controller

import org.dyson.ecommerce.sale.dto.BranchDto
import org.springframework.data.domain.Page
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/1.0/brands")
class BrandController {
    @GetMapping
    fun getBrands(): ResponseEntity<Page<BranchDto>> {
        throw Exception()
    }

    @GetMapping("/{id}")
    fun getBrand(@PathVariable id: Int): ResponseEntity<BranchDto> {
        throw Exception()
    }

    @PostMapping
    fun createBrand(@RequestBody branchDto: BranchDto): ResponseEntity<BranchDto> {
        throw Exception()
    }

    @PutMapping("/{id}")
    fun updateBranch(@RequestBody branchDto: BranchDto, @PathVariable id: Int): ResponseEntity<BranchDto> {
        throw Exception()
    }

    @DeleteMapping("/id")
    fun delete(): ResponseEntity<Void> {
        return ResponseEntity.noContent().build()
    }
}