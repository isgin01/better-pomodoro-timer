export class Notice {}
export class Menu {
	addItem() {}
	showAtMouseEvent() {}
}

// TODO: write a better comment #1
// the mock is needed to test CustomView because it extends ItemView and calls "super" method
export class ItemView {
	// there's no need for a specific type because it doesn't do anything
	public containerEl: object;

	constructor() {
		// TODO: write a better comment #2

		// return mock functions that return reference to the object itself;
		// jest.fn are used in tests to count amount of calls;
		// used to simulate DOM manipulations
		let mock: any = {
			empty: jest.fn(() => mock),
			createDiv: jest.fn(() => mock),
			createSpan: jest.fn(() => mock),
			createEl: jest.fn(() => mock),
			addEventListener: jest.fn(() => mock),
		};

		this.containerEl = mock;
	}
}
