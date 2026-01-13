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
        // Optimization: Use buckets for O(N * L) complexity instead of O(N^2)
        // Group words by their "wildcard" patterns.
        // Example: "CAT" -> "?AT", "C?T", "CA?"
        // Words sharing a wildcard pattern are connected.

        Map<String, List<String>> buckets = new HashMap<>();

        // 1. Fill buckets
        for (String word : wordGraph.vertexSet()) {
            char[] chars = word.toCharArray();
            for (int i = 0; i < chars.length; i++) {
                char original = chars[i];
                chars[i] = '?';
                String pattern = new String(chars);
                buckets.computeIfAbsent(pattern, k -> new ArrayList<>()).add(word);
                chars[i] = original; // Restore for next iteration
            }
        }

        // 2. Connect words within each bucket
        for (List<String> bucket : buckets.values()) {
            for (int i = 0; i < bucket.size(); i++) {
                for (int j = i + 1; j < bucket.size(); j++) {
                    String w1 = bucket.get(i);
                    String w2 = bucket.get(j);
                    // Since they share a pattern like "?AT", they are guaranteed to differ by
                    // exactly one letter (the '?')
                    // UNLESS they are duplicates (which shouldn't happen in a Set) or differ in the
                    // wildcard position significantly?
                    // Actually, if they share "?AT", w1 might be BAT and w2 might be CAT. They
                    // differ by B vs C. One diff. Correct.
                    // If pattern is "CA?", w1=CAT, w2=CAB. Diff is T vs B. One diff. Correct.
                    // We just need to ensure edges are unique, but SimpleGraph handles that
                    // gracefully (idempotent addEdge).

                    wordGraph.addEdge(w1, w2);
                }
            }
        }

        System.out.println("Edges built: " + wordGraph.edgeSet().size());
    }

    // Removed differByOne as it is no longer needed for the optimized build process

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
        if (pattern == null || pattern.trim().isEmpty()) {
            return Collections.emptyList();
        }
        try {
            // Fix: Decode URL parameters manualy as sometimes they arrive encoded (e.g. %3F
            // for ?)
            String decoded = java.net.URLDecoder.decode(pattern.trim(), java.nio.charset.StandardCharsets.UTF_8);

            // Support ? for single char and * for any sequence
            String regex = decoded.toUpperCase()
                    .replace("?", ".")
                    .replace("*", ".*");

            System.out.println(
                    "DEBUG: Incoming pattern='" + pattern + "', Decoded='" + decoded + "', Regex='" + regex + "'");

            java.util.regex.Pattern p = java.util.regex.Pattern.compile(regex);

            // Diagnostic check
            boolean matchesFat = p.matcher("FAT").matches();
            System.out.println("DEBUG: Testing 'FAT' against regex: " + matchesFat);
            System.out.println("DEBUG: Graph Vertex Set size: " + wordGraph.vertexSet().size());

            return wordGraph.vertexSet().stream()
                    .filter(v -> p.matcher(v).matches())
                    .sorted()
                    .limit(50)
                    .collect(java.util.stream.Collectors.toList());
        } catch (Exception e) {
            System.err.println("Invalid pattern: " + pattern);
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}
