export type TimeUpdateHandler = (newTime: string) => void;

// TODO: When should I use 'type' and when 'interface'?
export type PluginSettings = {
	workDurationInMinutes: string;
	breakDurationInMinutes: string;
	areSystemNotificationsPreferred: boolean;
	continueAfterTimeIsUp: boolean;
	showCustomView: boolean;
};

export type TimeLeft = {
	seconds: number;
	HFTime: string;
};
