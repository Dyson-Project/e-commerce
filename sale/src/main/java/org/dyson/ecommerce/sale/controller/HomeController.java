package org.dyson.ecommerce.sale.controller;

import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Slf4j
@Controller
@RequiredArgsConstructor
public class HomeController {
    @Hidden
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String reDocs() {
        return "redoc.html";
    }


    @GetMapping(value = "/error-codes")
    @Operation(summary = "Liệt kê tất error code ở ngôn ngữ hiện tại", tags = {"Dev note dành cho FE"})
    @ResponseBody
    @SecurityRequirements()
    public ResponseEntity<String> errorCodes(@RequestHeader(HttpHeaders.ACCEPT_LANGUAGE) String lang) throws IOException {
        String file = switch (lang) {
            case "vi" -> "i18n/messages_vi.properties";
            default -> "i18n/messages.properties";
        };
        String errorCodes = new String(getClass().getClassLoader().getResourceAsStream(file).readAllBytes(), StandardCharsets.UTF_8);
        return ResponseEntity.ok(errorCodes);
    }

}
