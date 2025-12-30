export type stopMessageToWorker = {
	action: "stop";
};

export type startMessageToWorker = {
	action: "start";
	durationInSeconds: number;
};

export type messageToWorker = startMessageToWorker | stopMessageToWorker;

export type messageFromWorker = "finished";
