import * as utils from "./utils";
import type * as types from "./types";
import { Mode } from "./enums";

export default class Timer {
	private readonly settings: types.BetterPomodoroPluginSettings;
	private isRunning: boolean;
	private mode: Mode;
	private secondsLeft: number;
	private timeUpdateHandlers: types.TimeUpdateHandler[];

	private interval: NodeJS.Timeout | undefined;

	constructor(settings: types.BetterPomodoroPluginSettings) {
		// It's important to make sure that seetings are assigned first since
		// they can be used for other props initialization
		this.settings = settings;

		// public props
		this.isRunning = false;

		// private props
		// TODO: load the previous mode instead
		this.mode = Mode.work;
		this.secondsLeft = this.getCurrentModeDurationSeconds();
		this.timeUpdateHandlers = [];
	}

	getCurrentMode(): string {
		return Mode[this.mode];
	}

	// TODO: decide if you need to leave this method here or use utils instead.
	// I think it doesn't violate DRY. Instead, it helps to avoid repeating code.
	getTimeLeft(): types.TimeLeft {
		let seconds = this.secondsLeft;
		let HFTime = utils.convertSecondsToHFTime(seconds);
		return {
			seconds,
			HFTime: HFTime,
		};
	}

	getIsRunning(): boolean {
		return this.isRunning;
	}

	registerTimeUpdateHandler(cb: (newTime: string) => void): void {
		this.timeUpdateHandlers.push(cb);
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

		this.interval = setInterval(() => {
			this.tick();
		}, oneSecondInMilliseconds);
	}

	private tick(): void {
		this.secondsLeft -= 1;
		this.runTimeUpdateHandlers();
		if (this.secondsLeft == 0) {
			this.timeIsUp();
		}
	}

	private timeIsUp(): void {
		if (this.settings.continueAfterTimeIsUp) {
			// TODO: play sound, but don't stop
			let notificationText = "Time is up!";
			this.notify(notificationText);
		} else {
			// TODO: shouldn't it be hidden in some function
			let notificationText = "Time is up!";
			this.notify(notificationText);

			this.switch();
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

		clearInterval(this.interval);
	}

	switch(): void {
		this.switchMode();
		this.reset();
	}

	private switchMode(): void {
		// TODO: there must be a more elegant way to do it
		const nextMode = this.mode == Mode.work ? Mode.break : Mode.work;
		this.mode = nextMode;
	}

	reset(): void {
		this.stop();
		this.secondsLeft = this.getCurrentModeDurationSeconds();
		this.runTimeUpdateHandlers();
	}

	private getCurrentModeDurationSeconds(): number {
		if (this.mode == Mode.work) {
			var durationMinutesUnparsed = this.settings.workDurationInMinutes;
		} else {
			var durationMinutesUnparsed = this.settings.breakDurationInMinutes;
		}

		// TODO: see if it makes sense to create a helper func that would
		// convert string minutes to integer seconds

		let durationMinutes = Number(durationMinutesUnparsed);
		let durationSeconds = durationMinutes * 60;

		return durationSeconds;
	}

	private runTimeUpdateHandlers() {
		let timeLeft = this.getTimeLeft();
		this.timeUpdateHandlers.forEach((timeUpdateHandler) =>
			timeUpdateHandler(timeLeft.HFTime),
		);
	}
}
