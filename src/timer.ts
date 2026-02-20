import Worker from "clock.worker";
import { BetterPomodoroPluginSettings } from "settings";
import * as utils from "utils";
import type { Mode } from "types";

export default class Timer {
	public timeLeftSeconds: number;
	public isRunning: boolean;

	private onTickHandlers: ((newTime: string) => void)[];
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

		this.timeLeftSeconds = this.getModeDurationSeconds();

		// Add a handler that changes all
		this.onTickHandlers = [
			// TODO: should I merge this into a single function
			() => {
				if (this.timeLeftSeconds == 0) {
					this.timeIsUp();
				}
			},
			() => {
				this.timeLeftSeconds -= 1;
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
		this.onTickHandlers.push(handler);
	}

	private timeIsUp(): void {
		this.switchMode();
		this.stop();
	}

	private getModeDurationSeconds(): number {
		// TODO: kinda shortened names, see if it made sense
		switch (this.mode) {
			case "work":
				var durationMinutesUnparsed =
					this.settings.workDurationInMinutes;
			case "break":
				var durationMinutesUnparsed =
					this.settings.breakDurationInMinutes;
		}

		// TODO: see if it makes sense to create a helper func that would
		// convert string minutes to integer seconds
		let durationMinutes = Number(durationMinutesUnparsed);
		let durationSeconds = durationMinutes * 60;

		return durationSeconds;
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
				this.timeLeftSeconds,
			);

		// TODO: this code is not clear

		// Execute every handler
		this.onTickHandlers.forEach((handler) =>
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
