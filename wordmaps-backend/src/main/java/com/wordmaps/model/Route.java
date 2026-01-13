package com.wordmaps.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Route {
    private String origin;
    private String destination;
    private List<String> path;
    private int steps;
    private String routeType; // FASTEST, ALTERNATIVE
    private String difficulty; // EASY, MEDIUM, HARD
    private List<Transformation> transformations;
}
