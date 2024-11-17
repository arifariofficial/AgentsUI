"use client";
import React, { useState } from "react";
import { Panel } from "@xyflow/react";
import RAG from "../Components/RAG";
import Agent from "../Components/Agent";
import Modify from "../Components/Modify";
import { LLMConfiguration } from "../Components/LLMConfiguration";
import "./index.css";
export default function SideBar({
	onAdd,
	onDelete,
	onModify,
	onSelectLLM,
	nodes,
	modifyFocus,
	view,
	setView,
	llmConfigurations,
}) {
	const [selectedType, setSelectedType] = useState(undefined);

	const showComponentCreationView = () => {
		const ComponentSelection = () => (
			<div>
				<h2>Agent Type:</h2>
				<select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
					<option value="">Select an option</option>

					<option value="Agent">Agent</option>
					<option value="RAG">RAG</option>
				</select>
			</div>
		);
		switch (selectedType) {
			case "RAG":
				return (
					<div>
						<ComponentSelection />
						<RAG onAdd={onAdd} />
					</div>
				);
			case "Agent":
				return (
					<div>
						<ComponentSelection />
						<Agent onAdd={onAdd} />
					</div>
				);
			default:
				return (
					<div>
						<ComponentSelection />
					</div>
				);
		}
	};

	const showComponentModifyView = () => {
		if (modifyFocus) {
			return (
				<Modify
					onDelete={onDelete}
					onModify={onModify}
					nodes={nodes}
					modifyFocus={modifyFocus}
				/>
			);
		}
		return null;
	};

	const showLLMConfigurationView = () => {
		return (
			<LLMConfiguration
				onSelectLLM={onSelectLLM}
				id={modifyFocus}
				llmConfigurations={llmConfigurations}
			/>
		);
	};

	const typeSettings = () => {
		switch (view) {
			case "CREATE-COMPONENT":
				return showComponentCreationView();
			case "MODIFY-COMPONENT":
				return showComponentModifyView();
			case "LLM-CONFIGURATION":
				return showLLMConfigurationView();
			case "LLM-CONFIGURATIONS":
				return <div>{JSON.stringify(llmConfigurations)}</div>;
			default:
				return null;
		}
	};
	//console.log(view);
	return (
		<div className="nav-menu active">
			<div className="nav-view-selection">
				<button onClick={() => setView("CREATE-COMPONENT")}>Create Component</button>
				<button onClick={() => setView("LLM-CONFIGURATIONS")}>LLM Configuration</button>

				<div>{typeSettings()}</div>
			</div>
		</div>
	);
}
