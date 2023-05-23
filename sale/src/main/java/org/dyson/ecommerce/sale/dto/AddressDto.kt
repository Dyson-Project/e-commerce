package org.dyson.ecommerce.sale.dto

data class AddressResponse(
    val id: Int,
    val customerId: Int,
    val street: String,
    val address1: String,
    val address2: String,
    val address3: String,
    val isDefault: Boolean
)
