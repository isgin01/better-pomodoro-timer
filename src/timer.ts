import Worker from "clock.worker";
import { BetterPomodoroPluginSettings } from "settings";
import * as utils from "utils";
import type { messageToWorker } from "types";

export default class Timer {
	public timeInSecondsLeft: number;
	public isRunning: boolean;

	private clockWorker: Worker;
	private settings: BetterPomodoroPluginSettings;

	constructor(settings: BetterPomodoroPluginSettings) {
		this.timeInSecondsLeft = this.calculateTimeLeft();
		this.isRunning = false;

		this.clockWorker = new Worker();
		this.settings = settings;
	}

	toggle(): void {
		if (this.isRunning) {
			this.stop();
		} else {
			this.start();
		}
	}

	private updateTimeLeftInSeconds(): void {
		this.timeInSecondsLeft -= 1;
	}

	private calculateTimeLeft(): number {
		let workDurationParsed = parseInt(this.settings.workDuration);
		return workDurationParsed;
	}

	private start(): void {
		this.isRunning = true;

		let durationInSeconds = this.getDuration();
		let message: messageToWorker = {
			action: "start",
			durationInSeconds: durationInSeconds,
		};

		this.clockWorker.postMessage(message);
	}

	private getDuration(): number {
		// TODO: get break duration as well
		let durationString = this.settings.workDuration;
		let durationInMinutes = parseInt(durationString);
		return durationInMinutes;
	}

	private stop(): void {
		this.isRunning = false;
		let message: messageToWorker = {
			action: "stop",
		};
		this.clockWorker.postMessage(message);
	}

	private pause(): void { }

	private notify(): void {
		// TODO: Add sound to both system and obsidian notifications

		let notificationText = "Time is up";

		if (this.settings.areSystemNotificationsPreferred) {
			utils.showSystemNotification(notificationText);
		} else {
			utils.showObsidianNotification(notificationText);
		}
	}

	destroy(): void {
		this.pause();
		this.clockWorker.terminate();
	}
}
