package org.dyson.ecommerce.sale.exceptions;

import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.dyson.core.exception.ExtendedResponseEntityExceptionHandler;
import org.dyson.core.exception.RestError;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.*;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
@Order(Ordered.HIGHEST_PRECEDENCE)
@ApiResponses(value = {
    @ApiResponse(responseCode = "400", content = @Content(
        schema = @Schema(implementation = RestError.class),
        examples = {@ExampleObject(value = """
            {
                "timestamp": "2023-05-15T06:40:25.112189998Z",
                "exception": "javax.ws.rs.NotAuthorizedException",
                "code": "authorized.not",
                "message": "Sai tên đăng nhập hoặc mật khẩu",
                "trace": null,
                "subErrors": [],
                "debugMessage": "HTTP 401 Unauthorized",
                "status": 400
            }
            """)}
    )),
    @ApiResponse(responseCode = "500", content = @Content(schema = @Schema(implementation = RestError.class))),
})
public class RestExceptionHandlers extends ExtendedResponseEntityExceptionHandler {
    private final MessageSource messageSource;

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Object> handle(ResponseStatusException e) {
        return buildResponseEntity(new RestError(e.getStatusCode(), e.getReason(), e));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    protected ResponseEntity<Object> handle(DataIntegrityViolationException ex) {
        if (ex.getCause() instanceof ConstraintViolationException) {
            return buildResponseEntity(new RestError(HttpStatus.CONFLICT, "Database error", ex.getCause()));
        }
        return buildResponseEntity(new RestError(HttpStatus.INTERNAL_SERVER_ERROR, ex));
    }


    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    protected ResponseEntity<Object> handle(MethodArgumentTypeMismatchException ex) {
        RestError restError = new RestError(BAD_REQUEST, ex.getMessage(), ex);
        restError.setDebugMessage(ex.getMessage());
        return buildResponseEntity(restError);
    }


    @ExceptionHandler(ConstraintViolationException.class)
    protected ResponseEntity<Object> handle(ConstraintViolationException ex) {
        RestError restError = new RestError(BAD_REQUEST, "validation.error", ex);
        restError.addValidationErrors(ex.getConstraintViolations());
        return buildResponseEntity(restError);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    protected ResponseEntity<Object> handle(EntityNotFoundException ex) {
        RestError restError = new RestError(NOT_FOUND, ex);
        return buildResponseEntity(restError);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handle(Exception ex) {
        return buildResponseEntity(new RestError(INTERNAL_SERVER_ERROR, ex));
    }

    @Override
    public ResponseEntity<Object> buildResponseEntity(RestError restError) {
        String errorCode = restError.getMessage();
        String message = (StringUtils.hasText(errorCode) && this.messageSource != null ?
            this.messageSource.getMessage(errorCode, null, errorCode, LocaleContextHolder.getLocale()) : errorCode);
        restError.setMessage(message);
        restError.setCode(errorCode);
        return new ResponseEntity<>(restError, restError.getHttpStatusCode());
    }
}