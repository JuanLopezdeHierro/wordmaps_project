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

        // Definitions for Glow Filters (Subtler for light mode)
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
            .force("link", d3.forceLink(links).id(d => d.id).distance(120))
            .force("charge", d3.forceManyBody().strength(-800))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = g.append("g")
            .attr("stroke", "#cbd5e1") // Slate-300 (Light Gray)
            .attr("stroke-opacity", 0.8)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", 2);

        const node = g.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 3)
            .selectAll("g")
            .data(nodes)
            .join("g")
            .attr("cursor", "pointer");

        // Node Circles
        node.append("circle")
            .attr("r", 32)
            .attr("fill", d => d.group === 1
                ? "#0ea5e9" // Neon Blue (Sky 500)
                : d.group === 2
                    ? "#d946ef" // Neon Pink (Fuchsia 500)
                    : "#ffffff") // White for steps
            .attr("stroke", d => d.group === 1 ? "#38bdf8" : d.group === 2 ? "#e879f9" : "#94a3b8") // Lighter borders or Slate-400
            .attr("stroke-width", d => d.group === 0 ? 2 : 0)
            .style("filter", d => d.group !== 0 ? "url(#glow)" : "none");

        // Text Labels
        node.append("text")
            .attr("x", 0)
            .attr("y", 5)
            .text(d => d.id)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("fill", d => beginPath(d))
            .style("font-family", "'Share Tech Mono', monospace")
            .style("font-weight", "bold")
            .style("pointer-events", "none");

        function beginPath(d) {
            // White text on colored nodes, Dark text on white nodes
            return (d.group === 1 || d.group === 2) ? "#ffffff" : "#0f172a";
        }

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
        <div className="tron-panel p-4 rounded-xl w-full overflow-hidden flex justify-center mt-10 bg-white/50 border border-gray-200 shadow-sm relative">
            <div className="absolute top-4 right-4 text-gray-400 font-mono text-xs opacity-70 pointer-events-none flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400"></span> LIVE
            </div>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default GraphVisualization;
