import { Timer, secondsToHF } from "../src/timer"
import { PluginSettings } from "../src/settings"

const oneSecondMillis = 1_000

describe("proper timer behaviour", () => {
	let settings: PluginSettings = {
		workDurationInMinutes: "60",
		breakDurationInMinutes: "10",
		areSystemNotificationsPreferred: true,
		continueAfterTimeIsUp: true,
		showStatusBar: false,
		showCustomView: false,
	}
	var timer: Timer

	beforeEach(() => {
		timer = new Timer(settings)
	})

	it("public prop init", () => {
		let secondsLeft = timer.getTimeLeft().secs
		expect(secondsLeft).toBe(settings.workDurationSecs)
		expect(timer.isRunning).toBe(false)
	})

	it("setInterval is called", () => {
		jest.spyOn(global, "setInterval")

		timer.toggle()
		expect(timer.isRunning).toBe(true)

		expect(setInterval).toHaveBeenCalledTimes(1)

		expect(setInterval).toHaveBeenCalledWith(
			expect.any(Function),
			oneSecondMillis,
		)
	})

	it("proper toggle functionality", () => {
		expect(timer.isRunning).toBe(false)
		timer.toggle()
		expect(timer.isRunning).toBe(true)
		timer.toggle()
		expect(timer.isRunning).toBe(false)
	})

	it("timeUpdateHandler function is called properly", () => {
		let onTickCallback = jest.fn()
		timer.registerUpdateCallback("tick", onTickCallback)
		jest.useFakeTimers()
		timer.toggle()

		jest.advanceTimersByTime(oneSecondMillis)
		expect(onTickCallback).toHaveBeenCalledTimes(1)
		jest.advanceTimersByTime(oneSecondMillis)
		expect(onTickCallback).toHaveBeenCalledTimes(2)
		jest.advanceTimersByTime(oneSecondMillis * 60)
		expect(onTickCallback).toHaveBeenCalledTimes(62)
		jest.advanceTimersByTime(oneSecondMillis * 60 * 60)
		expect(onTickCallback).toHaveBeenCalledTimes(3662)
		jest.advanceTimersByTime(oneSecondMillis * 60 * 60 * 10)
		expect(onTickCallback).toHaveBeenCalledTimes(39662)

		// Must not be called after timer is stopped
		timer.toggle()
		jest.advanceTimersByTime(oneSecondMillis * 60)
		expect(onTickCallback).toHaveBeenCalledTimes(39662)
	})

	it("stop, must not change anymore", () => {
		let workDurationInMinutes = 30 * 60
		let secondsLeftTotal = workDurationInMinutes * 60

		let settings: PluginSettings = {
			workDurationInMinutes: String(workDurationInMinutes),
			breakDurationInMinutes: "10",
			areSystemNotificationsPreferred: true,
			continueAfterTimeIsUp: true,
			showCustomView: false,
			showStatusBar: false,
		}
		let timer = new Timer(settings)
		timer.toggle()
		jest.advanceTimersByTime(oneSecondMillis)
		timer.toggle()

		let expectedTimeLeft = {
			seconds: secondsLeftTotal - 1,
			HFTime: "29:59:59",
		}

		expect(timer.getTimeLeft()).toStrictEqual(expectedTimeLeft)

		// Wait for some time

		jest.advanceTimersByTime(oneSecondMillis * 1000)

		// Must still be the same

		expect(timer.getTimeLeft()).toStrictEqual(expectedTimeLeft)
	})
})

