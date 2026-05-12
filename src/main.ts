import { Plugin } from "obsidian"

import {
	DEFAULT_SETTINGS,
	PluginSettings,
	BetterPomodoroSettingsTab,
} from "./settings"
import Timer from "./timer"
import * as statusBar from "./status-bar"
import { CustomView, PLUGIN_CUSTOM_VIEW_ID } from "./custom-view"

export default class BetterPomodoroPlugin extends Plugin {
	// @ts-ignore
	settings: PluginSettings
	// @ts-ignore
	timer: Timer
	// @ts-ignore
	statusBarItem: HTMLElement
	// @ts-ignore
	customView: CustomView

	async onload() {
		await this.loadSettings()

		this.timer = new Timer(this.settings)

		this.registerView(PLUGIN_CUSTOM_VIEW_ID, (leaf) => {
			this.customView = new CustomView(leaf, this.timer)
			return this.customView
		})

		// this.loadCustomView()

		this.statusBarItem = this.addStatusBarItem()
		statusBar.build(this.statusBarItem, this.timer)
		statusBar.alterVisibility(
			this.settings.showStatusBar,
			this.statusBarItem,
		)

		this.addCommand({
			id: "toggle",
			name: "Toggle timer",
			callback: () => {
				this.timer.toggle()
			},
		})

		this.addCommand({
			id: "switch",
			name: "Switch mode",
			callback: () => {
				this.timer.switch()
			},
		})

		this.addCommand({
			id: "reset",
			name: "Reset",
			callback: () => {
				this.timer.reset()
			},
		})

		this.addSettingTab(new BetterPomodoroSettingsTab(this.app, this))
	}

	onunload() {
		this.timer.destroy()
	}

	private async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<PluginSettings>,
		)
	}

	loadCustomView() {
		if (this.settings.showCustomView) {
			var { workspace } = this.app
			let leaves = workspace.getLeavesOfType(PLUGIN_CUSTOM_VIEW_ID)
			if (!leaves.length) {
				let leaf = workspace.getRightLeaf(false)
				// TODO: is it ok to put ? here
				leaf?.setViewState({
					type: PLUGIN_CUSTOM_VIEW_ID,
					// TODO: what does "active" really do?
					// active: true,
				})
			}
		}
	}

	hideCustomView() {
		var { workspace } = this.app
		// var leaves = workspace.getLeavesOfType(PLUGIN_CUSTOM_VIEW_ID);
		// leaves.map((l) => { l.detach() })
		workspace.detachLeavesOfType(PLUGIN_CUSTOM_VIEW_ID)
	}

	reflectSettingsChange(cb: (ctx: BetterPomodoroPlugin) => void) {
		cb(this)
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}
}
