package org.dyson.ecommerce.sale.dto

class Register(
    val name: String,
    val phoneNumber: String,
    val password: String,
    val confirmPassword: String
)

class Authentication(val phone: String, val password: String)