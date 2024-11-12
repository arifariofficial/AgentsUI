"use client";

import React, { useCallback, useState } from "react";
import {
	ReactFlow,
	MiniMap,
	Controls,
	Background,
	useNodesState,
	useEdgesState,
	addEdge,
	Panel,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import CustomNode from "./Nodes/customNode";
import SideBar from "./SideBar";
import "./custom-nodes.css";

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = { customNode: CustomNode };

const initialNodes = [
	{
		id: "asd",
		type: "customNode",
		position: { x: 300, y: 100 },
		data: { assigned: { label: "1", customType: "INPUT" } },
	},

	{
		id: "asd2",
		type: "customNode",
		position: { x: 400, y: 200 },
		data: {
			assigned: {
				label: "2",
				customType: "AGENT",
				customName: "something",
				customConfig: { system_prompt: "You are a..." },
			},
		},
	},

	{
		id: "asd3",
		type: "customNode",
		position: { x: 400, y: 300 },
		data: { assigned: { label: "3", customType: "RAG" } },
	},
];
const initialEdges = [{ id: "easd-asd2", source: "asd", target: "asd2" }];

const LLMConfig = [
	{ name: "OLLAMA", model: "13B", config: { temperature: 0.7 } },
	{ name: "GPT", model: "text-davinci-003", config: { temperature: 0.7 } },
];

const Flow = () => {
	const [uniqueID, setUniqueID] = useState(0);
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [modifyFocus, setModifyFocus] = useState(undefined);
	const [sideBarView, setSideBarView] = useState("EMPTY");

	const onConnect = useCallback(
		(params) => setEdges((eds) => addEdge(params, eds)),
		[setEdges]
	);

	const onModify = useCallback(
		(id, data) => {
			if (!id || !data) {
				return;
			}
			const nodeToUpdate = nodes.find((node) => {
				console.log("onModify: ", node.id, id);
				return node.id === id;
			});
			console.log("NODE TO UPDATEx", nodeToUpdate);
			console.log("NODESx", nodes);
			if (nodeToUpdate) {
				setNodes((nds) =>
					nds.map((node) =>
						node.id === nodeToUpdate.id
							? {
									...node,
									data: {
										assigned: data,
										functions: nodeToUpdate.data.functions,
										llm: nodeToUpdate.data.llm,
									},
							  }
							: node
					)
				);
			}
		},
		[nodes, setNodes]
	);

	const onSelectLLM = useCallback(
		(id, selected) => {
			if (!id || !selected) {
				return;
			}
			const nodeToUpdate = nodes.find((node) => {
				console.log("onSelectLLM: ", node.id, id);
				return node.id === id;
			});
			console.log("NODE TO UPDATE", nodeToUpdate);
			console.log("NODES", nodes);
			console.log("SELECTED", selected);
			if (nodeToUpdate) {
				setNodes((nds) =>
					nds.map((node) =>
						node.id === nodeToUpdate.id
							? {
									...node,
									data: {
										assigned: nodeToUpdate.data.assigned,
										functions: nodeToUpdate.data.functions,
										llm: { selected: selected },
									},
							  }
							: node
					)
				);
			}
			setModifyFocus(undefined);
			setSideBarView("EMPTY");
		},
		[nodes, setNodes]
	);

	const onDelete = useCallback(
		(id) => {
			console.log("onDelete", id);
			if (!id) {
				return;
			}
			const nodeToRemove = nodes.find((node) => {
				console.log("onDelete: ", node.id, id);
				return node.id === id;
			});

			if (nodeToRemove) {
				setNodes((nds) => nds.filter((item) => item.id !== nodeToRemove.id));
			}
			setModifyFocus(undefined);
			setSideBarView("EMPTY");
		},
		[nodes, setNodes]
	);

	const test = (d) => {
		console.log("THIS IS A TEST", d);
	};

	const onAdd = useCallback(
		(data) => {
			if (!data) {
				return;
			}
			const uid = uniqueID + 1;
			const id = "" + uid;
			const newNode = {
				id: id,
				type: "customNode",
				data: {
					assigned: data,
					functions: {
						test: test,
						modify: () => {
							setModifyFocus(id);
							setSideBarView("MODIFY-COMPONENT");
						},
						selectLLM: () => {
							setModifyFocus(id);
							setSideBarView("LLM-CONFIGURATION");
						},
					},
					llm: { selected: "Empty" },
				},

				position: {
					x: 500,
					y: 0 + (nodes.length + 1) * 20,
				},
			};
			setNodes((nds) => nds.concat(newNode));
			setUniqueID(uid);
		},
		[nodes.length, setNodes, uniqueID]
	);

	console.log("ASD", nodes);
	return (
		<div style={{ width: "100vw", height: "100vh" }}>
			<div style={{ float: "right", paddingRight: "50px" }}>
				<button style={{ margin: "5px" }} onClick={() => {}}>
					save
				</button>
				<button style={{ margin: "5px" }} onClick={() => {}}>
					build
				</button>
				<button style={{ margin: "5px" }} onClick={() => {}}>
					build all
				</button>
				<button style={{ margin: "5px" }} onClick={() => {}}>
					run
				</button>
			</div>
			<SideBar
				onAdd={onAdd}
				onDelete={onDelete}
				onModify={onModify}
				onSelectLLM={onSelectLLM}
				modifyFocus={modifyFocus}
				view={sideBarView}
				setView={setSideBarView}
				nodes={nodes}
				llmConfigurations={LLMConfig}
			/>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				nodeTypes={nodeTypes}
			>
				<Background variant="dots" gap={12} size={1} />
			</ReactFlow>
		</div>
	);
};

export { Flow };
