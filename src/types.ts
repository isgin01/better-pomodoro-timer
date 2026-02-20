export type StopMessageToWorker = {
	action: "stop";
};

export type StartMessageToWorker = {
	action: "start";
};

export type MessageToWorker = StartMessageToWorker | StopMessageToWorker;

export type MessageFromWorker = "finished";

export type Mode = "work" | "break";
