import { exec } from "node:child_process";
import { promisify } from "node:util";

import { BinaryCommand } from "./binary-command";
import { Violation, ViolationParser } from "./violation-parser";

/**
 * The Validator class provides a way to validate HTML documents using the W3C HTML validator.
 */
export class Validator {
  /**
   * The platform on which the NodeJS application is running.
   * @private
   */
  #platform: NodeJS.Platform;

  /**
   * Creates a new instance of the Validator class.
   * @param platform - The platform on which the NodeJS application is running.
   */
  constructor(platform: NodeJS.Platform) {
    this.#platform = platform;
  }

  /**
   * Prepares the HTML document for validation.
   * @private
   * @param html - The HTML document to prepare.
   * @returns The prepared HTML document.
   */
  #prepareHtml(html: string | HTMLElement): string {
    const htmlString = typeof html === "string" ? html : html.outerHTML;

    /**
     * If the input is a full HTML document, it is returned as is.
     * Otherwise, it is wrapped in a minimal HTML document to avoid markup structure errors.
     */
    const isFullDocument = htmlString.includes("<html");

    if (isFullDocument) {
      return htmlString;
    }

    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>HTML</title>
  </head>
  <body>
  ${htmlString}
  </body>
</html>`;
  }

  /**
   * Executes the binary for HTML validation.
   * @private
   * @param html - The HTML document to validate.
   * @returns The output of the validation.
   */
  async #executeBinary(html: string | HTMLElement): Promise<string> {
    const execPromise = promisify(exec);

    const command = new BinaryCommand(this.#platform).build(this.#prepareHtml(html));

    const result = await execPromise(command);

    return result.stdout;
  }

  /**
   * Validates the given HTML string or HTMLElement using an external binary.
   * @param html The HTML string or HTMLElement to validate.
   * @returns A Promise that resolves to a tuple containing an array of Violations and a summary string.
   */
  async validate(html: string | HTMLElement): Promise<[Violation[], string]> {
    const output = await this.#executeBinary(html);

    const parser = new ViolationParser();

    const violations = parser.parse(output);
    const summary = parser.summary(violations);

    return [violations, summary];
  }
}

/**
 * Validates HTML markup using the createValidator function.
 * @param html - The HTML markup to be validated.
 * @returns A Promise that resolves with the validation result.
 */
export const validateMarkup = async (
  html: string | HTMLElement,
): Promise<[Violation[], string]> => {
  return new Validator(process.platform).validate(html);
};
