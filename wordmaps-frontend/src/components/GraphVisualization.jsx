import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GraphVisualization = ({ route }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!route || !route.path) return;

        // Clear previous SVG
        d3.select(svgRef.current).selectAll("*").remove();

        const width = 1200;
        const height = 600;

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; border-radius: 8px; cursor: move;");

        // Definitions for Glow Filters
        const defs = svg.append("defs");
        const filter = defs.append("filter")
            .attr("id", "glow");
        filter.append("feGaussianBlur")
            .attr("stdDeviation", "2.5")
            .attr("result", "coloredBlur");
        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "coloredBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        // Create a wrapper group for zoom
        const g = svg.append("g");

        // Create nodes and links from route path
        const nodes = route.path.map((id, index) => ({
            id,
            group: index === 0 ? 1 : index === route.path.length - 1 ? 2 : 0
        }));

        const links = route.path.slice(0, -1).map((source, i) => ({
            source,
            target: route.path[i + 1]
        }));

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(140)) // More spacing
            .force("charge", d3.forceManyBody().strength(-1000))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = g.append("g")
            .attr("stroke", "#6b7280") // lighter gray
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", 2);

        const node = g.append("g")
            .attr("stroke-width", 3)
            .selectAll("g")
            .data(nodes)
            .join("g")
            .attr("cursor", "pointer")
            .attr("stroke", d => d.group === 1 ? "#00f3ff" : d.group === 2 ? "#bc13fe" : "#ffffff"); // Border color

        // Node Circles
        node.append("circle")
            .attr("r", 35) // Large nodes for readability
            .attr("fill", d => d.group === 1
                ? "#00f3ff" // Origin: Neon Blue
                : d.group === 2
                    ? "#bc13fe" // Dest: Neon Pink
                    : "#f3f4f6") // Steps: Very Light Gray (Almost White)
            .style("filter", "url(#glow)");

        // Text Labels - HIGH CONTRAST
        node.append("text")
            .attr("x", 0)
            .attr("y", 5)
            .text(d => d.id)
            .attr("text-anchor", "middle")
            .style("font-size", "16px") // Larger text
            .style("fill", "#000000") // ALWAYS BLACK TEXT for best contrast on bright/light nodes
            .style("font-family", "'Courier New', monospace")
            .style("font-weight", "900") // Extra bold
            .style("pointer-events", "none")
            .style("text-transform", "uppercase"); // Ensure readability

        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("transform", d => `translate(${d.x},${d.y})`);
        });

        // Add Zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });

        svg.call(zoom);

        // Add drag behavior
        node.call(d3.drag()
            .on("start", (event, d) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", (event, d) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }));

    }, [route]);

    return (
        <div className="tron-panel p-8 rounded-xl w-full overflow-hidden flex justify-center mt-10 bg-gray-900 relative border border-gray-700">
            <div className="absolute top-4 right-4 text-gray-400 font-mono text-xs opacity-70 pointer-events-none">
                PAN & ZOOM ENABLED [::]
            </div>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default GraphVisualization;
