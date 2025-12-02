import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { TopologyNode, TopologyLink } from '../types';

// Mock Data
const nodesData: TopologyNode[] = [
  { id: "Internet", group: 1, ip: "0.0.0.0" },
  { id: "Firewall-Main", group: 2, ip: "10.0.0.1" },
  { id: "Core-Switch-01", group: 3, ip: "192.168.1.1" },
  { id: "Core-Switch-02", group: 3, ip: "192.168.1.2" },
  { id: "Access-SW-01", group: 4, ip: "192.168.2.10" },
  { id: "Access-SW-02", group: 4, ip: "192.168.2.11" },
  { id: "Server-Farm", group: 5, ip: "192.168.10.x" },
  { id: "Wifi-Controller", group: 5, ip: "192.168.1.5" },
];

const linksData: TopologyLink[] = [
  { source: "Internet", target: "Firewall-Main", value: 1 },
  { source: "Firewall-Main", target: "Core-Switch-01", value: 5 },
  { source: "Firewall-Main", target: "Core-Switch-02", value: 5 },
  { source: "Core-Switch-01", target: "Core-Switch-02", value: 10 },
  { source: "Core-Switch-01", target: "Access-SW-01", value: 2 },
  { source: "Core-Switch-02", target: "Access-SW-02", value: 2 },
  { source: "Core-Switch-01", target: "Server-Farm", value: 5 },
  { source: "Core-Switch-02", target: "Wifi-Controller", value: 3 },
];

const Topology: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 600;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .style("width", "100%")
      .style("height", "100%")
      .style("background-color", "#111827"); // bg-gray-900

    const simulation = d3.forceSimulation(nodesData as any)
      .force("link", d3.forceLink(linksData).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#4b5563")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(linksData)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value) * 2);

    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodesData)
      .join("circle")
      .attr("r", 15)
      .attr("fill", (d) => {
        if (d.group === 1) return "#f87171"; // Red - Internet
        if (d.group === 2) return "#fb923c"; // Orange - FW
        if (d.group === 3) return "#3b82f6"; // Blue - Core
        if (d.group === 4) return "#34d399"; // Green - Access
        return "#a78bfa"; // Purple - Servers
      })
      .call(drag(simulation) as any)
      .on("click", (event, d) => {
         setSelectedNode(d as TopologyNode);
      });

    const labels = svg.append("g")
        .selectAll("text")
        .data(nodesData)
        .enter()
        .append("text")
        .text(d => d.id)
        .attr("font-size", "10px")
        .attr("fill", "#d1d5db")
        .attr("dx", 18)
        .attr("dy", 4);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
      
      labels
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    function drag(simulation: any) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
  }, []);

  return (
    <div className="flex h-full gap-4">
      <div className="flex-1 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden relative">
        <div className="absolute top-4 left-4 z-10 bg-black/50 p-2 rounded text-xs text-gray-300">
            <p>Interactive Topology Map</p>
            <p className="text-gray-500">Drag nodes to rearrange</p>
        </div>
        <svg ref={svgRef} className="w-full h-full cursor-move"></svg>
      </div>
      
      {/* Node Details Panel */}
      {selectedNode && (
        <div className="w-72 bg-gray-900 border border-gray-800 rounded-lg p-4 animate-in slide-in-from-right duration-300">
          <h3 className="text-lg font-bold text-white mb-4">Device Details</h3>
          <div className="space-y-3">
             <div>
                <label className="text-xs text-gray-500 block">Hostname</label>
                <div className="text-white font-mono">{selectedNode.id}</div>
             </div>
             <div>
                <label className="text-xs text-gray-500 block">IP Address</label>
                <div className="text-blue-400 font-mono">{selectedNode.ip}</div>
             </div>
             <div>
                <label className="text-xs text-gray-500 block">Group ID</label>
                <div className="text-gray-300">{selectedNode.group}</div>
             </div>
             <div className="pt-4 border-t border-gray-800">
                <button 
                    onClick={() => alert(`Connecting via SSH to ${selectedNode.ip}...`)}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded text-sm mb-2"
                >
                    SSH Connect
                </button>
                <button 
                    onClick={() => alert(`Fetching real-time logs for ${selectedNode.id}...`)}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded text-sm border border-gray-600"
                >
                    View Logs
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topology;