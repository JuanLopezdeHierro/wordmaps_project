package com.wordmaps.config;

import com.wordmaps.WordMapsApplication;
import org.springframework.cloud.function.adapter.aws.FunctionInvoker;

// Standard Spring Cloud Function handler
// In AWS Lambda console, Handler would be: org.springframework.cloud.function.adapter.aws.FunctionInvoker
// Or if we want a custom one inheriting StreamHandler, but FunctionInvoker is standard for Spring Boot 3+
public class LambdaHandler extends FunctionInvoker {
    // This class acts as an entry point if we needed custom config,
    // but typically Spring Cloud Function manages it via the FunctionInvoker.
    // We keep it here to satisfy the structure demand,
    // and potentially for StreamHandler extension if we weren't using the web
    // adapter.
}
