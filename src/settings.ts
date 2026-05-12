import { App, PluginSettingTab, Setting, ToggleComponent } from "obsidian"
import BetterPomodoroPlugin from "./main"
import * as statusBar from "./status-bar"

export type PluginSettings = {
	// TODO: do they have to be strings?
	workDurationInMinutes: string
	breakDurationInMinutes: string
	areSystemNotificationsPreferred: boolean
	continueAfterTimeIsUp: boolean
	showStatusBar: boolean
	showCustomView: boolean
}

export const DEFAULT_SETTINGS: PluginSettings = {
	workDurationInMinutes: "60",
	breakDurationInMinutes: "15",
	areSystemNotificationsPreferred: false,
	continueAfterTimeIsUp: false,
	// Some may prefer using just hotkeys without graphic view.
	showCustomView: true,
	showStatusBar: true,
}

export class BetterPomodoroSettingsTab extends PluginSettingTab {
	plugin: BetterPomodoroPlugin

	constructor(app: App, plugin: BetterPomodoroPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): void {
		const { containerEl } = this

		containerEl.empty()

		new Setting(containerEl).setName("Status Bar").setHeading()

		new Setting(containerEl)
			.setName("Show Status Bar")
			.addToggle((component: ToggleComponent) => {
				component
					.setValue(this.plugin.settings.showStatusBar)
					.onChange(async (val: boolean) => {
						this.plugin.settings.showStatusBar = val
						await this.plugin.saveSettings()

						// TODO:
						this.plugin.reflectSettingsChange((ctx) => {
							statusBar.alterVisibility(val, ctx.statusBarItem)
						})
					})
			})

		new Setting(containerEl).setName("Timer View").setHeading()

		new Setting(containerEl)
			.setName("Show Custom View")
			.addToggle((component: ToggleComponent) => {
				component
					.setValue(this.plugin.settings.showCustomView)
					.onChange(async (newValue: boolean) => {
						this.plugin.settings.showCustomView = newValue
						await this.plugin.saveSettings()

						this.plugin.reflectSettingsChange((ctx) => {
							if (newValue) {
								ctx.loadCustomView()
							} else {
								ctx.hideCustomView()
							}
						})
					})
			})

		new Setting(containerEl).setName("Pomodoro options").setHeading()

		new Setting(containerEl).setName("Work duration").addText((text) => {
			text.setPlaceholder("Enter time in minutes")
				.setValue(this.plugin.settings.workDurationInMinutes)
				.onChange(async (minutes: string) => {
					if (validateNumericInput(minutes)) {
						this.plugin.settings.workDurationInMinutes = minutes
						await this.plugin.saveSettings()
					}
				})
		})

		new Setting(containerEl).setName("Break duration").addText((text) => {
			text.setPlaceholder("Enter time in minutes")
				.setValue(this.plugin.settings.breakDurationInMinutes)
				.onChange(async (minutes: string) => {
					if (validateNumericInput(minutes)) {
						this.plugin.settings.breakDurationInMinutes = minutes
						await this.plugin.saveSettings()
					}
				})
		})

		new Setting(containerEl)
			.setName("Continue running after time is up")
			.addToggle((component: ToggleComponent) => {
				component
					.setValue(this.plugin.settings.continueAfterTimeIsUp)
					.onChange(async (newValue: boolean) => {
						this.plugin.settings.continueAfterTimeIsUp = newValue
						await this.plugin.saveSettings()
					})
			})

		new Setting(containerEl).setName("Notifications").setHeading()

		new Setting(containerEl)
			.setName("Prefer system notification")
			.addToggle((component: ToggleComponent) => {
				component
					.setValue(
						this.plugin.settings.areSystemNotificationsPreferred,
					)
					.onChange(async (newValue: boolean) => {
						this.plugin.settings.areSystemNotificationsPreferred =
							newValue
						await this.plugin.saveSettings()
					})
			})
	}
}

// Check if given value is a valid amount of minutes
export function validateNumericInput(m: string): boolean {
	if (isNaN(Number(m))) {
		return false
	}
	return true
}
