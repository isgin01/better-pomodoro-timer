import { Notice } from "obsidian";

export function systemNotify(text: string) {
	const { Notification: ElectronNotification } = require("electron").remote;

	const systemNotification = new ElectronNotification({
		title: "Pomodoro Timer",
		body: text,
		// TODO: should it be silent actually?
		silent: true,
	});

	systemNotification.show();

	systemNotification.on("click", () => {
		systemNotification.close();
	});

	// 6.5 second period feels about right
	let notificationLifeTimeMillis = 6_543;
	setTimeout(() => {
		systemNotification.close();
	}, notificationLifeTimeMillis);
}

// TODO: see if this name format is approapriate
export function obsidianNotify(text: string) {
	new Notice(text);
}

export function convertSecondsToHumanTime(secondsTotal: number) {
	// Add a minus sign to the string if the seconds amount is negative
	// and make the variable positive to avoid getting minus signs when
	// dividing
	var humanTime: string;
	if (secondsTotal < 0) {
		humanTime = "-";
		secondsTotal *= -1;
	} else {
		humanTime = "";
	}

	const secondsLeft = secondsTotal % 60;
	const minutesTotal = (secondsTotal - secondsLeft) / 60;
	const minutesLeft = minutesTotal % 60;
	const hoursTotal = (minutesTotal - minutesLeft) / 60;

	const paddedWithZerosTimeUnits = [hoursTotal, minutesLeft, secondsLeft].map(
		function padTimeUnitsWithZeros(timeUnit: number) {
			let paddedTimeUnit = String(timeUnit).padStart(2, "00");
			return paddedTimeUnit;
		},
	);

	humanTime += paddedWithZerosTimeUnits.join(":");

	return humanTime;
}
