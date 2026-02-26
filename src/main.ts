import { Plugin } from "obsidian";

import * as Settings from "./settings";
import Timer from "./timer";
import StatusBar from "./status-bar";

// TODO: update all deps step by step

export default class BetterPomodoroPlugin extends Plugin {
	settings: Settings.BetterPomodoroPluginSettings;
	timer: Timer;
	statusBar: StatusBar;

	async onload() {
		await this.loadSettings();
		this.timer = new Timer(this.settings);

		let statusBarItemEl = this.addStatusBarItem();
		// TODO: passing the entire timer object violates the X principle
		// But doing it any other way adds so much more code...
		this.statusBar = new StatusBar(statusBarItemEl, this.timer);

		this.addCommand({
			id: "toggle",
			name: "Toggle Better Pomodoro Timer",
			callback: () => {
				this.timer.toggle();
			},
		});

		this.addCommand({
			id: "switch",
			name: "Switch Better Pomodoro Timer Mode",
			callback: () => {
				this.timer.switch();
			},
		});

		this.addCommand({
			id: "reset",
			name: "Reset Better Pomodoro Timer",
			callback: () => {},
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
