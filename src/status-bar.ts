import Timer from "./timer";

export default class StatusBar {
	private element: HTMLElement;
	private timer: Timer;

	constructor(element: HTMLElement, timer: Timer) {
		this.element = element;
		this.timer = timer;

		// TODO: Move the component to some other place maybe?
		this.element.className = `${element.className} mod-clickable`;
		this.element.innerHTML = `<span>${timer.timeInSecondsLeft}</span>`;
		this.element.addEventListener("click", (_) => {
			this.timer.toggle();
		});
	}

	destroy() { }
}
