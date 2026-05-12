import { PluginSettings } from "settings"
import * as utils from "./utils"

export type updateCallback = (time?: string) => void

export enum Mode {
	work,
	break,
}

export type TimeLeft = {
	seconds: number
	HFTime: string
}

export default class Timer {
	private readonly settings: PluginSettings
	private mode: Mode
	private secondsLeft: number
	private onTickCallbacks: updateCallback[]
	private onToggleCallbacks: updateCallback[]

	private interval: NodeJS.Timer | undefined

	isRunning: boolean

	constructor(settings: PluginSettings) {
		// It's important to make sure that seetings are assigned first since
		// they can be used for other props initialization
		this.settings = settings

		// public props
		this.isRunning = false

		// private props
		// TODO: load the previous mode instead
		this.mode = Mode.work
		this.secondsLeft = this.getSecondsLeft()
		this.onTickCallbacks = []
		this.onToggleCallbacks = []
	}

	getCurrentMode(): string {
		return Mode[this.mode]
	}

	// TODO: decide if you need to leave this method here or use utils instead.
	// I think it doesn't violate DRY. Instead, it helps to avoid repeating code.
	getTimeLeft(): TimeLeft {
		let seconds = this.secondsLeft
		let HFTime = utils.secondsToHF(seconds)
		return {
			seconds,
			HFTime: HFTime,
		}
	}

	registerUpdateCallback(type: "tick" | "toggle", cb: updateCallback): void {
		if (type == "tick") {
			this.onTickCallbacks.push(cb)
		} else if (type == "toggle") {
			this.onToggleCallbacks.push(cb)
		}
	}

	destroy(): void {
		// TODO: add time left saving
		this.stop()
	}

	toggle(): void {
		this.runOnToggleCallbacks()

		if (this.isRunning) {
			this.stop()
		} else {
			this.start()
		}
	}

	private start(): void {
		this.isRunning = true

		const oneSecondInMilliseconds = 1000

		this.interval = setInterval(() => {
			this.tick()
		}, oneSecondInMilliseconds)
	}

	private tick(): void {
		this.secondsLeft -= 1
		this.runOnTickCallbacks()
		if (this.secondsLeft == 0) {
			this.timeIsUp()
		}
	}

	private timeIsUp(): void {
		var notificationText = "Time is up"

		if (this.settings.continueAfterTimeIsUp) {
			// TODO: play sound, but don't stop
			this.notify(notificationText)
		} else {
			this.notify(notificationText)

			this.switch()
		}
	}

	private notify(notificationText: string): void {
		// TODO: Add sound to both system and obsidian notifications

		if (this.settings.areSystemNotificationsPreferred) {
			utils.systemNotify(notificationText)
		} else {
			utils.obsidianNotify(notificationText)
		}
	}

	private stop(): void {
		this.isRunning = false

		clearInterval(this.interval)
	}

	switch(): void {
		this.mode = this.mode == Mode.work ? Mode.break : Mode.work
		this.reset()
	}

	reset(): void {
		this.stop()
		this.secondsLeft = this.getSecondsLeft()
		this.runOnTickCallbacks()
		this.runOnToggleCallbacks()
	}

	private getSecondsLeft(): number {
		if (this.mode == Mode.work) {
			var durationMinutesUnparsed = this.settings.workDurationInMinutes
		} else {
			var durationMinutesUnparsed = this.settings.breakDurationInMinutes
		}

		// TODO: see if it makes sense to create a helper func that would
		// convert string minutes to integer seconds

		let durationMinutes = Number(durationMinutesUnparsed)
		let durationSeconds = durationMinutes * 60

		return durationSeconds
	}

	private runOnTickCallbacks() {
		let timeLeft = this.getTimeLeft()
		this.onTickCallbacks.forEach((cb) => cb(timeLeft.HFTime))
	}

	private runOnToggleCallbacks() {
		this.onToggleCallbacks.forEach((cb) => cb())
	}
}
