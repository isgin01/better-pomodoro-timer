import { Menu } from "obsidian";
import Timer from "./timer";

export default class StatusBar {
	constructor(element: HTMLElement, timer: Timer) {
		let humanTimeLeft = timer.getTimeLeft().HFTime;
		element.innerHTML = this.constructInnerHTML(humanTimeLeft);
		element.className = `${element.className} mod-clickable`;

		let menu = new Menu();

		menu.addItem((item) => {
			item.setTitle("Reset").onClick(() => timer.reset());
		});

		menu.addItem((item) => {
			item.setTitle("Switch").onClick(() => timer.switch());
		});

		element.addEventListener("click", () => {
			timer.toggle();
		});

		element.addEventListener("auxclick", (event) => {
			menu.showAtMouseEvent(event);
		});

		let statusBarTimeUpdateHandler = (
			humanFriendlyTimeRepresenation: string,
		) => {
			element.innerHTML = this.constructInnerHTML(
				humanFriendlyTimeRepresenation,
			);
		};

		timer.registerTimeUpdateHandler(statusBarTimeUpdateHandler);
	}

	private constructInnerHTML(time: string) {
		return `<span>${time}</span>`;
	}

	destroy() {
		// TODO: doesn't anything need to be destroyed?
	}
}
