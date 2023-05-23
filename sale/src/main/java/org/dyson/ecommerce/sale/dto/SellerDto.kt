package org.dyson.ecommerce.sale.dto

import java.time.ZonedDateTime

data class SellerAddressDto(
    val id: Long,
    val sellerId: Long,
    val street: String,
    val address1: String,
    val address2: String,
    val address3: String,
    val isDefault: Boolean
)

data class SellerDto(
    val id: Int,
    val phoneNumber: String,
    val name: String,
    val email: String,
    val password: String,
    val secretKey: String,
    val accessToken: String,
    val accessExpire: ZonedDateTime,
    val refreshToken: String,
    val address: List<SellerAddressDto>
)