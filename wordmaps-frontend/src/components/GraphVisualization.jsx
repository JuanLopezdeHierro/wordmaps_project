import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GraphVisualization = ({ route }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!route || !route.path) return;

        // Clear previous SVG
        d3.select(svgRef.current).selectAll("*").remove();

        const width = 800;
        const height = 400;

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");

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
            .force("charge", d3.forceManyBody().strength(-400))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", 2);

        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("g")
            .data(nodes)
            .join("g");

        node.append("circle")
            .attr("r", 20)
            .attr("fill", d => d.group === 1 ? "#16a34a" : d.group === 2 ? "#2563eb" : "#9ca3af");

        node.append("text")
            .attr("x", 0)
            .attr("y", 4)
            .text(d => d.id)
            .attr("text-anchor", "middle")
            .style("font-size", "10px")
            .style("fill", "white")
            .style("font-family", "monospace")
            .style("font-weight", "bold");

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
        <div className="bg-white p-4 rounded-lg shadow-md mt-6 w-full max-w-4xl overflow-hidden flex justify-center">
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default GraphVisualization;
