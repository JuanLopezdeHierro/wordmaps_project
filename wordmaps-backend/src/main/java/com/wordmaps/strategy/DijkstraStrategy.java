package com.wordmaps.strategy;

import org.jgrapht.Graph;
import org.jgrapht.alg.shortestpath.DijkstraShortestPath;
import org.jgrapht.graph.DefaultEdge;
import org.springframework.stereotype.Component;

import java.util.List;

@Component("dijkstraStrategy")
public class DijkstraStrategy implements PathFindingStrategy {

    @Override
    public List<String> findPath(Graph<String, DefaultEdge> graph, String origin, String destination) {
        DijkstraShortestPath<String, DefaultEdge> dijkstra = new DijkstraShortestPath<>(graph);
        return dijkstra.getPath(origin, destination).getVertexList();
    }
}
