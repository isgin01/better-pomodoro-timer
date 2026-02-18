import { Notice } from "obsidian";

export function showSystemNotification(text: string) {
	const { Notification: ElectronNotification } = require("electron");

	const systemNotification = new ElectronNotification({
		title: "Pomodoro Timer",
		body: text,
		silent: true,
	});

	systemNotification.show();

	systemNotification.on("click", () => {
		systemNotification.close();
	});
}

export function showObsidianNotification(text: string) {
	new Notice(text);
}
