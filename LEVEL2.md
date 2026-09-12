# Learning levels

The existing birthday adventure is Level 1, retaining its existing browser progress and 50 questions. Level 2 adds eight chapters and 32 missions. Open `#levels`, `#level1`, or `#level2`.

Level 2 includes powers 0–3, equation substitution and factoring, graphs, animated turns, a protractor with pointer/keyboard controls, missing-angle diagrams, and quadrilateral construction. The learner can print questions with worked answers. Progress stays local to the browser, separately under `mathcraft-level2`.

Mathematical boundaries: zero-to-zero is undefined in this course; physical lengths are nonnegative while algebra explores negative real numbers; two-variable linear equations need an additional constraint to give one pair; quadrilateral calculations reject crossings and degenerate outlines and support concave shapes. Displayed angles are rounded, calculations use full precision.

Checks: `node tests/calculations.cjs` and `node tests/level2.cjs`. Browser checks cover equation inputs, pointer angle placement and connection, quadrilateral construction, mission completion and persistence.

The root and dist copies support the existing static Vercel setup. Keep both synchronized when editing.
