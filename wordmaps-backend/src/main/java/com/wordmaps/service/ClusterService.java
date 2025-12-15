package com.wordmaps.service;

import org.jgrapht.Graph;
import org.jgrapht.alg.clustering.LabelPropagationClustering;
import org.jgrapht.alg.connectivity.ConnectivityInspector;
import org.jgrapht.alg.interfaces.ClusteringAlgorithm;

import org.jgrapht.graph.DefaultEdge;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ClusterService {

    private final GraphService graphService;

    @Autowired
    public ClusterService(GraphService graphService) {
        this.graphService = graphService;
    }

    public Map<String, Object> getGraphStats() {
        Graph<String, DefaultEdge> graph = graphService.getGraph();
        Map<String, Object> stats = new HashMap<>();
        stats.put("vertexCount", graph.vertexSet().size());
        stats.put("edgeCount", graph.edgeSet().size());

        // Connectivity
        ConnectivityInspector<String, DefaultEdge> inspector = new ConnectivityInspector<>(graph);
        stats.put("connectedComponents", inspector.connectedSets().size());

        return stats;
    }

    public List<String> getIsolatedNodes() {
        Graph<String, DefaultEdge> graph = graphService.getGraph();
        return graph.vertexSet().stream()
                .filter(v -> graph.degreeOf(v) == 0)
                .collect(Collectors.toList());
    }

    public List<String> getTopConnectedNodes(int limit) {
        Graph<String, DefaultEdge> graph = graphService.getGraph();
        return graph.vertexSet().stream()
                .sorted((v1, v2) -> Integer.compare(graph.degreeOf(v2), graph.degreeOf(v1)))
                .limit(limit)
                .collect(Collectors.toList());
    }

    public ClusteringAlgorithm.Clustering<String> detectCommunities() {
        Graph<String, DefaultEdge> graph = graphService.getGraph();
        LabelPropagationClustering<String, DefaultEdge> alg = new LabelPropagationClustering<>(graph);
        return alg.getClustering();
    }
}
