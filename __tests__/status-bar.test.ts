import { build } from "../src/status-bar"
import type { updateCallback } from "../src/timer"

// TODO: get back to this test file and see what you can improve

// Define and register a custom HTMLElement subclass because
// it is not possible to instantiate HTMLElement directly.
// http://stackoverflow.com/questions/61881027/ddg#61883392
class MyTestElement extends HTMLElement {
	constructor() {
		super()
	}
}

window.customElements.define("my-test-element", MyTestElement)

var statusBarHTMLElement: MyTestElement
var HFTime: string = "00:00:00"

// A mock timer with the only methods used in the status bar
var timer = {
	toggle() {},
	reset() {},
	registerUpdateCallback(_: updateCallback) {},
	getTimeLeft() {
		return {
			seconds: 0,
			HFTime,
		}
	},
}

// It is better to start with a fresh element every time, but there is
// not practical difference in doing so in this case, because it is
// updated every time its value is tested
statusBarHTMLElement = new MyTestElement()

describe("default time displaying", () => {
	it("zeros", () => {
		build(statusBarHTMLElement, timer as any)
		expect(statusBarHTMLElement.innerHTML).toContain(HFTime)
	})

	it("normal", () => {
		HFTime = "01:49:50"
		// StatusBar needs to be created in every test manually because
		build(statusBarHTMLElement, timer as any)
		expect(statusBarHTMLElement.innerHTML).toContain(HFTime)
	})

	it("negative", () => {
		HFTime = "-34:49:00"
		build(statusBarHTMLElement, timer as any)
		expect(statusBarHTMLElement.innerHTML).toContain(HFTime)
	})
})

describe("updating", () => {
	it("correctly register on tick updaters", () => {
		var timeUpdateHandlers: updateCallback[] = []

		timer = {
			...timer,
			registerUpdateCallback: jest.fn(
				(timeUpdateHandler: updateCallback) => {
					timeUpdateHandlers.push(timeUpdateHandler)
				},
			),
		}

		build(statusBarHTMLElement, timer as any)
		expect(timer.registerUpdateCallback).toHaveBeenCalled()
		expect(timeUpdateHandlers).toHaveLength(1)
	})

	it("update time", () => {
		var onTickTestCallback: updateCallback = () => {}

		var registerUpdateCallback = jest.fn((newUpdater: updateCallback) => {
			onTickTestCallback = newUpdater
		})

		timer = {
			...timer,
			registerUpdateCallback,
		}

		build(statusBarHTMLElement, timer as any)

		HFTime = "00:00:00"
		onTickTestCallback(HFTime)
		expect(statusBarHTMLElement.innerHTML).toContain(HFTime)

		HFTime = "11:11:11"
		onTickTestCallback(HFTime)
		expect(statusBarHTMLElement.innerHTML).toContain(HFTime)

		HFTime = "-11:11:11"
		onTickTestCallback(HFTime)
		expect(statusBarHTMLElement.innerHTML).toContain(HFTime)
	})
})

describe("interactions", () => {
	it("check if clickable", () => {
		build(statusBarHTMLElement, timer as any)

		let indicatorThatElementIsClickable = "mod-clickable"
		console.log(statusBarHTMLElement)
		expect(statusBarHTMLElement.className).toContain(
			indicatorThatElementIsClickable,
		)
	})

	it("regular and auxiliary click interaction", () => {
		timer = {
			...timer,
			toggle: jest.fn(),
			reset: jest.fn(),
		}
		build(statusBarHTMLElement, timer as any)

		let clickEvent = new Event("click")
		statusBarHTMLElement.dispatchEvent(clickEvent)
		// Must be called once
		expect(timer.toggle).toHaveBeenCalledTimes(1)

		let auxiliaryClickEvent = new Event("auxclick")
		statusBarHTMLElement.dispatchEvent(auxiliaryClickEvent)
		// TODO: ensure that addItem is called twice or something
		// expect(timer.reset).toHaveBeenCalledTimes(1);
	})
})

// TODO: there's nothing destroing at the moment of writing
// it("destroing");
