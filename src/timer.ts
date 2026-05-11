import { PluginSettings } from "settings";
import * as utils from "./utils";

export type TimeUpdateHandler = (newTime: string) => void;

export enum Mode {
	work,
	break,
}

export type TimeLeft = {
	seconds: number;
	HFTime: string;
};

export default class Timer {
	private readonly settings: PluginSettings;
	private mode: Mode;
	private secondsLeft: number;
	private timeUpdateHandlers: TimeUpdateHandler[];

	private intervalId: number | undefined;

	isRunning: boolean;

	constructor(settings: PluginSettings) {
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
	getTimeLeft(): TimeLeft {
		let seconds = this.secondsLeft;
		let HFTime = utils.secondsToHF(seconds);
		return {
			seconds,
			HFTime: HFTime,
		};
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

		this.intervalId = setInterval(() => {
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
		var notificationText = "Time is up";

		if (this.settings.continueAfterTimeIsUp) {
			// TODO: play sound, but don't stop
			this.notify(notificationText);
		} else {
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

		clearInterval(this.intervalId);
	}

	switch(): void {
		this.mode = this.mode == Mode.work ? Mode.break : Mode.work;
		this.reset();
	}

	reset(): void {
		this.stop();
		this.secondsLeft = this.getCurrentModeDurationSeconds();
		this.runTimeUpdateHandlers();
		// this.notify("Time was reset")
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
