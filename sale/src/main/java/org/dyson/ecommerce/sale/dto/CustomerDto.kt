package org.dyson.ecommerce.sale.dto

import java.time.ZonedDateTime

data class CustomerDto(
    val id: Int,
    val name: String,
    val email: String,
    val phoneNumber: String,
    val password: String,
    val accessToken: String,
    val accessExpire: ZonedDateTime,
    val refreshToken: String,
    val gender: String,
    val address: List<AddressResponse>
)