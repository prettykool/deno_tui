// Copyright 2021 Im-Beast. All rights reserved. MIT license.

// deno-lint-ignore ban-types
type DynamicValue<T> = T extends Function ? never : T | (() => T);

/** Extract static value from DynamicValue */
export function getStaticValue<T>(value?: DynamicValue<T>): T {
  return typeof value === "function" ? value() : value;
}

/**
 * Function to get whether given character is full-width
 * - Originally created by sindresorhus https://github.com/sindresorhus/is-fullwidth-code-point/blob/main/index.js
 * @param char - 1 character long string
 */
export function isFullWidth(char: string): boolean {
  if (char.length !== 1) {
    throw new Error("This function takes string that's 1 character long!");
  }

  const codePoint = char.charCodeAt(0);

  return (
    codePoint >= 0x1100 &&
    (codePoint <= 0x115f ||
      codePoint === 0x2329 ||
      codePoint === 0x232a ||
      (0x2e80 <= codePoint && codePoint <= 0x3247 && codePoint !== 0x303f) ||
      (0x3250 <= codePoint && codePoint <= 0x4dbf) ||
      (0x4e00 <= codePoint && codePoint <= 0xa4c6) ||
      (0xa960 <= codePoint && codePoint <= 0xa97c) ||
      (0xac00 <= codePoint && codePoint <= 0xd7a3) ||
      (0xf900 <= codePoint && codePoint <= 0xfaff) ||
      (0xfe10 <= codePoint && codePoint <= 0xfe19) ||
      (0xfe30 <= codePoint && codePoint <= 0xfe6b) ||
      (0xff01 <= codePoint && codePoint <= 0xff60) ||
      (0xffe0 <= codePoint && codePoint <= 0xffe6) ||
      (0x1b000 <= codePoint && codePoint <= 0x1b001) ||
      (0x1f200 <= codePoint && codePoint <= 0x1f251) ||
      (0x20000 <= codePoint && codePoint <= 0x3fffd))
  );
}

/**
 * Return actual width of the text expressed in columns of the terminal
 * @param text - text which width will be measured
 */
export function textWidth(text: string): number {
  text = removeStyleCodes(text);
  let width = 0;
  for (const letter of text) {
    width += isFullWidth(letter) ? 2 : 1;
  }
  return width;
}

/**
 * Clamps given number between min and max
 * @param number - number to be clamped
 * @param min - minimal value of clamped number
 * @param max - maximal value of clamped number
 */
export function clamp(number: number, min: number, max: number): number {
  return Math.min(Math.max(number, min), max);
}

/**
 * Rounds number and then clamps it between min and max
 * @param number - number to be rounded and clamped
 * @param min - minimal value of clamped number
 * @param max - maximal value of clamped number
 */
export function clampAndRound(
  number: number,
  min: number,
  max: number,
): number {
  return clamp(Math.round(number), min, max);
}

/**
 * Capitalizes first letter of given text
 * @param text - text to be capitalized
 * @example "sesquipedalian" -> "Sesquipedalian"
 */
export function capitalize(text: string): string {
  return text[0].toUpperCase() + text.slice(1);
}

/**
 * Removes style codes in text
 * @param text - text to be stripped out of style codes
 * @example "\x1b[32mHello!\x1b[0m" -> "Hello!"
 */
export function removeStyleCodes(text: string): string {
  // deno-lint-ignore no-control-regex
  return text.replace(/\x1b\[\d+m/g, "");
}
