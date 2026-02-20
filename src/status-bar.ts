import Timer from "./timer";

export default class StatusBar {
	private element: HTMLElement;
	private timer: Timer;

	constructor(element: HTMLElement, timer: Timer, initialTime: string) {
		this.element = element;
		this.timer = timer;

		this.element.innerHTML = this.constructInnerHTML(initialTime);
		this.element.className = `${element.className} mod-clickable`;
		this.element.addEventListener("click", (_) => {
			this.timer.toggle();
		});

		this.timer.registerOnTickHandler(() => {
			this.element.innerHTML = this.constructInnerHTML(
				this.timer.timeLeftSeconds,
			);
		});
	}

	destroy() {
		// TODO: doesn't anything need to be destroyed?
	}

	private constructInnerHTML(time: string | number) {
		return `<span>${time}</span>`;
	}
}
