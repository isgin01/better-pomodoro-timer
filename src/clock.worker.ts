import type { MessageToWorker } from "types";

onmessage = async (event) => {
	let command: MessageToWorker = event.data;

	switch (command.action) {
		case "start":
			onStart();
		case "stop":
			onStop();
	}
};

var intervalObject: NodeJS.Timeout | undefined;

function onStart() {
	const oneSecondInMilliseconds = 1000;

	setInterval(() => {
		console.log("tick");
		postMessage("tick");
	}, oneSecondInMilliseconds);
}

function onStop() {
	clearInterval(intervalObject);
}
