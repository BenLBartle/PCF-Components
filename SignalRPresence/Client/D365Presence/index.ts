import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as signalR from "@aspnet/signalr";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { D365Facepile } from './Presence'

export class D365Presence implements ComponentFramework.StandardControl<IInputs, IOutputs> {


	// Define Standard container element
	private _container: HTMLDivElement;

	private _messagesList: HTMLUListElement;

	private notifyOutputChanged: () => void;
	// Reference to the container div
	private theContainer: HTMLDivElement;
	// Reference to the React props, prepopulated with a bound event handler
	/**
* Called by the React component when it detects a change in the number of faces shown
* @param newValue The newly detected number of faces
*/

	/**
	 * Empty constructor.
	 */
	constructor() {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		// Add control initialization code
		// this._container = document.createElement("div");
		// this._messagesList = document.createElement("ul");
		// this._messagesList.id = "messagesList";
		// this._container.append(this._messagesList);

		// container.append(this._container);

		this.notifyOutputChanged = notifyOutputChanged;
		this.theContainer = container;
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		// Add code to update control view
		// var connection = new signalR.HubConnectionBuilder().withUrl("http://localhost:5080/d365Hub/?UserId=Ben" + this.makeid(5) + "&RecordId=1").build();

		// //Disable send button until connection is established

		// connection.on("UserConnected", user => {
		// 	var encodedMsg = user + " connected";
		// 	var li = document.createElement("li");
		// 	li.textContent = encodedMsg;
		// 	this._messagesList.appendChild(li);
		// });

		// connection.on("UserDisconnected", user => {
		// 	var encodedMsg = user + " disconnected";
		// 	var li = document.createElement("li");
		// 	li.textContent = encodedMsg;
		// 	this._messagesList.appendChild(li);
		// });

		// connection.start();
		//if (context.updatedProperties.includes("numberOfFaces")) this.props.numberOfFaces = context.parameters.numberOfFaces.raw || 3;

		// Render the React component into the div container
		ReactDOM.render(
		  // Create the React component
		  React.createElement(
			D365Facepile, // the class type of the React component found in Facepile.tsx
			{
				personas: []
			}
		  ),
		  this.theContainer
		);

	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
	}

	

}