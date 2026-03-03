import StatusBar from "../src/status-bar";
import type { OnTickTimeUpdater } from "../src/types";

// TODO: get back to this test file and see what you can improve and is done right

// Define and register a custom HTMLElement subclass because
// it is not possible to instantiate HTMLElement directly.
// http://stackoverflow.com/questions/61881027/ddg#61883392
class MyTestElement extends HTMLElement {
	constructor() {
		super();
	}
}

window.customElements.define("my-test-element", MyTestElement);

var statusBarHTMLElement: MyTestElement;
var HFTime: string = "00:00:00";

// A mock timer with the only methods used in the status bar
var timer = {
	toggle() { },
	reset() { },
	registerOnTickTimeUpdater(_: OnTickTimeUpdater) { },
	getTimeLeft() {
		return {
			seconds: 0,
			HFTime,
		};
	},
};

// It is better to start with a fresh element every time, but there is
// not practical difference in doing so in this case, because it is
// updated every time its value is tested
statusBarHTMLElement = new MyTestElement();

describe("default time displaying", () => {
	it("zeros", () => {
		new StatusBar(statusBarHTMLElement, timer as any);
		expect(statusBarHTMLElement.innerHTML).toContain(HFTime);
	});

	it("normal", () => {
		HFTime = "01:49:50";
		// StatusBar needs to be created in every test manually because
		new StatusBar(statusBarHTMLElement, timer as any);
		expect(statusBarHTMLElement.innerHTML).toContain(HFTime);
	});

	it("negative", () => {
		HFTime = "-34:49:00";
		new StatusBar(statusBarHTMLElement, timer as any);
		expect(statusBarHTMLElement.innerHTML).toContain(HFTime);
	});
});

describe("updating", () => {
	it("correctly register on tick updaters", () => {
		var onTickTimeUpdaters: OnTickTimeUpdater[] = [];

		var registerOnTickTimeUpdater = jest.fn(
			(onTickTimeUpdater: OnTickTimeUpdater) => {
				onTickTimeUpdaters.push(onTickTimeUpdater);
			},
		);

		timer = {
			...timer,
			registerOnTickTimeUpdater: registerOnTickTimeUpdater,
		};

		new StatusBar(statusBarHTMLElement, timer as any);
		expect(registerOnTickTimeUpdater).toHaveBeenCalled();
		expect(onTickTimeUpdaters).toHaveLength(1);
	});

	it("update time", () => {
		var testOnTickTimeUpdater: OnTickTimeUpdater = () => { };

		var registerOnTickTimeUpdater = jest.fn(
			(newUpdater: OnTickTimeUpdater) => {
				testOnTickTimeUpdater = newUpdater;
			},
		);

		timer = {
			...timer,
			registerOnTickTimeUpdater,
		};

		new StatusBar(statusBarHTMLElement, timer as any);

		HFTime = "00:00:00";
		testOnTickTimeUpdater(HFTime);
		expect(statusBarHTMLElement.innerHTML).toContain(HFTime);

		HFTime = "11:11:11";
		testOnTickTimeUpdater(HFTime);
		expect(statusBarHTMLElement.innerHTML).toContain(HFTime);

		HFTime = "-11:11:11";
		testOnTickTimeUpdater(HFTime);
		expect(statusBarHTMLElement.innerHTML).toContain(HFTime);
	});
});

describe("interactions", () => {
	it("check if clickable", () => {
		new StatusBar(statusBarHTMLElement, timer as any);

		let indicatorThatElementIsClickable = "mod-clickable";
		expect(statusBarHTMLElement.className).toContain(
			indicatorThatElementIsClickable,
		);
	});

	it("regular and auxiliary click interaction", () => {
		timer = {
			...timer,
			toggle: jest.fn(),
			reset: jest.fn(),
		};
		new StatusBar(statusBarHTMLElement, timer as any);

		let clickEvent = new Event("click");
		statusBarHTMLElement.dispatchEvent(clickEvent);
		// Must be called once
		expect(timer.toggle).toHaveBeenCalledTimes(1);

		let auxiliaryClickEvent = new Event("auxclick");
		statusBarHTMLElement.dispatchEvent(auxiliaryClickEvent);
		expect(timer.reset).toHaveBeenCalledTimes(1);
	});
});

// TODO: there's nothing destroing at the moment of writing
// it("destroing");
