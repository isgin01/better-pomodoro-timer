import Timer from "../src/timer";
import { BetterPomodoroPluginSettings } from "../src/types";

describe("TODO", () => {
	let settings: BetterPomodoroPluginSettings = {
		workDurationInMinutes: "60",
		breakDurationInMinutes: "10",
		areSystemNotificationsPreferred: true,
		continueAfterTimeIsUp: true,
	};
	var timer: Timer;

	beforeEach(() => {
		timer = new Timer(settings);
	});

	it("public prop init", () => {
		let secondsLeft = timer.getSecondsLeft();
		expect(secondsLeft).toBe(parseInt(settings.workDurationInMinutes) * 60);
		expect(timer.getIsRunning()).toBe(false);
	});

	it("run", () => {
		jest.useFakeTimers();
		jest.spyOn(global, "setInterval");

		timer.toggle();
		expect(timer.getIsRunning()).toBe(true);

		expect(setInterval).toHaveBeenCalledTimes(1);
		let oneSecondMilliseconds = 1_000;
		expect(setInterval).toHaveBeenCalledWith(
			expect.any(Function),
			oneSecondMilliseconds,
		);
	});

	it("register on tick time updater", async () => {
		let updater = jest.fn();
		timer.registerOnTickTimeUpdater(updater);
		timer.toggle();
		setTimeout(() => {
			console.log("called");
			expect(updater).toHaveBeenCalledTimes(1);
		}, 2_000);
	});
});
