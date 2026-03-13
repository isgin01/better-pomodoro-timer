import { ItemView, Workspace, WorkspaceLeaf } from "obsidian";
import Timer from "timer";

export const PLUGIN_CUSTOM_VIEW_ID = "better-pomodoro-view";

export class CustomView extends ItemView {
	private timer: Timer;

	constructor(leaf: WorkspaceLeaf, timer: Timer) {
		super(leaf);
		this.timer = timer;
	}

	getViewType() {
		return PLUGIN_CUSTOM_VIEW_ID;
	}

	getDisplayText() {
		return "Pomodoro View";
	}

	onOpen: () => Promise<void> = async () => {
		const container = this.containerEl;
		container.empty();
		container.createDiv();

		container.createEl("button", { text: "toggle" }, () => {
			this.timer.toggle();
		});
		container.createEl("button", { text: "reset" }, () => {
			this.timer.reset();
		});
	};

	// TODO: does it make sense to keep the func in the class?
	async activate(workspace: Workspace) {
		var leaf: WorkspaceLeaf;
		const leaves = workspace.getLeavesOfType(PLUGIN_CUSTOM_VIEW_ID);

		// TODO: fix the type errors
		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getRightLeaf(false);
			await leaf.setViewState({
				type: PLUGIN_CUSTOM_VIEW_ID,
				active: true,
			});
		}

		workspace.revealLeaf(leaf);
	}

	async onClose() {
		// TODO: add clean up logic
	}
}
