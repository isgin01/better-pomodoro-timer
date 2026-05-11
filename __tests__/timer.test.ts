import Timer from "../src/timer";
import { PluginSettings } from "../src/settings";

const oneSecondMilliseconds = 1_000;

describe("proper timer behaviour", () => {
	let settings: PluginSettings = {
		workDurationInMinutes: "60",
		breakDurationInMinutes: "10",
		areSystemNotificationsPreferred: true,
		continueAfterTimeIsUp: true,
		showStatusBar: false,
		showCustomView: false,
	};
	var timer: Timer;

	beforeEach(() => {
		timer = new Timer(settings);
	});

	it("public prop init", () => {
		let secondsLeft = timer.getTimeLeft().seconds;
		expect(secondsLeft).toBe(parseInt(settings.workDurationInMinutes) * 60);
		expect(timer.isRunning).toBe(false);
	});

	it("setInterval is called", () => {
		jest.spyOn(global, "setInterval");

		timer.toggle();
		expect(timer.isRunning).toBe(true);

		expect(setInterval).toHaveBeenCalledTimes(1);

		// TODO: replace all 1_000 with a single constant
		expect(setInterval).toHaveBeenCalledWith(
			expect.any(Function),
			oneSecondMilliseconds,
		);
	});

	it("proper toggle functionality", () => {
		expect(timer.isRunning).toBe(false);
		timer.toggle();
		expect(timer.isRunning).toBe(true);
		timer.toggle();
		expect(timer.isRunning).toBe(false);
	});

	it("timeUpdateHandler function is called properly", () => {
		let timeUpdateHandler = jest.fn();
		timer.registerTimeUpdateHandler(timeUpdateHandler);
		jest.useFakeTimers();
		timer.toggle();

		jest.advanceTimersByTime(oneSecondMilliseconds);
		expect(timeUpdateHandler).toHaveBeenCalledTimes(1);
		jest.advanceTimersByTime(oneSecondMilliseconds);
		expect(timeUpdateHandler).toHaveBeenCalledTimes(2);
		jest.advanceTimersByTime(oneSecondMilliseconds * 60);
		expect(timeUpdateHandler).toHaveBeenCalledTimes(62);
		jest.advanceTimersByTime(oneSecondMilliseconds * 60 * 60);
		expect(timeUpdateHandler).toHaveBeenCalledTimes(3662);
		jest.advanceTimersByTime(oneSecondMilliseconds * 60 * 60 * 10);
		expect(timeUpdateHandler).toHaveBeenCalledTimes(39662);

		// Must not be called after timer is stopped
		timer.toggle();
		jest.advanceTimersByTime(oneSecondMilliseconds * 60);
		expect(timeUpdateHandler).toHaveBeenCalledTimes(39662);
	});

	it("stop, must not change anymore", () => {
		let workDurationInMinutes = 30 * 60;
		let secondsLeftTotal = workDurationInMinutes * 60;

		let settings: PluginSettings = {
			workDurationInMinutes: String(workDurationInMinutes),
			breakDurationInMinutes: "10",
			areSystemNotificationsPreferred: true,
			continueAfterTimeIsUp: true,
			showCustomView: false,
			showStatusBar: false,
		};
		let timer = new Timer(settings);
		timer.toggle();
		jest.advanceTimersByTime(oneSecondMilliseconds);
		timer.toggle();

		let expectedTimeLeft = {
			seconds: secondsLeftTotal - 1,
			HFTime: "29:59:59",
		};

		expect(timer.getTimeLeft()).toStrictEqual(expectedTimeLeft);

		// Wait for some time

		jest.advanceTimersByTime(oneSecondMilliseconds * 1000);

		// Must still be the same

		expect(timer.getTimeLeft()).toStrictEqual(expectedTimeLeft);
	});
});

