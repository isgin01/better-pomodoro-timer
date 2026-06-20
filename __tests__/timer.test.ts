import { Timer } from "../src/timer"
import { DEFAULT_SETTINGS, PluginSettings } from "../src/settings"

jest.useFakeTimers()

test("toggle", () => {
	var timer = new Timer(DEFAULT_SETTINGS)
	expect(timer.running).toBe(false)
	timer.toggle()
	expect(timer.running).toBe(true)
	timer.toggle()
	expect(timer.running).toBe(false)
})

test("switch", () => {
	let settings: PluginSettings = {
		...DEFAULT_SETTINGS,
		workSecs: 60 * 60,
		breakSecs: 60 * 10,
	}
	var timer = new Timer(settings)

	expect(timer.HFTime).toBe("01:00:00")
	timer.switch()
	expect(timer.HFTime).toBe("00:10:00")
})

test("event handler func called correct amount of times", () => {
	var timer = new Timer(DEFAULT_SETTINGS)

	let cb = jest.fn()
	timer.registerEventHandler("tick", cb)
	timer.toggle()

	jest.advanceTimersByTime(1000)
	expect(cb).toHaveBeenCalledTimes(1)
	jest.advanceTimersByTime(1000)
	expect(cb).toHaveBeenCalledTimes(2)
	jest.advanceTimersByTime(1000 * 60)
	expect(cb).toHaveBeenCalledTimes(62)
	jest.advanceTimersByTime(1000 * 60 * 60 * 10)
	expect(cb).toHaveBeenCalledTimes(36062)

	timer.toggle() // stop
	jest.advanceTimersByTime(1000 * 60)
	expect(cb).toHaveBeenCalledTimes(36062)
})

test("HF time display", () => {
	let settings: PluginSettings = {
		...DEFAULT_SETTINGS,
		workSecs: 60 * 60 * 24,
	}
	var timer = new Timer(settings)

	expect(timer.HFTime).toBe("24:00:00")

	timer.toggle()

	jest.advanceTimersByTime(1000)
	expect(timer.HFTime).toBe("23:59:59")

	jest.advanceTimersByTime(1000 * 60)
	expect(timer.HFTime).toBe("23:58:59")

	jest.advanceTimersByTime(1000 * 60 * 60 * 23)
	expect(timer.HFTime).toBe("00:58:59")

	jest.advanceTimersByTime(1000 * 60 * 58)
	expect(timer.HFTime).toBe("00:00:59")

	jest.advanceTimersByTime(1000 * 59)
	expect(timer.HFTime).toBe("00:00:00")

	jest.advanceTimersByTime(1000 * 60)
	expect(timer.HFTime).toBe("-00:01:00")

	jest.advanceTimersByTime(1000 * 60 * 60 * 11)
	expect(timer.HFTime).toBe("-11:01:00")
})
