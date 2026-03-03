import Timer from "../src/timer";
import { BetterPomodoroPluginSettings, TimeLeft } from "../src/types";
import { convertSecondsToHFTime } from "../src/utils";

const oneSecondMilliseconds = 1_000;

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
		let secondsLeft = timer.getTimeLeft().seconds;
		expect(secondsLeft).toBe(parseInt(settings.workDurationInMinutes) * 60);
		expect(timer.getIsRunning()).toBe(false);
	});

	it("run setInterval", () => {
		jest.spyOn(global, "setInterval");

		timer.toggle();
		expect(timer.getIsRunning()).toBe(true);

		expect(setInterval).toHaveBeenCalledTimes(1);

		// TODO: replace all 1_000 with a single constant
		expect(setInterval).toHaveBeenCalledWith(
			expect.any(Function),
			oneSecondMilliseconds,
		);
	});
});

function convertSecondsToTimeLeft(seconds: number): TimeLeft {
	let HF = convertSecondsToHFTime(seconds);

	return {
		// Return first and then subtract
		seconds,
		HFTime: HF,
	};
}

// TODO: make the test case neater
describe("continue after time is up", () => {
	jest.useFakeTimers();

	var workDurationInMinutes = 1800;

	let settings: BetterPomodoroPluginSettings = {
		workDurationInMinutes: String(workDurationInMinutes),
		breakDurationInMinutes: "10",
		areSystemNotificationsPreferred: true,
		continueAfterTimeIsUp: true,
	};

	var timer: Timer;
	var updater: () => void;

	var secondsLeftTotal = workDurationInMinutes * 60;
	var secondsLeftCurrent = secondsLeftTotal;

	beforeEach(() => {
		timer = new Timer(settings);
		updater = jest.fn();
		timer.registerOnTickTimeUpdater(updater);
	});

	it("not running yet, not seconds passed", () => {
		expect(timer.getIsRunning()).toBe(false);
		expect(timer.getTimeLeft()).toStrictEqual(
			convertSecondsToTimeLeft(secondsLeftCurrent),
		);
		expect(updater).toHaveBeenCalledTimes(
			secondsLeftTotal - secondsLeftCurrent,
		);
	});

	it("is running, to seconds passed though", () => {
		timer.toggle();
		expect(timer.getIsRunning()).toBe(true);
		expect(timer.getTimeLeft()).toStrictEqual(
			convertSecondsToTimeLeft(secondsLeftCurrent),
		);
		expect(updater).toHaveBeenCalledTimes(
			secondsLeftTotal - secondsLeftCurrent,
		);
	});

	var TODO = [1, 20, 60, 40 * 60, 60 * 60];
	var TODO2 = TODO.concat(TODO);

	it("proper time display", () => {
		timer.toggle();
		TODO2.forEach((decrease: number) => {
			secondsLeftCurrent -= decrease;

			jest.advanceTimersByTime(oneSecondMilliseconds * decrease);

			expect(timer.getIsRunning()).toBe(true);
			expect(timer.getTimeLeft()).toStrictEqual(
				convertSecondsToTimeLeft(secondsLeftCurrent),
			);
			expect(updater).toHaveBeenCalledTimes(
				secondsLeftTotal - secondsLeftCurrent,
			);
		});
	});

	it("stop, must not change anymore", () => {
		timer.toggle();
		expect(timer.getIsRunning()).toBe(true);

		jest.advanceTimersByTime(oneSecondMilliseconds);

		timer.toggle();

		expect(timer.getIsRunning()).toBe(false);

		let expectedTimeLeft: TimeLeft = {
			seconds: secondsLeftTotal - 1,
			HFTime: "29:59:59",
		};
		expect(timer.getTimeLeft()).toStrictEqual(expectedTimeLeft);

		// Wait for some time

		jest.advanceTimersByTime(oneSecondMilliseconds * 1000);

		// Must still be the same

		expect(timer.getIsRunning()).toBe(false);
		expect(timer.getTimeLeft()).toStrictEqual(expectedTimeLeft);
	});
});
