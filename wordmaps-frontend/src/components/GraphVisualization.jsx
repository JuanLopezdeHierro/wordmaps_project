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
            .attr("style", "max-width: 100%; height: auto; border-radius: 8px;");

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
            .force("link", d3.forceLink(links).id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-500))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = svg.append("g")
            .attr("stroke", "#4b5563") // gray-600
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", 2);

        const node = svg.append("g")
            .attr("stroke", "#0a0b1e") // dark-bg
            .attr("stroke-width", 2)
            .selectAll("g")
            .data(nodes)
            .join("g")
            .attr("cursor", "pointer");

        // Node Circles with Glow
        node.append("circle")
            .attr("r", 25)
            .attr("fill", d => d.group === 1 ? "#00f3ff" : d.group === 2 ? "#bc13fe" : "#1f2937") // neon-blue, neon-pink, or dark-gray
            .attr("stroke", d => d.group === 1 ? "#00f3ff" : d.group === 2 ? "#bc13fe" : "#00f3ff")
            .attr("stroke-width", 2)
            .style("filter", "url(#glow)");

        // Text Labels
        node.append("text")
            .attr("x", 0)
            .attr("y", 5)
            .text(d => d.id)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", d => d.group === 0 ? "#00f3ff" : "#0a0b1e") // Cyan text on dark nodes, Dark text on colored nodes
            .style("font-family", "'Courier New', monospace")
            .style("font-weight", "bold")
            .style("pointer-events", "none");

        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("transform", d => `translate(${d.x},${d.y})`);
        });

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
        <div className="tron-panel p-8 rounded-xl w-full overflow-hidden flex justify-center mt-10 bg-dark-bg/90">
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default GraphVisualization;
