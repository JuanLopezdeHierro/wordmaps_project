package com.wordmaps.controller;

import com.wordmaps.model.Route;
import com.wordmaps.service.ClusterService;
import com.wordmaps.service.GraphService;
import com.wordmaps.service.RouteFinderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allow requests from React frontend
public class RouteController {

    private final RouteFinderService routeFinderService;
    private final ClusterService clusterService;
    private final GraphService graphService;

    @Autowired
    public RouteController(RouteFinderService routeFinderService,
            ClusterService clusterService,
            GraphService graphService) {
        this.routeFinderService = routeFinderService;
        this.clusterService = clusterService;
        this.graphService = graphService;
    }

    @GetMapping("/routes/fastest")
    public ResponseEntity<?> getFastestRoute(@RequestParam String origin,
            @RequestParam String destination) {
        try {
            Route route = routeFinderService.findFastestRoute(origin, destination);
            if (route == null)
                return ResponseEntity.notFound().build();
            return ResponseEntity.ok(route);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/graph/stats")
    public ResponseEntity<Map<String, Object>> getGraphStats() {
        return ResponseEntity.ok(clusterService.getGraphStats());
    }

    @GetMapping("/graph/top-connected")
    public ResponseEntity<List<String>> getTopConnected(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(clusterService.getTopConnectedNodes(limit));
    }

    @GetMapping("/graph/isolated")
    public ResponseEntity<List<String>> getIsolated() {
        return ResponseEntity.ok(clusterService.getIsolatedNodes());
    }

    @GetMapping("/words/{word}/exists")
    public ResponseEntity<Boolean> checkWord(@PathVariable String word) {
        return ResponseEntity.ok(graphService.wordExists(word));
    }

    @GetMapping("/words/{word}/neighbors")
    public ResponseEntity<List<String>> getNeighbors(@PathVariable String word) {
        return ResponseEntity.ok(graphService.getNeighbors(word));
    }

    @GetMapping("/words/search")
    public ResponseEntity<List<String>> searchWords(@RequestParam String pattern) {
        return ResponseEntity.ok(graphService.findWordsByPattern(pattern));
    }
}