it("proper time display", () => {
	jest.useFakeTimers();

	let workDurationMinutes = 24 * 60;
	var secondsLeft = workDurationMinutes * 60;

	let settings: PluginSettings = {
		workDurationInMinutes: String(workDurationMinutes),
		breakDurationInMinutes: "10",
		areSystemNotificationsPreferred: true,
		continueAfterTimeIsUp: true,
		showCustomView: false,
		showStatusBar: false,
	};

	let timer = new Timer(settings);
	timer.toggle();

	jest.advanceTimersByTime(oneSecondMilliseconds * 1);
	expect(timer.getTimeLeft()).toStrictEqual({
		seconds: (secondsLeft -= 1),
		HFTime: "23:59:59",
	});

	jest.advanceTimersByTime(oneSecondMilliseconds * 60);
	expect(timer.getTimeLeft()).toStrictEqual({
		seconds: (secondsLeft -= 60),
		HFTime: "23:58:59",
	});

	jest.advanceTimersByTime(oneSecondMilliseconds * 60 * 60);
	expect(timer.getTimeLeft()).toStrictEqual({
		seconds: (secondsLeft -= 60 * 60),
		HFTime: "22:58:59",
	});

	jest.advanceTimersByTime(oneSecondMilliseconds * 60 * 60 * 22);
	expect(timer.getTimeLeft()).toStrictEqual({
		seconds: (secondsLeft -= 60 * 60 * 22),
		HFTime: "00:58:59",
	});

	jest.advanceTimersByTime(oneSecondMilliseconds * (60 * 58 + 59));
	expect(timer.getTimeLeft()).toStrictEqual({
		seconds: (secondsLeft -= 60 * 58 + 59),
		HFTime: "00:00:00",
	});

	jest.advanceTimersByTime(oneSecondMilliseconds);
	expect(timer.getTimeLeft()).toStrictEqual({
		seconds: (secondsLeft -= 1),
		HFTime: "-00:00:01",
	});

	jest.advanceTimersByTime(oneSecondMilliseconds * 60);
	expect(timer.getTimeLeft()).toStrictEqual({
		seconds: (secondsLeft -= 60),
		HFTime: "-00:01:01",
	});

	jest.advanceTimersByTime(oneSecondMilliseconds * 60 * 60);
	expect(timer.getTimeLeft()).toStrictEqual({
		seconds: (secondsLeft -= 60 * 60),
		HFTime: "-01:01:01",
	});
});

describe("switch behavior", () => {
	// Check what happens
	// jest.useFakeTimers();

	var settings: PluginSettings = {
		workDurationInMinutes: "60",
		breakDurationInMinutes: "10",
		areSystemNotificationsPreferred: true,
		continueAfterTimeIsUp: false,
		showCustomView: false,
		showStatusBar: false,
	};

	it("switch while on hold", () => {
		var timer = new Timer(settings);
		expect(timer.getTimeLeft().HFTime).toBe("01:00:00");
		timer.switch();
		expect(timer.getTimeLeft().HFTime).toBe("00:10:00");
	});

	it("call timeUpdateHandler func", () => {
		var timer = new Timer(settings);
		var timeUpdateHandler = jest.fn();
		timer.registerTimeUpdateHandler(timeUpdateHandler);
		timer.switch();
		expect(timeUpdateHandler).toHaveBeenCalledTimes(1);
	});

	it("switch after time is up", () => {
		var timer = new Timer(settings);
		var timeUpdateHandler = jest.fn();
		timer.registerTimeUpdateHandler(timeUpdateHandler);
		jest.spyOn(timer, "switch");
		timer.toggle();

		// not yet
		jest.advanceTimersByTime(oneSecondMilliseconds * 60 * 60 - 1);
		expect(timer.getTimeLeft().seconds).toBe(1);
		expect(timer.isRunning).toBe(true);
		expect(timer.switch).toHaveBeenCalledTimes(0);
		expect(timeUpdateHandler).toHaveBeenCalledTimes(60 * 60 - 1);

		// now it must change
		jest.advanceTimersByTime(oneSecondMilliseconds);
		expect(timer.getTimeLeft().seconds).toBe(60 * 10);
		expect(timer.isRunning).toBe(false);
		expect(timer.switch).toHaveBeenCalledTimes(1);
		expect(timeUpdateHandler).toHaveBeenCalledTimes(60 * 60 + 1);
	});
});
