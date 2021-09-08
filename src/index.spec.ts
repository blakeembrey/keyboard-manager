import { expectType } from "ts-expect";
import { Keyboard, createShortcuts, stringifyKey, Event } from "./index";

expectType<Event>({} as KeyboardEvent);

describe("keyboard manager", () => {
  it("should manage keyboard shortcuts", () => {
    let triggered = 0;

    const keyboard = new Keyboard();
    const event1: Event = { key: "a", metaKey: true };
    const event2: Event = { key: "0" };
    const handler = keyboard.getHandler();

    const listener = createShortcuts({
      [stringifyKey("cmd", "a")]: () => {
        triggered++;
      },
    });

    keyboard.addListener(listener);

    handler(event1);
    handler(event2);

    keyboard.removeListener(listener);

    handler(event1);
    handler(event2);

    expect(triggered).toEqual(1);
  });

  it('should support a "global" pattern', () => {
    const dispatcher = new Keyboard();
    const handler = dispatcher.getHandler();

    let appTriggered = 0;
    let globalTriggered = 0;

    const appKeyboard = new Keyboard();
    const globalKeyboard = new Keyboard();

    dispatcher.addListener(appKeyboard.getListener());
    dispatcher.addListener(globalKeyboard.getListener());

    globalKeyboard.addListener(
      createShortcuts({
        [stringifyKey("cmd", "a")]: () => {
          globalTriggered++;
        },
      })
    );

    appKeyboard.addListener(
      createShortcuts({
        [stringifyKey("a")]: () => {
          appTriggered++;
        },
        [stringifyKey("cmd", "a")]: () => {
          appTriggered++;
        },
      })
    );

    handler({ key: "a", metaKey: true });

    expect(appTriggered).toEqual(0);
    expect(globalTriggered).toEqual(1);

    handler({ key: "a" });

    expect(appTriggered).toEqual(1);
    expect(globalTriggered).toEqual(1);
  });
});
