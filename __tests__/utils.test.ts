import * as utils from "../src/utils"

describe("convert seconds to a human friendly representation", () => {
	it("zero seconds", () => {
		var seconds = 0
		var expected = "00:00:00"
		var actual = utils.secondsToHF(seconds)
		expect(actual).toBe(expected)
	})
	it("negative", () => {
		var seconds = -5
		var expected = "-00:00:05"
		var actual = utils.secondsToHF(seconds)
		expect(actual).toBe(expected)
	})
	it("small", () => {
		var seconds = 5
		var expected = "00:00:05"
		var actual = utils.secondsToHF(seconds)
		expect(actual).toBe(expected)
	})
	it("medium", () => {
		var seconds = 501
		var expected = "00:08:21"
		var actual = utils.secondsToHF(seconds)
		expect(actual).toBe(expected)
	})
	it("ten minutes", () => {
		var seconds = 600
		var expected = "00:10:00"
		var actual = utils.secondsToHF(seconds)
		expect(actual).toBe(expected)
	})
	it("one hour", () => {
		var seconds = 3600
		var expected = "01:00:00"
		var actual = utils.secondsToHF(seconds)
		expect(actual).toBe(expected)
	})
	it("big", () => {
		var seconds = 6000
		var expected = "01:40:00"
		var actual = utils.secondsToHF(seconds)
		expect(actual).toBe(expected)
	})
	it("very big", () => {
		var seconds = 100000
		var expected = "27:46:40"
		var actual = utils.secondsToHF(seconds)
		expect(actual).toBe(expected)
	})
})
