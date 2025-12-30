import { App, PluginSettingTab, Setting, ToggleComponent } from "obsidian";
import BetterPomodoroPlugin from "./main";

export interface BetterPomodoroPluginSettings {
	workDuration: string;
	areSystemNotificationsPreferred: boolean;
}

export const DEFAULT_SETTINGS: BetterPomodoroPluginSettings = {
	workDuration: "60",
	areSystemNotificationsPreferred: false,
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
				.setValue(this.plugin.settings.workDuration)
				.onChange(async (value) => {
					this.plugin.settings.workDuration = value;
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
	}
}
