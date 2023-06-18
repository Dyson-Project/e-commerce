package org.dyson.ecommerce.sale.dto

import java.math.BigDecimal
import java.util.UUID

data class CartDto(
    val id: UUID,
    val customerId: Int,
    val shippingFree: BigDecimal,
    val totalPrice: BigDecimal,
    val items: List<CartItemDto>
)

class CartItemDto(
    val skuId: String,
    val name: String,
    val variation: String,
    val itemPrice: BigDecimal,
    val quantity: Int,
    val image: String
)