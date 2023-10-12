import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";

/**
 * Get's the file path to a module folder.
 * @param {string} moduleEntry
 * @param {string} fromFile
 */
const getModuleDir = (moduleEntry: string) => {
  const packageName = moduleEntry.includes("/")
    ? moduleEntry.startsWith("@")
      ? moduleEntry.split("/").slice(0, 2).join("/")
      : moduleEntry.split("/")[0]
    : moduleEntry;

  const require = createRequire(import.meta.url);
  const lookupPaths = require.resolve.paths(moduleEntry)?.map((p) => path.join(p, packageName));
  const resolvePath = lookupPaths?.find((p) => fs.existsSync(p));

  if (!resolvePath) {
    throw new Error("Failed to find the lib");
  }

  return resolvePath;
};

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
  #getBinPath(): string {
    switch (this.#platform) {
      case "darwin":
        return `${getModuleDir("standard-html-darwin-lib")}/bin/vnu`;
      case "win32":
        return `${getModuleDir("standard-html-win-lib")}/bin/vnu.bat`;
      case "linux":
        return `${getModuleDir("standard-html-linux-lib")}/bin/vnu`;
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
