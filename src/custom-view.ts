import { ItemView, setIcon, WorkspaceLeaf } from "obsidian"
import { type Timer } from "./timer"

export const PLUGIN_CUSTOM_VIEW_ID = "better-pomodoro-view"

export class CustomView extends ItemView {
	private timer: Timer
	private toggleBtn: HTMLButtonElement
	private resetBtn: HTMLButtonElement
	private switchBtn: HTMLButtonElement
	private TODOCircle: SVGCircleElement

	constructor(leaf: WorkspaceLeaf, timer: Timer) {
		super(leaf)
		this.timer = timer
		this.containerEl.empty()
		this.icon = "timer"

		var container = this.containerEl.createDiv({
			cls: "custom-view-container",
		})
		var animationContainer = container.createDiv({
			cls: "animation-container",
		})
		var svg = animationContainer.createSvg("svg")
		// TODO: give the circles better names
		var circle1 = svg.createSvg("circle", {
			attr: { id: "circle1", cx: 70, cy: 70, r: 70, "stroke-width": 2 },
		})
		this.TODOCircle = svg.createSvg("circle", {
			attr: { id: "circle3", cx: 70, cy: 70, r: 60, "stroke-width": 8 },
		})
		this.setTODO()
		var circle2 = svg.createSvg("circle", {
			attr: { id: "circle2", cx: 70, cy: 70, r: 60, "stroke-width": 8 },
		})

		// TODO: work/break text
		// TODO: hover and click effects
		var timeContainer = container.createSpan({ cls: "time-container" })
		timeContainer.innerHTML = timer.getTimeLeft().HFTime
		var btnContainer = container.createDiv({ cls: "btn-container" })
		this.toggleBtn = btnContainer.createEl("button", {
			text: "Toggle",
			cls: "toggle",
		})
		this.resetBtn = btnContainer.createEl("button", {
			text: "Reset",
			cls: "reset",
		})
		this.switchBtn = btnContainer.createEl("button", {
			text: "Switch",
			cls: "switch",
		})

		this.toggleBtn.addEventListener("click", () => {
			this.timer.toggle()
			this.TODO()
		})
		this.TODO()

		this.resetBtn.addEventListener("click", () => {
			this.timer.reset()
			this.TODO()
		})
		setIcon(this.resetBtn, "reset")

		this.switchBtn.addEventListener("click", () => {
			this.timer.switch()
			this.TODO()
		})
		setIcon(this.switchBtn, "switch")

		this.timer.registerUpdateCallback("tick", (HFTime: string) => {
			timeContainer.innerText = HFTime
			this.setTODO()
		})
		this.timer.registerUpdateCallback("toggle", () => {
			this.TODO()
		})
	}

	// TODO: it needs to be updated when the timer stops by itself
	TODO() {
		if (this.timer.getIsRunning()) {
			setIcon(this.toggleBtn, "pause")
		} else {
			setIcon(this.toggleBtn, "play")
		}
	}

	setTODO() {
		this.TODOCircle.style.strokeDashoffset = String(
			(this.timer.getTimeLeft().secs / this.timer.getModeTotalSecs()) *
			430,
		)
	}

	getViewType() {
		return PLUGIN_CUSTOM_VIEW_ID
	}

	getDisplayText() {
		return "Pomodoro View"
	}

	async onClose() {
		// TODO:
	}
}
