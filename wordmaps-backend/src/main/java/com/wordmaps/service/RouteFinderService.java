package com.wordmaps.service;

import com.wordmaps.model.Route;
import com.wordmaps.model.Transformation;
import com.wordmaps.strategy.PathFindingStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

import java.util.List;

@Service
public class RouteFinderService {

    private final GraphService graphService;
    private final PathFindingStrategy defaultStrategy;

    @Autowired
    public RouteFinderService(GraphService graphService,
            @Qualifier("bfsStrategy") PathFindingStrategy defaultStrategy) {
        this.graphService = graphService;
        this.defaultStrategy = defaultStrategy;
    }

    public Route findFastestRoute(String origin, String destination) {
        String from = origin.toUpperCase();
        String to = destination.toUpperCase();

        System.out.println("Finding path from " + from + " to " + to);
        System.out.println("Graph info: V=" + graphService.getGraph().vertexSet().size() + ", E="
                + graphService.getGraph().edgeSet().size());

        if (!graphService.wordExists(from) || !graphService.wordExists(to)) {
            System.out.println("Word existence check failed: " + from + "=" + graphService.wordExists(from) + ", " + to
                    + "=" + graphService.wordExists(to));
            throw new IllegalArgumentException("One or both words do not exist in the dictionary.");
        }

        if (from.length() != to.length()) {
            throw new IllegalArgumentException("Words must be of the same length.");
        }

        System.out.println("Invoking strategy...");
        List<String> path = defaultStrategy.findPath(graphService.getGraph(), from, to);
        System.out.println("Strategy returned: " + path);

        if (path == null) {
            System.out.println("Path was null");
            return null; // or throw Exception
        }

        return Route.builder()
                .origin(from)
                .destination(to)
                .path(path)
                .steps(path.size() - 1)
                .routeType("FASTEST")
                .difficulty(calculateDifficulty(path.size() - 1))
                .transformations(generateTransformations(path))
                .build();
    }

    // Helper methods
    private String calculateDifficulty(int steps) {
        if (steps <= 3)
            return "EASY";
        if (steps <= 6)
            return "MEDIUM";
        return "HARD";
    }

    private List<Transformation> generateTransformations(List<String> path) {
        List<Transformation> transformations = new ArrayList<>();
        for (int i = 0; i < path.size() - 1; i++) {
            String current = path.get(i);
            String next = path.get(i + 1);
            transformations.add(createTransformation(current, next, i + 1));
        }
        return transformations;
    }

    private Transformation createTransformation(String from, String to, int stepNum) {
        for (int i = 0; i < from.length(); i++) {
            if (from.charAt(i) != to.charAt(i)) {
                return Transformation.builder()
                        .from(from)
                        .to(to)
                        .stepNumber(stepNum)
                        .description("Change '" + from.charAt(i) + "' -> '" + to.charAt(i) + "' at position " + (i + 1))
                        .build();
            }
        }
        return null;
    }
}
