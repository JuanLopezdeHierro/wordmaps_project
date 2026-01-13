package com.wordmaps.controller;

import com.wordmaps.model.Route;
import com.wordmaps.service.ClusterService;
import com.wordmaps.service.GraphService;
import com.wordmaps.service.RouteFinderService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RouteController.class)
class RouteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RouteFinderService routeFinderService;

    @MockBean
    private ClusterService clusterService;

    @MockBean
    private GraphService graphService;

    @Test
    void testGetFastestRoute_Success() throws Exception {
        Route mockRoute = Route.builder()
                .origin("CAT")
                .destination("DOG")
                .path(Arrays.asList("CAT", "COT", "COG", "DOG"))
                .steps(3)
                .routeType("FASTEST")
                .difficulty("EASY")
                .build();

        when(routeFinderService.findFastestRoute("CAT", "DOG")).thenReturn(mockRoute);

        mockMvc.perform(get("/api/routes/fastest")
                .param("origin", "CAT")
                .param("destination", "DOG"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.origin").value("CAT"))
                .andExpect(jsonPath("$.destination").value("DOG"))
                .andExpect(jsonPath("$.steps").value(3));
    }

    @Test
    void testGetFastestRoute_NotFound() throws Exception {
        when(routeFinderService.findFastestRoute(anyString(), anyString())).thenReturn(null);

        mockMvc.perform(get("/api/routes/fastest")
                .param("origin", "CAT")
                .param("destination", "XZY"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCheckWord_Exists() throws Exception {
        when(graphService.wordExists("CAT")).thenReturn(true);

        mockMvc.perform(get("/api/words/CAT/exists"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(true));
    }
}
