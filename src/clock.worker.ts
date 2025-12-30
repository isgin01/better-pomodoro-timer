import type { messageFromWorker, messageToWorker } from "types";

const clock: {
	isRunning: boolean;
	timeoutObject: NodeJS.Timeout | undefined;
	millisecondsLeft: number;
} = {
	isRunning: false,
	timeoutObject: undefined,
	millisecondsLeft: 0,
};

onmessage = async (event) => {
	let command: messageToWorker = event.data;

	if (command.action == "start") {
		clock.isRunning = true;

		let durationInMilliseconds = command.durationInSeconds * 1000;

		clock.timeoutObject = setTimeout(() => {
			clock.isRunning = false;
			let message: messageFromWorker = "finished";
			self.postMessage(message);
		}, durationInMilliseconds);
	} else if (command.action == "stop") {
		clock.isRunning = false;
		clearTimeout(clock.timeoutObject);
	}

	// } else if (command.action == "pause") {
};
