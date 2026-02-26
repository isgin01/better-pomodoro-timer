export type Mode = "work" | "break";

export type TODO = {
	element: HTMLElement;
	onClick: () => void;
	onAuxClick: () => void;
	// TODO: this is getting too bad, I would rather just pass timer and let it do its thing
	// But what about passing there what is not needed?
	registerOnTickHandler: (
		onTickHandler: (HFTimeRepresentation: string) => void,
	) => void;
	initialTime: string;
};
