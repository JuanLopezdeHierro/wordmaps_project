package com.wordmaps.config;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.amazonaws.serverless.exceptions.ContainerInitializationException;
import com.amazonaws.serverless.proxy.model.HttpApiV2ProxyRequest;
import com.amazonaws.serverless.proxy.model.AwsProxyResponse;
import com.amazonaws.serverless.proxy.spring.SpringBootLambdaContainerHandler;
import com.wordmaps.WordMapsApplication;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class LambdaHandler implements RequestStreamHandler {
    private static SpringBootLambdaContainerHandler<HttpApiV2ProxyRequest, AwsProxyResponse> handler;

    static {
        try {
            // Initialize the handler with the main Spring Boot application class
            // Use V2 handler for HTTP API default payload
            handler = SpringBootLambdaContainerHandler.getHttpApiV2ProxyHandler(WordMapsApplication.class);
            // Optimization: Activate SnapStart if available
        } catch (ContainerInitializationException e) {
            // Re-throw the exception to force the Cold Start to fail if something goes
            // wrong
            e.printStackTrace();
            System.err.println("CRITICAL: Failed to initialize Spring Boot application");
            e.printStackTrace(System.err);
            throw new RuntimeException("Could not initialize Spring Boot application", e);
        } catch (Exception e) {
            System.err.println("CRITICAL: Unexpected error during handler initialization");
            e.printStackTrace(System.err);
            throw new RuntimeException("Unexpected initialization error", e);
        }
    }

    @Override
    public void handleRequest(InputStream inputStream, OutputStream outputStream, Context context)
            throws IOException {
        handler.proxyStream(inputStream, outputStream, context);
    }
}
