import Worker from "clock.worker";
import { BetterPomodoroPluginSettings } from "settings";
import * as utils from "utils";
import type { Mode } from "types";

export default class Timer {
	public timeInSecondsLeft: number;
	public isRunning: boolean;

	private onTickHanders: ((newTime: string) => void)[];
	// TODO: what if we use setInterval here instead of a worker?
	// private clockWorker: Worker;
	private clock: NodeJS.Timeout | undefined;
	private settings: BetterPomodoroPluginSettings;
	private mode: Mode;

	constructor(settings: BetterPomodoroPluginSettings) {
		// TODO: rewrite the comment
		// Assign settings before all other props because it can used
		// in order to load/assign the other props
		this.settings = settings;

		// public props
		this.isRunning = false;

		// private props
		// this.timeInSecondsLeft = this.calculateTimeLeft();
		// TODO: is it really okay to just assign it randomly
		this.mode = "work";

		this.timeInSecondsLeft = this.getNextTimePeriodDurationInSeconds();

		// Add a handler that changes all
		this.onTickHanders = [
			() => {
				this.timeInSecondsLeft -= 1;
			},
		];
	}

	toggle(): void {
		if (this.isRunning) {
			this.stop();
		} else {
			this.start();
		}
	}

	destroy(): void {
		this.pause();
	}

	registerOnTickHandler(handler: (newTime: string) => void): void {
		this.onTickHanders.push(handler);
	}

	private getNextTimePeriodDurationInSeconds(): number {
		switch (this.mode) {
			case "work":
				var nextModeDurationMinutesUnparsed =
					this.settings.workDurationInMinutes;
			case "break":
				var nextModeDurationMinutesUnparsed =
					this.settings.breakDurationInMinutes;
		}

		let nextModeDurationMinutesParsed = Number(
			nextModeDurationMinutesUnparsed,
		);
		let nextModeDurationSeconds = nextModeDurationMinutesParsed * 60;
		return nextModeDurationSeconds;
	}

	private switchMode(): void {
		// TODO: there must be a more elegant way to do it
		const nextMode = this.mode == "work" ? "break" : "work";
		this.mode = nextMode;
	}

	private start(): void {
		this.isRunning = true;

		const oneSecondInMilliseconds = 1000;

		this.clock = setInterval(() => {
			this.tick();
		}, oneSecondInMilliseconds);

		// TODO: should I write is or has?
		let notificationText = "Pomodoro timer has started";
		this.notify(notificationText);
	}

	private tick(): void {
		console.log("tick");

		const humanFriendlyTimeRepresentation =
			utils.convertSecondsToHumanFriendlyRepresentation(
				this.timeInSecondsLeft,
			);

		// TODO: this code is not clear

		// Execute every handler
		this.onTickHanders.forEach((handler) =>
			handler(humanFriendlyTimeRepresentation),
		);
	}

	private pause(): void {
		// TODO: add time left saving
		this.stop();
	}

	private stop(): void {
		this.isRunning = false;

		clearInterval(this.clock);

		let notificationText = "Pomodoro timer has stopped";
		this.notify(notificationText);
	}

	private notify(notificationText: string): void {
		// TODO: Add sound to both system and obsidian notifications

		if (this.settings.areSystemNotificationsPreferred) {
			utils.showSystemNotification(notificationText);
		} else {
			utils.showObsidianNotification(notificationText);
		}
	}
}
