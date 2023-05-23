package org.dyson.ecommerce.sale.dto

import java.math.BigDecimal
import java.time.ZonedDateTime

data class OrderItemDto(
    val id: Long,
    val orderId: Long,
    val skuId: Long,
    val name: String,
    val variation: String,
    val price: BigDecimal,
    val quantity: Int,
    val image: String,
    val sku: SkuDto
)

data class OrderDto(
    val id: Int,
    val createDate: ZonedDateTime,
    val updateDate: ZonedDateTime,
    val paymentMethod: String,
    val shippingFee: BigDecimal,
    val shippingAddress: String,
    val totalPrice: BigDecimal,
    val status: String,
    val customerId: Int,
    val orderItem: List<OrderItemDto>,
    val customer: CustomerDto
)