/*!
 * sri sri guru gaurangau jayatah
 */

// Using compatibility logging: https://firebase.google.com/docs/functions/writing-and-viewing-logs#console-log
import 'firebase-functions/lib/logger/compat';
import { glob } from 'glob';

/**
 * Enumerating and exporting all functions for deployment.
 * Inspired by https://github.com/firebase/functions-samples/issues/170
 *
 * Functions are expected in the files with name ending with `.f`.
 *
 * Nested directories will result in nested function names, i.e. `dir.function1`.
 * The same effect can be achieved by naming the file as `dir.function1.f`.
 *
 * Named export can be used as well as ES6 default export or `module.exports`.
 */

glob
  .sync('./**/*.f.js', {
    cwd: __dirname,
    ignore: './node_modules/**',
  })
  .forEach((filePath: string) => {
    const modulePathSegments = filePath
      .slice(2, -5) // Removing ./ and .f.js suffix
      .split(/[/.]/g);

    // Current function name is stored in `FUNCTION_TARGET` environment variable since Node 10.
    // See https://cloud.google.com/functions/docs/env-var#nodejs_10_and_subsequent_runtimes
    if (
      process.env.FUNCTION_TARGET &&
      // Using `startsWith` because one module can contain several functions
      !process.env.FUNCTION_TARGET.startsWith(modulePathSegments.join('.'))
    )
      return;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const exported = require(filePath);

    // Pupolating `exports` with the module exports, with nesting.
    modulePathSegments.reduce((accum, segment, i, segments) => {
      return (accum[segment] =
        i === segments.length - 1
          ? // Assigning the module exports to the leaf segment
            exported.default || exported
          : // Otherwise either keeping existing hive or initializing it
            accum[segment] || {});
    }, exports);
  });
