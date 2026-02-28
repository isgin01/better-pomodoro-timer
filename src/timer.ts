import * as utils from "./utils";
import type { OnTickTimeUpdater, BetterPomodoroPluginSettings } from "./types";
import { Mode } from "./enums";

export default class Timer {
	private isRunning: boolean;
	private secondsLeft: number;
	private onTickTimeUpdaters: OnTickTimeUpdater[];
	private clock: NodeJS.Timeout | undefined;
	private readonly settings: BetterPomodoroPluginSettings;
	private mode: Mode;

	constructor(settings: BetterPomodoroPluginSettings) {
		// TODO: rewrite the comment
		// Assign settings before all other props because it can used
		// in order to load/assign the other props
		this.settings = settings;

		// public props
		this.isRunning = false;

		// private props
		// TODO: load the previous mode instead
		this.mode = Mode.WORK;
		this.secondsLeft = this.getCurrentModeDurationSeconds();
		this.onTickTimeUpdaters = [];
	}

	getIsRunning(): boolean {
		return this.isRunning;
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
		const nextMode = this.mode == Mode.WORK ? Mode.BREAK : Mode.WORK;
		this.mode = nextMode;
	}

	getSecondsLeft(): number {
		return this.secondsLeft;
	}

	reset(): void {
		this.stop();
		this.secondsLeft = this.getCurrentModeDurationSeconds();
		this.runOnTickTimeUpdaters();
	}

	private getCurrentModeDurationSeconds(): number {
		if (this.mode == Mode.WORK) {
			var durationMinutesUnparsed = this.settings.workDurationInMinutes;
		}
		// TODO: } else if (this.mode == Mode.BREAK) {
		else {
			var durationMinutesUnparsed = this.settings.breakDurationInMinutes;
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
		const secondsLeft = this.getSecondsLeft();
		const humanTime = utils.convertSecondsToHumanTime(secondsLeft);
		this.onTickTimeUpdaters.forEach((updater) => updater(humanTime));
	}
}
