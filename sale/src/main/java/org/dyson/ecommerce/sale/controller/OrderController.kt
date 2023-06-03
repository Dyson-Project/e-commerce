//package org.dyson.ecommerce.sale.controller
//
//import org.aspectj.weaver.ast.Or
//import org.dyson.ecommerce.sale.dto.OrderDto
//import org.springframework.data.domain.Page
//import org.springframework.http.ResponseEntity
//import org.springframework.web.bind.annotation.GetMapping
//import org.springframework.web.bind.annotation.PathVariable
//import org.springframework.web.bind.annotation.PostMapping
//import org.springframework.web.bind.annotation.PutMapping
//import org.springframework.web.bind.annotation.RequestBody
//import org.springframework.web.bind.annotation.RequestMapping
//import org.springframework.web.bind.annotation.RestController
//
//@RestController
//@RequestMapping("/api/orders")
//class OrderController{
//    @GetMapping
//    fun getOrders(): ResponseEntity<Page<OrderDto>>{
//     throw UnsupportedOperationException();
//    }
//
//    @GetMapping("/{id}")
//    fun get(@PathVariable id: String):ResponseEntity<OrderDto>{
//        throw UnsupportedOperationException();
//    }
//
//    @PostMapping
//    fun post(@RequestBody orderDto: OrderDto):ResponseEntity<Any>{
//        throw UnsupportedOperationException();
//    }
//
//    @PutMapping("/{id}")
//    fun put(@RequestBody orderDto: OrderDto):ResponseEntity<Any>{
//        throw UnsupportedOperationException();
//    }
//
//}