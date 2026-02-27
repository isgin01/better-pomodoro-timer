import Timer from "./timer";

export default class StatusBar {
	constructor(element: HTMLElement, timer: Timer) {
		let HumanTimeLeft = timer.getHumanTimeLeft();
		element.innerHTML = this.constructInnerHTML(HumanTimeLeft);
		element.className = `${element.className} mod-clickable`;

		element.addEventListener("click", () => {
			timer.toggle();
		});

		element.addEventListener("auxclick", () => {
			timer.reset();
		});

		timer.registerOnTickTimeUpdater(
			(humanFriendlyTimeRepresenation: string) => {
				element.innerHTML = this.constructInnerHTML(
					humanFriendlyTimeRepresenation,
				);
			},
		);
	}

	private constructInnerHTML(time: string) {
		return `<span>${time}</span>`;
	}

	destroy() {
		// TODO: doesn't anything need to be destroyed?
	}
}
