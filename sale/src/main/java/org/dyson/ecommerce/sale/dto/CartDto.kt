package org.dyson.ecommerce.sale.dto

import java.math.BigDecimal

class CartDto(
    val id: Int,
    val customerId: Int,
    val shippingFree: BigDecimal,
    val totalPrice: BigDecimal,
    val items: String
)