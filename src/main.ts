import { Plugin } from "obsidian";

import * as Settings from "./settings";
import Timer from "./timer";
import StatusBar from "./status-bar";

export default class BetterPomodoroPlugin extends Plugin {
	settings: Settings.BetterPomodoroPluginSettings;
	timer: Timer;
	statusBar: StatusBar;

	async onload() {
		await this.loadSettings();
		this.timer = new Timer(this.settings);

		const statusBarItemEl = this.addStatusBarItem();
		this.statusBar = new StatusBar(statusBarItemEl, this.timer);

		this.addCommand({
			id: "toggle",
			name: "Toggle Better Pomodoro Timer",
			callback: () => {
				this.timer.toggle();
			},
		});

		this.addCommand({
			id: "reset",
			name: "Reset Better Pomodoro Timer",
			callback: () => { },
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(
			new Settings.BetterPomodoroPluginSettingsTab(this.app, this),
		);
	}

	onunload() {
		this.timer.destroy();
		this.statusBar.destroy();
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			Settings.DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<Settings.BetterPomodoroPluginSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
