package com.wordmaps.service;

import jakarta.annotation.PostConstruct;
import org.jgrapht.Graph;
import org.jgrapht.graph.DefaultEdge;
import org.jgrapht.graph.SimpleGraph;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

@Service
public class GraphService {

    private final Graph<String, DefaultEdge> wordGraph;

    @Autowired
    public GraphService() {
        this.wordGraph = new SimpleGraph<>(DefaultEdge.class);
    }

    @PostConstruct
    public void init() {
        try {
            // Load words of length 3, 4, and 5
            loadWords("words/words-3.txt");
            loadWords("words/words-4.txt");
            loadWords("words/words-5.txt");

            // Build edges
            buildEdges();
        } catch (IOException e) {
            throw new RuntimeException("Failed to load dictionaries", e);
        }
    }

    private void loadWords(String resourcePath) throws IOException {
        ClassPathResource resource = new ClassPathResource(resourcePath);
        if (!resource.exists()) {
            System.out.println("Resource not found: " + resourcePath);
            return;
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()))) {
            String line;
            int count = 0;
            while ((line = reader.readLine()) != null) {
                String word = line.trim().toUpperCase();
                if (!word.isEmpty()) {
                    wordGraph.addVertex(word);
                    count++;
                }
            }
            System.out.println("Loaded " + count + " words from " + resourcePath);
        }
    }

    private void buildEdges() {
        // Optimization: Only compare words of the same length
        Map<Integer, List<String>> wordsByLength = new HashMap<>();

        for (String word : wordGraph.vertexSet()) {
            wordsByLength.computeIfAbsent(word.length(), k -> new ArrayList<>()).add(word);
        }

        for (List<String> words : wordsByLength.values()) {
            for (int i = 0; i < words.size(); i++) {
                for (int j = i + 1; j < words.size(); j++) {
                    String w1 = words.get(i);
                    String w2 = words.get(j);
                    if (differByOne(w1, w2)) {
                        wordGraph.addEdge(w1, w2);
                    }
                }
            }
        }
    }

    private boolean differByOne(String w1, String w2) {
        if (w1.length() != w2.length())
            return false;
        int diff = 0;
        for (int i = 0; i < w1.length(); i++) {
            if (w1.charAt(i) != w2.charAt(i)) {
                diff++;
            }
            if (diff > 1)
                return false;
        }
        return diff == 1;
    }

    public Graph<String, DefaultEdge> getGraph() {
        return wordGraph;
    }

    public boolean wordExists(String word) {
        return wordGraph.containsVertex(word.toUpperCase());
    }

    public Set<DefaultEdge> getEdgesOf(String word) {
        if (!wordExists(word))
            return Collections.emptySet();
        return wordGraph.edgesOf(word.toUpperCase());
    }

    public String getEdgeTarget(String source, DefaultEdge edge) {
        return wordGraph.getEdgeTarget(edge).equals(source)
                ? wordGraph.getEdgeSource(edge) // JGraphT edges are undirected in SimpleGraph usually, but
                                                // getEdgeTarget returns one end.
                : wordGraph.getEdgeTarget(edge); // If target is source, return source (other end). Actually SimpleGraph
                                                 // is undirected.
    }

    public List<String> getNeighbors(String word) {
        String w = word.toUpperCase();
        if (!wordGraph.containsVertex(w))
            return Collections.emptyList();
        return org.jgrapht.Graphs.neighborListOf(wordGraph, w);
    }

    public List<String> findWordsByPattern(String pattern) {
        String regex = pattern.toUpperCase().replace("?", ".");
        java.util.regex.Pattern p = java.util.regex.Pattern.compile(regex);
        return wordGraph.vertexSet().stream()
                .filter(v -> p.matcher(v).matches())
                .limit(50)
                .collect(java.util.stream.Collectors.toList());
    }
}
