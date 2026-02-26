import { BetterPomodoroPluginSettings } from "settings";
import * as utils from "utils";
import type { Mode } from "types";

export default class Timer {
	public secondsLeft: number;
	public isRunning: boolean;

	// TODO: maybe I should indicate that these handlers only update time displays
	private onTickHandlers: ((newTime: string) => void)[];
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
		// TODO: load previous mode
		this.mode = "work";
		this.secondsLeft = this.getModeDurationSeconds();
		this.onTickHandlers = [];
	}

	toggle(): void {
		if (this.isRunning) {
			this.stop();
		} else {
			this.start();
		}
	}

	switch(): void {
		stop();
		this.switchMode();
		// TODO: run update handlers
	}

	reset(): void {
		this.stop();

		let currentModeDuration = this.getModeDurationSeconds();
		this.secondsLeft = currentModeDuration;
		this.runOnTickHandlers();
	}

	destroy(): void {
		// TODO: add time left saving
		this.stop();
	}

	registerOnTickHandler(handler: (newTime: string) => void): void {
		this.onTickHandlers.push(handler);
	}

	getHFTimeLeft(): string {
		let HFTime = utils.sToHF(this.secondsLeft);
		return HFTime;
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

		// this.secondsLeft = 5;

		this.clock = setInterval(() => {
			this.tick();
		}, oneSecondInMilliseconds);
	}

	private tick(): void {
		this.secondsLeft -= 1;
		this.runOnTickHandlers();
		if (this.secondsLeft == 0) {
			this.timeIsUp();
		}
	}

	// TODO: should I give it a name that implies that the function updates time
	// display instead of just running on tick handlers
	private runOnTickHandlers() {
		// TODO: see if the shortened names are good, check if there are
		// more traditional shortcuts
		const HFTime = this.getHFTimeLeft();
		this.onTickHandlers.forEach((onTickHandler) => onTickHandler(HFTime));
	}

	private timeIsUp(): void {
		if (!this.settings.continueAfterTimeIsUp) {
			// TODO: shouldn't it be hidden in some function
			this.switchMode();

			let notificationText = "Time is up!";
			this.notify(notificationText);

			this.reset();
		} else {
			// TODO: play sound, but don't stop

			let notificationText = "Time is up!";
			this.notify(notificationText);
		}
	}

	private stop(): void {
		this.isRunning = false;

		clearInterval(this.clock);
	}

	private notify(notificationText: string): void {
		// TODO: Add sound to both system and obsidian notifications

		if (this.settings.areSystemNotificationsPreferred) {
			utils.systemNotify(notificationText);
		} else {
			utils.obsidianNotify(notificationText);
		}
	}
}
