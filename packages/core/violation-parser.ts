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
   * Parses a W3C result string and returns an array of violations.
   * @param w3cResult - The W3C result string to parse.
   * @returns An array of violations.
   */
  parse(w3cResult: string): Violation[] {
    const result = JSON.parse(w3cResult) as { messages: W3CResult[] };

    return result.messages.map((message) => {
      const line = message.firstLine ?? message.lastLine ?? 0;
      const column = message.firstColumn ?? message.lastColumn ?? 0;

      return {
        description: message.message.trim(),
        path: `line ${line}, column ${column}`,
        snippet: message.extract.replace(/\n/g, "").trim(),
      };
    });
  }
}
