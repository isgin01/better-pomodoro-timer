import { App, PluginSettingTab, Setting, ToggleComponent } from "obsidian";
import BetterPomodoroPlugin from "./main";
import type { BetterPomodoroPluginSettings } from "types";

export const DEFAULT_SETTINGS: BetterPomodoroPluginSettings = {
	workDurationInMinutes: "60",
	breakDurationInMinutes: "15",
	areSystemNotificationsPreferred: false,
	continueAfterTimeIsUp: false,
};

export class BetterPomodoroPluginSettingsTab extends PluginSettingTab {
	plugin: BetterPomodoroPlugin;

	constructor(app: App, plugin: BetterPomodoroPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl).setName("Work duration").addText((text) => {
			text.setPlaceholder("Enter time in minutes")
				.setValue(this.plugin.settings.workDurationInMinutes)
				.onChange(async (minutes: string) => {
					// TODO: check input
					this.plugin.settings.workDurationInMinutes = minutes;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl).setName("Break duration").addText((text) => {
			text.setPlaceholder("Enter time in minutes")
				.setValue(this.plugin.settings.breakDurationInMinutes)
				.onChange(async (minutes: string) => {
					// TODO: check input
					this.plugin.settings.breakDurationInMinutes = minutes;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Prefer system notification")
			.addToggle((component: ToggleComponent) => {
				component
					.setValue(
						this.plugin.settings.areSystemNotificationsPreferred,
					)
					.onChange(async (newValue: boolean) => {
						this.plugin.settings.areSystemNotificationsPreferred =
							newValue;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Continue running after time is up")
			.addToggle((component: ToggleComponent) => {
				component
					.setValue(this.plugin.settings.continueAfterTimeIsUp)
					.onChange(async (newValue: boolean) => {
						this.plugin.settings.continueAfterTimeIsUp = newValue;
						await this.plugin.saveSettings();
					});
			});
	}
}
