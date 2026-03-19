import { ItemView, Workspace, WorkspaceLeaf } from "obsidian";
import Timer from "timer";
import type { TimeUpdateHandler } from "types";

export const PLUGIN_CUSTOM_VIEW_ID = "better-pomodoro-view";

export class CustomView extends ItemView {
	private timer: Timer;

	constructor(leaf: WorkspaceLeaf, timer: Timer) {
		super(leaf);
		this.timer = timer;
		this.containerEl.empty();

		// TODO: see if you can remove all these classes
		var timeDisplayContainer = this.containerEl.createDiv({
			cls: "timer-view-container",
		});
		var svgContainer = timeDisplayContainer.createDiv({
			cls: "svg-container",
		});

		svgContainer.innerHTML = `
			<svg xmlns="http://www.w3.org/2000/svg">
			  <circle id="circle1" cx="70" cy="70" r="70" stroke-width="2" />
			  <circle id="circle2" cx="70" cy="70" r="60" stroke-width="8" />
			</svg>
		`;

		var buttonContainer = this.containerEl.createDiv({
			cls: "button-container",
		});

		let HFTimeLeft = timer.getTimeLeft().HFTime;
		var timeContainer = timeDisplayContainer.createSpan({
			text: HFTimeLeft,
			cls: "time-container",
		});

		var toggleButton = buttonContainer.createEl("button", {
			text: "toggle",
			cls: "toggle-button",
		});
		toggleButton.addEventListener("click", () => {
			this.timer.toggle();
		});

		var resetButton = buttonContainer.createEl("button", {
			text: "reset",
			cls: "reset-button",
		});
		resetButton.addEventListener("click", () => {
			this.timer.reset();
		});

		let updateHFTime: TimeUpdateHandler = (HFTime: string) => {
			timeContainer.innerText = HFTime;
		};

		this.timer.registerTimeUpdateHandler(updateHFTime);
	}

	getViewType() {
		return PLUGIN_CUSTOM_VIEW_ID;
	}

	getDisplayText() {
		return "Pomodoro View";
	}

	// TODO: does it make sense to keep the func in the class?
	async activate(workspace: Workspace) {
		var leaf: WorkspaceLeaf;
		const leaves = workspace.getLeavesOfType(PLUGIN_CUSTOM_VIEW_ID);

		// TODO: fix the type errors
		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getRightLeaf(false);
			await leaf.setViewState({
				type: PLUGIN_CUSTOM_VIEW_ID,
				active: true,
			});
		}

		workspace.revealLeaf(leaf);
	}

	async onClose() {
		// TODO: add clean up logic
	}
}