it("proper time display", () => {
	jest.useFakeTimers()

	let workDurationMinutes = 24 * 60
	var secondsLeft = workDurationMinutes * 60

	let settings: PluginSettings = {
		workDurationInMinutes: String(workDurationMinutes),
		breakDurationInMinutes: "10",
		areSystemNotificationsPreferred: true,
		continueAfterTimeIsUp: true,
		showCustomView: false,
		showStatusBar: false,
	}

	let timer = new Timer(settings)
	timer.toggle()

	jest.advanceTimersByTime(oneSecondMillis * 1)
	expect(timer.getTimeLeft()).toStrictEqual({
		seconds: (secondsLeft -= 1),
		HFTime: "23:59:59",
	})

	jest.advanceTimersByTime(oneSecondMillis * 60)
	expect(timer.getTimeLeft()).toStrictEqual({
		seconds: (secondsLeft -= 60),
		HFTime: "23:58:59",
	})

	jest.advanceTimersByTime(oneSecondMillis * 60 * 60)
	expect(timer.getTimeLeft()).toStrictEqual({
		seconds: (secondsLeft -= 60 * 60),
		HFTime: "22:58:59",
	})

	jest.advanceTimersByTime(oneSecondMillis * 60 * 60 * 22)
	expect(timer.getTimeLeft()).toStrictEqual({
		seconds: (secondsLeft -= 60 * 60 * 22),
		HFTime: "00:58:59",
	})

	jest.advanceTimersByTime(oneSecondMillis * (60 * 58 + 59))
	expect(timer.getTimeLeft()).toStrictEqual({
		seconds: (secondsLeft -= 60 * 58 + 59),
		HFTime: "00:00:00",
	})

	jest.advanceTimersByTime(oneSecondMillis)
	expect(timer.getTimeLeft()).toStrictEqual({
		seconds: (secondsLeft -= 1),
		HFTime: "-00:00:01",
	})

	jest.advanceTimersByTime(oneSecondMillis * 60)
	expect(timer.getTimeLeft()).toStrictEqual({
		seconds: (secondsLeft -= 60),
		HFTime: "-00:01:01",
	})

	jest.advanceTimersByTime(oneSecondMillis * 60 * 60)
	expect(timer.getTimeLeft()).toStrictEqual({
		seconds: (secondsLeft -= 60 * 60),
		HFTime: "-01:01:01",
	})
})

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
	}

	it("switch while on hold", () => {
		var timer = new Timer(settings)
		expect(timer.getTimeLeft().HFTime).toBe("01:00:00")
		timer.switch()
		expect(timer.getTimeLeft().HFTime).toBe("00:10:00")
	})

	it("call timeUpdateHandler func", () => {
		var timer = new Timer(settings)
		var onTickCallback = jest.fn()
		timer.registerUpdateCallback("tick", onTickCallback)
		timer.switch()
		expect(onTickCallback).toHaveBeenCalledTimes(1)
	})

	it("switch after time is up", () => {
		var timer = new Timer(settings)
		var onTickCallback = jest.fn()
		timer.registerUpdateCallback("tick", onTickCallback)
		jest.spyOn(timer, "switch")
		timer.toggle()

		// not yet
		jest.advanceTimersByTime(oneSecondMillis * 60 * 60 - 1)
		expect(timer.getTimeLeft().secs).toBe(1)
		expect(timer.isRunning).toBe(true)
		expect(timer.switch).toHaveBeenCalledTimes(0)
		expect(onTickCallback).toHaveBeenCalledTimes(60 * 60 - 1)

		// now it must change
		jest.advanceTimersByTime(oneSecondMillis)
		expect(timer.getTimeLeft().secs).toBe(60 * 10)
		expect(timer.isRunning).toBe(false)
		expect(timer.switch).toHaveBeenCalledTimes(1)
		expect(onTickCallback).toHaveBeenCalledTimes(60 * 60 + 1)
	})
})

describe("convert seconds to a human friendly representation", () => {
	it("zero seconds", () => {
		var seconds = 0
		var expected = "00:00:00"
		var actual = secondsToHF(seconds)
		expect(actual).toBe(expected)
	})
	it("negative", () => {
		var seconds = -5
		var expected = "-00:00:05"
		var actual = secondsToHF(seconds)
		expect(actual).toBe(expected)
	})
	it("small", () => {
		var seconds = 5
		var expected = "00:00:05"
		var actual = secondsToHF(seconds)
		expect(actual).toBe(expected)
	})
	it("medium", () => {
		var seconds = 501
		var expected = "00:08:21"
		var actual = secondsToHF(seconds)
		expect(actual).toBe(expected)
	})
	it("ten minutes", () => {
		var seconds = 600
		var expected = "00:10:00"
		var actual = secondsToHF(seconds)
		expect(actual).toBe(expected)
	})
	it("one hour", () => {
		var seconds = 3600
		var expected = "01:00:00"
		var actual = secondsToHF(seconds)
		expect(actual).toBe(expected)
	})
	it("big", () => {
		var seconds = 6000
		var expected = "01:40:00"
		var actual = secondsToHF(seconds)
		expect(actual).toBe(expected)
	})
	it("very big", () => {
		var seconds = 100000
		var expected = "27:46:40"
		var actual = secondsToHF(seconds)
		expect(actual).toBe(expected)
	})
})
