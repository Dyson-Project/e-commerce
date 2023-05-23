package org.dyson.ecommerce.sale.dto

import java.math.BigDecimal

data class SkuDto(
    val id: Long,
    val sellerSku: String,
    val available: Int,
    val quantity: Int,
    val color: String,
    val size: Int,
    val height: Int,
    val width: Int,
    val length: Int,
    val price: BigDecimal,
    val images: List<ImageDto>,
    val productId: Long,
)

data class ProductDto(
    val id: Int,
    val sellerId: Int,
    val categoryId: Int,
    val branchId: Int,
    val productName: String,
    val description: String,
    val status: String,
    val skus: List<SkuDto>,
    val seller: SellerDto,
    val branch: BranchDto,
    val category: CategoryDto
)