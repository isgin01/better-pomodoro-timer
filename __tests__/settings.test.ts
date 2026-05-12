import { validateNumericInput } from "../src/settings"

describe(`${validateNumericInput.name} tests`, () => {
	it("boundaries", () => {
		expect(validateNumericInput("")).toBe(true)
		expect(validateNumericInput("1")).toBe(true)
		expect(validateNumericInput("30")).toBe(true)
		expect(validateNumericInput("120")).toBe(true)
	})
	it("points", () => {
		expect(validateNumericInput("0.5")).toBe(true)
		expect(validateNumericInput(".5")).toBe(true)
		expect(validateNumericInput("1.")).toBe(true)
	})
	it("not a number", () => {
		expect(validateNumericInput("test")).toBe(false)
		expect(validateNumericInput("$")).toBe(false)
		expect(validateNumericInput(".")).toBe(false)
	})
	it("excessive symbols", () => {
		expect(validateNumericInput("3,0")).toBe(false)
		expect(validateNumericInput("0..5")).toBe(false)
		expect(validateNumericInput(".5$")).toBe(false)
		expect(validateNumericInput("1-20")).toBe(false)
	})
})
