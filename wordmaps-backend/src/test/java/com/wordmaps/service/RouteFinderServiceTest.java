package com.wordmaps.service;

import com.wordmaps.model.Route;
import com.wordmaps.strategy.PathFindingStrategy;
import org.jgrapht.Graph;
import org.jgrapht.graph.DefaultEdge;
import org.jgrapht.graph.SimpleGraph;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

class RouteFinderServiceTest {

    @Mock
    private GraphService graphService;

    @Mock
    private PathFindingStrategy bfsStrategy;

    private RouteFinderService routeFinderService;
    private Graph<String, DefaultEdge> mockGraph;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        routeFinderService = new RouteFinderService(graphService, bfsStrategy);
        mockGraph = new SimpleGraph<>(DefaultEdge.class);
    }

    @Test
    void testFindFastestRoute_Success() {
        // Setup mocks
        when(graphService.wordExists("CAT")).thenReturn(true);
        when(graphService.wordExists("DOG")).thenReturn(true);
        when(graphService.getGraph()).thenReturn(mockGraph);

        List<String> path = Arrays.asList("CAT", "COT", "COG", "DOG");
        when(bfsStrategy.findPath(any(), eq("CAT"), eq("DOG"))).thenReturn(path);

        // Execute
        Route route = routeFinderService.findFastestRoute("CAT", "DOG");

        // Verify
        assertNotNull(route);
        assertEquals("CAT", route.getOrigin());
        assertEquals("DOG", route.getDestination());
        assertEquals(3, route.getSteps());
        assertEquals("FASTEST", route.getRouteType());
        assertEquals("EASY", route.getDifficulty()); // 3 steps is EASY
        assertNotNull(route.getTransformations());
        assertEquals(3, route.getTransformations().size());
    }

    @Test
    void testFindFastestRoute_WordNotFound() {
        when(graphService.wordExists("CAT")).thenReturn(true);
        when(graphService.wordExists("UNKNOWN")).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> routeFinderService.findFastestRoute("CAT", "UNKNOWN"));
    }

    @Test
    void testFindFastestRoute_DifferentLengths() {
        when(graphService.wordExists("CAT")).thenReturn(true);
        when(graphService.wordExists("WORD")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> routeFinderService.findFastestRoute("CAT", "WORD"));
    }

    @Test
    void testFindFastestRoute_NoPath() {
        when(graphService.wordExists("CAT")).thenReturn(true);
        when(graphService.wordExists("DOG")).thenReturn(true);
        when(graphService.getGraph()).thenReturn(mockGraph);
        when(bfsStrategy.findPath(any(), any(), any())).thenReturn(null);

        Route route = routeFinderService.findFastestRoute("CAT", "DOG");
        assertNull(route);
    }
}
