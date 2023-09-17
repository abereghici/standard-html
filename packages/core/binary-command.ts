import path from "node:path";
import { fileURLToPath } from "node:url";

export interface BinaryCommandOptions {
  stdout?: boolean;
  "errors-only"?: boolean;
  "exit-zero-always"?: boolean;
  "also-check-css"?: boolean;
  html?: boolean;
  format?: "json" | "text" | "xml" | "gnu";
}

/**
 * Represents a binary command builder for the Nu Html Checker (v.Nu).
 */
export class BinaryCommand {
  /**
   * The options for the binary command.
   */
  #options: BinaryCommandOptions;
  /**
   * The platform on which the binary command is being executed.
   */
  #platform: NodeJS.Platform;

  /**
   * Creates a new instance of the BinaryCommand class.
   * @param platform The platform on which the binary command is being executed.
   * @param opts The options for the binary command.
   */
  constructor(platform: NodeJS.Platform, opts: BinaryCommandOptions = {}) {
    this.#platform = platform;

    this.#options = {
      stdout: true,
      "errors-only": true,
      "exit-zero-always": true,
      "also-check-css": true,
      html: true,
      format: "json",
      ...opts,
    };
  }

  /**
   * Gets the path to the v.Nu binary file based on the platform.
   * @returns The path to the v.Nu binary file.
   * @throws An error if the platform is not supported.
   */
  #getBinPath() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    switch (this.#platform) {
      case "darwin":
        return path.join(__dirname, "./lib/darwin/bin/vnu");
      case "win32":
        return path.join(__dirname, "./lib/win32/bin/vnu.bat");
      case "linux":
        return path.join(__dirname, "./lib/linux/bin/vnu");
      default:
        throw new Error(`Unsupported platform: ${process.platform}`);
    }
  }

  /**
   * Gets the options for the binary command as a string.
   * @returns The options for the binary command as a string.
   */
  #getOptions() {
    return Object.entries(this.#options)
      .map(([key, value]: [string, string | boolean]) => {
        return `--${key} ${value === true ? "" : String(value)}`;
      })
      .join(" ");
  }

  /**
   * Builds the command that can be used to validate HTML using the v.Nu binary.
   * @param html The HTML to validate.
   * @returns The command that can be used to validate HTML using the v.Nu binary.
   */
  build(html: string) {
    return `echo '${html}' | ${this.#getBinPath()} ${this.#getOptions()} -`;
  }
}
