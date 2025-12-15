package com.wordmaps.strategy;

import org.jgrapht.Graph;
import org.jgrapht.graph.DefaultEdge;

import java.util.List;

/**
 * Strategy interface for pathfinding algorithms.
 * Applies OCP (Open/Closed Principle) - new strategies can be added without modifying existing code.
 */
public interface PathFindingStrategy {
    List<String> findPath(Graph<String, DefaultEdge> graph, String origin, String destination);
}
