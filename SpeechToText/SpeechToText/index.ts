import { IInputs, IOutputs } from "./generated/ManifestTypes";
const two_line_regex = new RegExp('/\n\n/g;');
const one_line_regex = new RegExp('/\n/g;');
const first_char_regex = new RegExp('/\S/;');
export class SpeechToText implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _value: string;

	private _activeButtonText: string =  "Click here and start talking 🎙️";
	private _inactiveButtonText: string = "I'm listening 👂...";

	private _context: ComponentFramework.Context<IInputs>;

	// PCF framework to notify of changes
	private _notifyOutputChanged: () => void;

	// Define Standard container element
	private _container: HTMLDivElement;

	// Define Input Elements
	public _inputText: HTMLTextAreaElement;

	// Define Button Elements
	private _speakNowButton: HTMLButtonElement;

	// Define SpeechRegonition Service
	private _speechRecognition: SpeechRecognition;

	private _refreshData: EventListenerOrEventListenerObject;

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
	 * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {

		// Add control initialization code
		this._context = context;
		this._container = document.createElement("div");
		this._notifyOutputChanged = notifyOutputChanged;
		this._refreshData = this.RefreshData.bind(this);

		// Initialise Value
		
		// Layout Elements
		var divStart = document.createElement("div");
		divStart.setAttribute("class", "record-div");

		var divText = document.createElement("div");
		//divText.setAttribute("class", "input-text");

		// Input Elements
		this._inputText = document.createElement("textarea");
		this._inputText.setAttribute("class", "input-text");
		this._inputText.value = this._value;
		this._inputText.addEventListener("input", this._refreshData);
		this._speakNowButton = document.createElement("button");
		this._speakNowButton.setAttribute("type", "button");
		this._speakNowButton.setAttribute("class", "record-button");
		this._speakNowButton.innerText = this._activeButtonText;
		this._speakNowButton.addEventListener("click", this.StartSpeechRecognition.bind(this));

		// Initialise Speech Recognition
		var typ = typeof SpeechRecognition;
		this._speechRecognition = typ === "undefined" ? new webkitSpeechRecognition() : new SpeechRecognition();
		this._speechRecognition.lang = 'en-US';
		this._speechRecognition.continuous = true;
		this._speechRecognition.interimResults = true;

		// Setup DOM
		divStart.append(this._speakNowButton);
		divText.append(this._inputText);
		this._container.append(divStart);
		this._container.append(divText);

		// Bind to parent container
		container.append(this._container);
	}


	public StartSpeechRecognition() {

		let finalTranscript = '';

		this._speechRecognition.onresult = (event) => {
			for (var i = event.resultIndex; i < event.results.length; ++i) {
				if (event.results[i].isFinal) {
					finalTranscript += event.results[i][0].transcript;
				}
			}
			finalTranscript = finalTranscript.replace(two_line_regex, '<p></p>').replace(one_line_regex, '<br>');;
			this._inputText.value = finalTranscript.replace(first_char_regex, m => { return m.toUpperCase(); });
		};

		this._speechRecognition.onend = () => {
			this.RefreshData();
			this.EnableSpeakNowButton();
		};

		this._speechRecognition.onerror = (e) => {
			if (e.error === 'audio-capture') {
				alert('Failed capturing audio i.e. microphone. Please check console-logs for hints to fix this issue.');
				console.error('No microphone was found. Ensure that a microphone is installed and that microphone settings are configured correctly. https://support.google.com/chrome/bin/answer.py?hl=en&answer=1407892');
				console.error('Original', e.type, e.message.length || e);
				return;
			}

			console.error(e.type, e.error, e.message);
		}

		this._speechRecognition.start();

		this.DisableSpeakNowButton();
	}

	private EnableSpeakNowButton() {
		this._speakNowButton.disabled = false;
		this._speakNowButton.innerText = this._activeButtonText;
	}

	private DisableSpeakNowButton() {
		this._speakNowButton.disabled = true;
		this._speakNowButton.innerText = this._inactiveButtonText;
	}

	public RefreshData() {
		this._value = (this._inputText.value as any) as string;
		this._notifyOutputChanged();
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		// Add code to update control view

		if(context.parameters.textProperty != null){
			this._value = context.parameters.textProperty.raw;
		}

		this._inputText.value = this._value;
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {
			textProperty: this._value
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
	}
}