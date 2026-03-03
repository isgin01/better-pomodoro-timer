export type OnTickTimeUpdater = (newTime: string) => void;

// TODO: When should I use 'type' and when 'interface'?
export type BetterPomodoroPluginSettings = {
	workDurationInMinutes: string;
	breakDurationInMinutes: string;
	areSystemNotificationsPreferred: boolean;
	continueAfterTimeIsUp: boolean;
};

export type TimeLeft = {
	seconds: number;
	HFTime: string;
};
