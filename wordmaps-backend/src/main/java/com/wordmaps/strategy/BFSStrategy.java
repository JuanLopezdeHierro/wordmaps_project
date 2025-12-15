package com.wordmaps.strategy;

import org.jgrapht.Graph;
import org.jgrapht.alg.shortestpath.BFSShortestPath;
import org.jgrapht.graph.DefaultEdge;
import org.springframework.stereotype.Component;

import java.util.List;

@Component("bfsStrategy")
public class BFSStrategy implements PathFindingStrategy {

    @Override
    public List<String> findPath(Graph<String, DefaultEdge> graph, String origin, String destination) {
        BFSShortestPath<String, DefaultEdge> bfs = new BFSShortestPath<>(graph);
        return bfs.getPath(origin, destination).getVertexList();
    }
}
