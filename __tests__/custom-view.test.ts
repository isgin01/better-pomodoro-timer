import { type WorkspaceLeaf } from "obsidian"
import { CustomView } from "../src/custom-view"
import { Timer } from "../src/timer"
import { DEFAULT_SETTINGS } from "../src/settings"

let timer = new Timer(DEFAULT_SETTINGS)
let cv = new CustomView({} as WorkspaceLeaf, timer)

it("init", () => {
	expect(cv.getDisplayText()).toBe("Pomodoro View")
	expect(cv.getViewType()).toBe("better-pomodoro-view")
	expect(timer.isRunning).toBe(false)

	// Right and left mouse click events
	expect(cv.containerEl.addEventListener).toHaveBeenCalledTimes(2)

	expect(cv.containerEl.createDiv).toHaveBeenCalledTimes(3)
	expect(cv.containerEl.createSpan).toHaveBeenCalledTimes(1)
	expect(cv.containerEl.createEl).toHaveBeenCalledTimes(2)
	expect(cv.containerEl.empty).toHaveBeenCalledTimes(1)
})

it.todo("toggling & resetting")
