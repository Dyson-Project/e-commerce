package org.dyson.core.exception;

import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Slf4j
public abstract class ExtendedResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {
    @Override
    protected ResponseEntity<Object> handleMissingServletRequestParameter(MissingServletRequestParameterException ex, @NotNull HttpHeaders headers, @NotNull HttpStatusCode status, @NotNull WebRequest request) {
        String error = ex.getParameterName() + " parameter is missing";
        return buildResponseEntity(new RestError(BAD_REQUEST, error, ex));
    }

    @Override
    protected ResponseEntity<Object> handleHttpMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex, @NotNull HttpHeaders headers, @NotNull HttpStatusCode status, @NotNull WebRequest request) {
        StringBuilder builder = new StringBuilder();
        builder.append(ex.getContentType());
        builder.append(" media type is not supported. Supported media types are ");
        ex.getSupportedMediaTypes().forEach(t -> builder.append(t).append(", "));
        return buildResponseEntity(new RestError(HttpStatus.UNSUPPORTED_MEDIA_TYPE, builder.substring(0, builder.length() - 2), ex));
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(@NotNull MethodArgumentNotValidException ex, @NotNull HttpHeaders headers, @NotNull HttpStatusCode status, @NotNull WebRequest request) {
        RestError restError = new RestError(BAD_REQUEST, "validation.error", ex);
        restError.addValidationErrors(ex.getBindingResult().getFieldErrors());
        restError.addValidationError(ex.getBindingResult().getGlobalErrors());
        return buildResponseEntity(restError);
    }


    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(@NotNull HttpMessageNotReadableException ex, @NotNull HttpHeaders headers, @NotNull HttpStatusCode status, @NotNull WebRequest request) {
        String error = "Malformed JSON request";
        return buildResponseEntity(new RestError(HttpStatus.BAD_REQUEST, error, ex));
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotWritable(@NotNull HttpMessageNotWritableException ex, @NotNull HttpHeaders headers, @NotNull HttpStatusCode status, @NotNull WebRequest request) {
        String error = "Error writing JSON output";
        return buildResponseEntity(new RestError(HttpStatus.INTERNAL_SERVER_ERROR, error, ex));
    }

    @Override
    protected ResponseEntity<Object> handleNoHandlerFoundException(@NotNull NoHandlerFoundException ex, @NotNull HttpHeaders headers, @NotNull HttpStatusCode status, @NotNull WebRequest request) {
        RestError restError = new RestError(BAD_REQUEST, ex);
        restError.setDebugMessage(ex.getMessage());
        return buildResponseEntity(restError);
    }

    public abstract ResponseEntity<Object> buildResponseEntity(RestError restError);
}
