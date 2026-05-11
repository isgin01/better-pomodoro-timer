import { ItemView, setIcon, WorkspaceLeaf } from "obsidian";
import Timer, { TimeUpdateHandler } from "./timer";

export const PLUGIN_CUSTOM_VIEW_ID = "better-pomodoro-view";

export class CustomView extends ItemView {
	private timer: Timer;
	private toggleBtn: HTMLButtonElement;
	private resetBtn: HTMLButtonElement;

	constructor(leaf: WorkspaceLeaf, timer: Timer) {
		super(leaf);
		this.timer = timer;
		this.containerEl.empty();
		this.icon = 'timer'

		var container = this.containerEl.createDiv({ cls: "custom-view-container" });
		var animationContainer = container.createDiv({ cls: "animation-container" });
		var svg = animationContainer.createSvg("svg");
		var circle1 = svg.createSvg("circle", { attr: { id: "circle1", cx: 70, cy: 70, r: 70, "stroke-width": 2 } });
		var circle2 = svg.createSvg("circle", { attr: { id: "circle2", cx: 70, cy: 70, r: 60, "stroke-width": 8 } });
		var timeContainer = container.createSpan({ cls: "time-container" });
		timeContainer.innerHTML = timer.getTimeLeft().HFTime;
		var btnContainer = container.createDiv({ cls: "btn-container" });
		this.toggleBtn = btnContainer.createEl("button", { text: "Toggle", cls: "toggle" });
		this.resetBtn = btnContainer.createEl("button", { text: "Reset", cls: "reset" });

		this.toggleBtn.addEventListener("click", () => {
			this.timer.toggle();
			this.TODO()
		});
		this.TODO()

		this.resetBtn.addEventListener("click", () => {
			this.timer.reset();
			this.TODO()
		});
		setIcon(this.resetBtn, "reset")

		let updateHFTime: TimeUpdateHandler = (HFTime: string) => {
			timeContainer.innerText = HFTime;
		};

		this.timer.registerTimeUpdateHandler(updateHFTime);
	}

	// TODO: it needs to be updated when the timer stops by itself
	TODO() {
		if (this.timer.isRunning) {
			setIcon(this.toggleBtn, "pause")
		} else {
			setIcon(this.toggleBtn, "play")

		}
	}

	getViewType() {
		return PLUGIN_CUSTOM_VIEW_ID;
	}

	getDisplayText() {
		return "Pomodoro View";
	}

	async onClose() {
		// TODO:
	}
}
