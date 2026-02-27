import { BetterPomodoroPluginSettings } from "settings";
import * as utils from "utils";
import type { Mode, OnTickTimeUpdater } from "types";

export default class Timer {
	secondsLeft: number;
	isRunning: boolean;

	// TODO: come up with a better name
	// onTickEventTimeUpdater
	// tickEventHandler
	// onTickTimeUpdate
	private onTickTimeUpdaters: OnTickTimeUpdater[];
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
		// TODO: load the previous mode
		this.mode = "work";
		this.secondsLeft = this.getCurrentModeDurationSeconds();
		this.onTickTimeUpdaters = [];
	}

	getHumanTimeLeft(): string {
		let HumanTime = utils.convertSecondsToHumanTime(this.secondsLeft);
		return HumanTime;
	}

	registerOnTickTimeUpdater(cb: (newTime: string) => void): void {
		this.onTickTimeUpdaters.push(cb);
	}

	destroy(): void {
		// TODO: add time left saving
		this.stop();
	}

	toggle(): void {
		if (this.isRunning) {
			this.stop();
		} else {
			this.start();
		}
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
		this.runOnTickTimeUpdaters();
		if (this.secondsLeft == 0) {
			this.timeIsUp();
		}
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

	private notify(notificationText: string): void {
		// TODO: Add sound to both system and obsidian notifications

		if (this.settings.areSystemNotificationsPreferred) {
			utils.systemNotify(notificationText);
		} else {
			utils.obsidianNotify(notificationText);
		}
	}

	private stop(): void {
		this.isRunning = false;

		clearInterval(this.clock);
	}

	switch(): void {
		stop();
		this.switchMode();
		// TODO: run on tick updater
	}

	private switchMode(): void {
		// TODO: there must be a more elegant way to do it
		const nextMode = this.mode == "work" ? "break" : "work";
		this.mode = nextMode;
	}

	reset(): void {
		this.stop();

		let currentModeDuration = this.getCurrentModeDurationSeconds();
		this.secondsLeft = currentModeDuration;
		this.runOnTickTimeUpdaters();
	}

	private getCurrentModeDurationSeconds(): number {
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

	private runOnTickTimeUpdaters() {
		// TODO: see if the shortened names are good, check if there are
		// more traditional shortcuts
		const humanTime = this.getHumanTimeLeft();
		this.onTickTimeUpdaters.forEach((updater) => updater(humanTime));
	}
}
