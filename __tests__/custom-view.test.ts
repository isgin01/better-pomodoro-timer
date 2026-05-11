import { WorkspaceLeaf } from "obsidian";
import { CustomView } from "../src/custom-view.ts";

let timerMock = {
	getTimeLeft: jest.fn(() => {
		return { HFTime: "00:00" };
	}),
	registerTimeUpdateHandler: jest.fn(),
};

let cv = new CustomView({} as WorkspaceLeaf, timerMock);

it("init", () => {
	expect(timerMock.getTimeLeft).toHaveBeenCalledTimes(1);
	expect(timerMock.registerTimeUpdateHandler).toHaveBeenCalledTimes(1);
	expect(cv.getDisplayText()).toBe("Pomodoro View");
	expect(cv.getViewType()).toBe("better-pomodoro-view");

	// Right and left mouse click events
	expect(cv.containerEl.addEventListener).toHaveBeenCalledTimes(2);

	// I want to have full awareness on how many times these functions are
	// called, so that I could notice it if something accidentally gets changed
	expect(cv.containerEl.createDiv).toHaveBeenCalledTimes(3);
	expect(cv.containerEl.createSpan).toHaveBeenCalledTimes(1);
	expect(cv.containerEl.createEl).toHaveBeenCalledTimes(2);
	expect(cv.containerEl.empty).toHaveBeenCalledTimes(1);
});

it("toggling & resetting", () => { });
