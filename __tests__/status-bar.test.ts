import StatusBar from "../src/status-bar.ts";

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
var HFTimeLeft: string = "00:00:00";

type onTickHandlerType = (_: string) => void;
// A mock timer with only methods used in the status bar
var timer = {
	toggle() {},
	reset() {},
	registerOnTickHandler(_: onTickHandlerType) {},
	getHFTimeLeft() {
		return HFTimeLeft;
	},
};

// It is better to start with a fresh element every time, but there is
// not practical difference in doing so in this case, because it is
// updated every time its value is tested
statusBarHTMLElement = new MyTestElement();

describe("default time displaying", () => {
	it("zeros", () => {
		new StatusBar(statusBarHTMLElement, timer as any);
		expect(statusBarHTMLElement.innerHTML).toContain(HFTimeLeft);
	});

	it("normal", () => {
		HFTimeLeft = "01:49:50";
		// StatusBar needs to be created in every test manually because
		new StatusBar(statusBarHTMLElement, timer as any);
		expect(statusBarHTMLElement.innerHTML).toContain(HFTimeLeft);
	});

	it("negative", () => {
		HFTimeLeft = "-34:49:00";
		new StatusBar(statusBarHTMLElement, timer as any);
		expect(statusBarHTMLElement.innerHTML).toContain(HFTimeLeft);
	});
});

describe("updating", () => {
	it("register on tick update handler", () => {
		var onTickHandlers: onTickHandlerType[] = [];

		var registerOnTickHandler = jest.fn(
			(onTickHandler: onTickHandlerType) => {
				onTickHandlers.push(onTickHandler);
			},
		);

		timer = {
			...timer,
			registerOnTickHandler,
		};

		new StatusBar(statusBarHTMLElement, timer as any);
		expect(registerOnTickHandler).toHaveBeenCalled();
		expect(onTickHandlers).toHaveLength(1);
	});

	it("update time", () => {
		var testHandler: onTickHandlerType = () => {};

		var registerOnTickHandler = jest.fn((newHandler: onTickHandlerType) => {
			testHandler = newHandler;
		});

		timer = {
			...timer,
			registerOnTickHandler,
		};

		new StatusBar(statusBarHTMLElement, timer as any);

		HFTimeLeft = "00:00:00";
		testHandler(HFTimeLeft);
		expect(statusBarHTMLElement.innerHTML).toContain(HFTimeLeft);

		HFTimeLeft = "11:11:11";
		testHandler(HFTimeLeft);
		expect(statusBarHTMLElement.innerHTML).toContain(HFTimeLeft);

		HFTimeLeft = "-11:11:11";
		testHandler(HFTimeLeft);
		expect(statusBarHTMLElement.innerHTML).toContain(HFTimeLeft);
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
