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

export function sToHF(
	// TODO: ensure the number is positive
	secondsTotal: number,
) {
	const secondsLeft = secondsTotal % 60;
	const minutesTotal = (secondsTotal - secondsLeft) / 60;
	const minutesLeft = minutesTotal % 60;
	const hoursTotal = (minutesTotal - minutesLeft) / 60;

	const paddedTODO = [hoursTotal, minutesLeft, secondsLeft].map(
		function padTimeUnits(timeUnit: number) {
			let convertedTimeUnit = String(timeUnit);
			// TODO: need more efficient way
			if (convertedTimeUnit[0] == "-") {
				convertedTimeUnit = convertedTimeUnit.slice(1);
			}
			let paddedConvertedTimeUnit = convertedTimeUnit.padStart(2, "00");
			return paddedConvertedTimeUnit;
		},
	);

	let humanFriendlyRepresentation = paddedTODO.join(":");

	// Add a minus sign if the time is negative
	if (secondsTotal < 0) {
		humanFriendlyRepresentation = "-" + humanFriendlyRepresentation;
	}

	return humanFriendlyRepresentation;
}
