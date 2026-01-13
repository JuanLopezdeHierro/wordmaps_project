package com.wordmaps.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class GraphServiceTest {

    @Autowired
    private GraphService graphService;

    @Test
    void testGraphInitialization() {
        assertNotNull(graphService.getGraph());
        assertFalse(graphService.getGraph().vertexSet().isEmpty(), "Graph should not be empty after init");
    }

    @Test
    void testWordExists() {
        assertTrue(graphService.wordExists("CAT"));
        assertTrue(graphService.wordExists("cat")); // Case insensitive check
        assertFalse(graphService.wordExists("XYZ123"));
    }

    @Test
    void testConnectivity() {
        // Known connection: CAT -> COT
        assertTrue(graphService.getGraph().containsEdge("CAT", "COT") ||
                graphService.getGraph().containsEdge("COT", "CAT"));

        // No connection: CAT -> DOG (needs steps)
        assertFalse(graphService.getGraph().containsEdge("CAT", "DOG"));
    }
}
