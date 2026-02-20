import * as utils from "../src/utils.ts";

describe("TODO", () => {
	it("TODO", () => {
		var seconds = 600;
		var expected = "00:10:00";
		var actual = utils.convertSecondsToHumanFriendlyRepresentation(seconds);
		expect(actual).toBe(expected);
	});
});
