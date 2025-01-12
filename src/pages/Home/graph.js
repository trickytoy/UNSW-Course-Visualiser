import React, { useState } from "react";
import Graph from "react-graph-vis";
import courseData from "../../data/scraped_courses.json";
import dbDatav2 from "../../data/neo4j_output_v2.json";
import dbData from "../../data/neo4j_output.json";
import transformCourseData from "../../utils/transformCourseData";
import retrievingDB from "../../utils/retrievingDB";
import VisGraph, {
    GraphData,
    GraphEvents,
    Options,
  } from 'react-vis-graph-wrapper';

export default function GraphView() {
    const { nodes, edges } = retrievingDB(dbDatav2);
    const [selectedNode, setSelectedNode] = useState(null);

    const graph =  { nodes, edges };

    const options = {
        layout: {
            improvedLayout: true,
            clusterThreshold: 150,
            hierarchical: {
                enabled: true,
            },
        },
        nodes: {
            borderWidth: 2,
            borderWidthSelected: 4,
            shape: "box", // Rectangle shape
            margin: 10,
            font: { size: 14 },
            color: {
                border: "#6C63FF", // Default border color
                background: "#ffffff", // Default background color
            },
        },
        edges: {
            smooth: {
                type: "cubicBezier",
            },
            color: {
                color: "#B0BEC5",
                highlight: "#FFC107",
                hover: "#FF6F00",
            },
            arrows: {
                to: { enabled: true, scaleFactor: 1.2 },
            },
        },
        interaction: {
            hover: true,
            hoverConnectedEdges: true,
            zoomView: true,
            dragView: true,
            multiselect: true,
            selectConnectedEdges: true,
            navigationButtons: true,
        },
        physics: {
            enabled: true, // Disable physics for cleaner hierarchical layout
            hierarchicalRepulsion: {
                centralGravity: 0.0,
                springLength: 100,
                springConstant: 0.01,
                nodeDistance: 120,
                damping: 0.09,
                avoidOverlap: 0
              },
        },
        height: "900px",
    };

    const events = {
        select: function (event) {
            const { nodes } = event;
            if (nodes.length > 0) {
                const selected = graph.nodes.find((node) => node.id === nodes[0]);
                setSelectedNode(selected);
            } else {
                setSelectedNode(null);
            }
        },
    };


    return (
        <div style={{ position: "relative" }}>
            <VisGraph
                graph={graph}
                options={options}
                events={events}
                getNetwork={(network) => {
                    console.log(network);
                }}
            />

            {selectedNode && (
                <div
                    style={{
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        width: "300px",
                        backgroundColor: "#FFF",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "15px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <a href={`https://www.handbook.unsw.edu.au/undergraduate/courses/2025/${selectedNode.label}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                        <h3 style={{ marginTop: "0", color: "#6C63FF" }}>
                            {selectedNode.label} - {selectedNode.title}
                        </h3>
                    </a>
                    <p2 style={{ marginTop: "0", color: "#6C63FF", }}>{selectedNode.Description}</p2>
                    <p dangerouslySetInnerHTML={{ __html: selectedNode.desc }}></p>
                </div>
            )}
        </div>
    );
}
