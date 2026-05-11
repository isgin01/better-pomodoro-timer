import { Notice } from "obsidian"

export function notify(notificationText: string): void {
	// TODO: Add sound to both system and obsidian notifications

	// if (system) {
	// systemNotify(notificationText)
	// } else {
	obsidianNotify(notificationText)
	// }
}

function systemNotify(text: string) {
	const { Notification: ElectronNotification } = require("electron").remote

	const systemNotification = new ElectronNotification({
		title: "Pomodoro Timer",
		body: text,
		// TODO: should it be silent actually?
		silent: true,
	})

	systemNotification.show()

	systemNotification.on("click", () => {
		systemNotification.close()
	})

	// 6.5 second period feels about right
	let notificationLifeTimeMillis = 6_543
	// TODO: research registerTimeout from the obsidian package
	setTimeout(() => {
		systemNotification.close()
	}, notificationLifeTimeMillis)
}

function obsidianNotify(text: string) {
	new Notice(text)
}
