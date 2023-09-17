interface W3CResult {
  message: string;
  extract: string;
  firstLine?: number;
  lastLine?: number;
  firstColumn?: number;
  lastColumn?: number;
}

/**
 * Represents a violation object with information about a violation.
 */
export interface Violation {
  /**
   * A description of the violation.
   */
  description: string;
  /**
   * The path of the file where the violation occurred.
   */
  path: string;
  /**
   * A snippet of code that caused the violation.
   */
  snippet: string;
}

export class ViolationParser {
  /**
   * Returns a summary of the given violations.
   * @param violations - An array of Violation objects.
   * @returns A string containing a summary of the given violations.
   */
  summary(violations: Violation[]): string {
    let summary = "";
    if (violations.length > 0) {
      summary += "Failed checks:\n";
      violations.forEach((violation) => {
        summary += `\t ${violation.description}\n`;
        summary += `\t • ${violation.path}\n`;
        summary += `\t • ${violation.snippet}\n`;
      });
    }
    return summary;
  }

  /**
   * Parses a W3C validation result and returns an array of violations.
   * @param w3cResult - The W3C validation result to parse.
   * @returns An array of violations.
   */
  parse(w3cResult: string): Violation[] {
    const result = JSON.parse(w3cResult) as { messages: W3CResult[] };

    const violations = result.messages.map((message) => {
      const line = message.firstLine ?? message.lastLine ?? 0;
      const column = message.firstColumn ?? message.lastColumn ?? 0;

      return {
        description: message.message.trim(),
        path: `line ${line}, column ${column}`,
        snippet: message.extract.replace(/\n/g, "").trim(),
      };
    });

    return violations;
  }
}
