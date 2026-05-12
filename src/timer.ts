import { PluginSettings } from "settings"
import { notify } from "./utils"

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
	isRunning: boolean

	private readonly settings: PluginSettings
	private mode: Mode
	private secondsLeft: number
	private onTickCallbacks: updateCallback[]
	private onToggleCallbacks: updateCallback[]

	private interval: NodeJS.Timer | undefined

	constructor(settings: PluginSettings) {
		// It's important to make sure that seetings are assigned first since
		// they can be used for other props initialization
		this.settings = settings

		// public props
		this.isRunning = false

		// private props
		// TODO: load the previous mode instead
		this.mode = Mode.work
		this.onTickCallbacks = []
		this.onToggleCallbacks = []

		this.resetSecondsCount(true)
	}

	private resetSecondsCount(tryRecover?: boolean) {
		// Set seconds count
		// First, try to restore from previous session if it wasn't explicitly stopped
		// Otherwise, simply use a value from settings

		// TODO: recover previous session

		this.secondsLeft =
			this.mode == Mode.work
				? this.settings.workDurationSecs
				: this.settings.breakDurationSecs
	}

	getCurrentMode(): string {
		return Mode[this.mode]
	}

	getTimeLeft(): TimeLeft {
		let seconds = this.secondsLeft
		let HFTime = secondsToHF(seconds)
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
			notify("Time's up")
			if (!this.settings.continueAfterTimeIsUp) {
				this.switch()
			}
		}
	}

	switch(): void {
		this.mode = this.mode == Mode.work ? Mode.break : Mode.work
		this.reset()
	}

	reset(): void {
		this.stop()
		this.resetSecondsCount()
		this.runOnTickCallbacks()
		this.runOnToggleCallbacks()
	}

	private stop(): void {
		this.isRunning = false

		clearInterval(this.interval)
	}

	private runOnTickCallbacks() {
		let timeLeft = this.getTimeLeft()
		this.onTickCallbacks.forEach((cb) => cb(timeLeft.HFTime))
	}

	private runOnToggleCallbacks() {
		this.onToggleCallbacks.forEach((cb) => cb())
	}
}

export function secondsToHF(secondsTotal: number) {
	// Add a minus sign to the string if the seconds amount is negative
	// and make the variable positive to avoid getting minus signs when
	// dividing
	var humanTime: string
	if (secondsTotal < 0) {
		humanTime = "-"
		secondsTotal *= -1
	} else {
		humanTime = ""
	}

	const secondsLeft = secondsTotal % 60
	const minutesTotal = (secondsTotal - secondsLeft) / 60
	const minutesLeft = minutesTotal % 60
	const hoursTotal = (minutesTotal - minutesLeft) / 60

	const paddedWithZerosTimeUnits = [hoursTotal, minutesLeft, secondsLeft].map(
		function padTimeUnitsWithZeros(timeUnit: number) {
			let paddedTimeUnit = String(timeUnit).padStart(2, "00")
			return paddedTimeUnit
		},
	)

	humanTime += paddedWithZerosTimeUnits.join(":")

	return humanTime
}
