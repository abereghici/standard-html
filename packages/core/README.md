# Standard HTML - W3C Validator

_Check if your HTML is compliant with W3C standards_

## Setup

Install package:

```shell
$ npm install --save-dev standard-html
```

## Usage

Usage example using `@testing-library/react` and `vitest`

```
import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import { validateMarkup } from "standard-html";

import App from "./App";

test("markup is valid", async () => {
  const { container } = render(<App />);

  const [violations, summary] = await validateMarkup(container);
  expect(violations).toEqual([]);
  expect(summary.length).toEqual(0);
});

```

Error output example:

<img src=https://raw.githubusercontent.com/abereghici/standard-html/main/example.png width=800 alt=screenshot>
