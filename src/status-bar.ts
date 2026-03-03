import Timer from "./timer";

export default class StatusBar {
	constructor(element: HTMLElement, timer: Timer) {
		// TODO: would it better to just add a method to Timer?
		let humanTimeLeft = timer.getTimeLeft().HFTime;
		element.innerHTML = this.constructInnerHTML(humanTimeLeft);
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
