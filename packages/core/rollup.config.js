import nodeResolve from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import copy from "rollup-plugin-copy";

export default {
  input: ["validator.ts", "validator.test.ts"],
  external: ["node:test", /node_modules/],
  plugins: [
    nodeResolve({
      extensions: [".ts"],
      preferBuiltins: true,
    }),
    babel({
      presets: ["@babel/preset-typescript"],
      extensions: [".ts"],
      skipPreflightCheck: true,
      babelHelpers: "bundled",
    }),
    terser({
      mangle: {
        keep_classnames: true,
      },
    }),
    copy({
      targets: [{ src: "lib", dest: "dist" }],
    }),
  ],
  output: {
    dir: "dist",
    format: "es",
    sourcemap: true,
  },
  preserveSymlinks: true,
};
