import { Notice } from "obsidian";

export function showSystemNotification(text: string) {
	const { Notification: ElectronNotification } = require("electron").remote;

	const systemNotification = new ElectronNotification({
		title: "Pomodoro Timer",
		body: text,
		silent: true,
	});

	systemNotification.show();

	systemNotification.on("click", () => {
		systemNotification.close();
	});

	setTimeout(() => {
		systemNotification.close();
	}, 1_000);
}

export function showObsidianNotification(text: string) {
	new Notice(text);
}

export function convertSecondsToHumanFriendlyRepresentation(
	secondsTotal: number,
) {
	// TODO: make it more elegant
	const hours = secondsTotal / 3600;
	const minutes = (secondsTotal % 3600) / 60;
	const secondsLeft = secondsTotal % 60;
	let humanFriendlyRepresentation = `${hours}:${minutes}:${secondsLeft}`;
	return humanFriendlyRepresentation;
}
