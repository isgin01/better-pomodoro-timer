// TODO: consider replacing the type depency for workers

declare module "clock.worker" {
	class ClockWorker extends Worker {
		constructor();
	}

	export default ClockWorker;
}
