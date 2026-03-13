import { Plugin } from "obsidian";

import * as settings from "./settings";
import Timer from "./timer";
import StatusBar from "./status-bar";
import type * as types from "./types";
import { CustomView, PLUGIN_CUSTOM_VIEW_ID } from "custom-view";

// TODO: update all the deps step by step

export default class BetterPomodoroPlugin extends Plugin {
	settings: types.PluginSettings;
	timer: Timer;
	statusBar: StatusBar;

	async onload() {
		await this.loadSettings();
		this.timer = new Timer(this.settings);

		// TODO: can I simplify these blocks?
		var customView: CustomView;
		this.registerView(PLUGIN_CUSTOM_VIEW_ID, (leaf) => {
			var customView: CustomView = new CustomView(leaf, this.timer);
			return customView;
		});

		if (this.settings.showCustomView) {
			var workspace = this.app.workspace;
			this.addRibbonIcon("dice", "Activate View", () => {
				customView.activate(workspace);
			});
		}

		let statusBarItemEl = this.addStatusBarItem();
		// TODO: passing the entire timer object violates PoLP
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
			new settings.BetterPomodoroPluginSettingsTab(this.app, this),
		);
	}

	onunload() {
		this.timer.destroy();
		this.statusBar.destroy();
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			settings.DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<types.PluginSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
