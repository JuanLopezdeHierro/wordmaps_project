package com.wordmaps.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transformation {
    private String from;
    private String to;
    private int stepNumber;
    private String description; // e.g., "Change 'A' -> 'O' at position 2"
}
