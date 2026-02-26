import Timer from "./timer";

export default class StatusBar {
	constructor(element: HTMLElement, timer: Timer) {
		let HFTimeLeft = timer.getHFTimeLeft();
		element.innerHTML = this.constructInnerHTML(HFTimeLeft);
		element.className = `${element.className} mod-clickable`;

		element.addEventListener("click", (_) => {
			timer.toggle();
		});

		element.addEventListener("auxclick", (_) => {
			timer.reset();
		});

		timer.registerOnTickHandler(
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
