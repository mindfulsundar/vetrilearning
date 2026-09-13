# Level 3 — Maths explorers

Six chapters: rational numbers, linear equations, understanding quadrilaterals, squares and square roots, cubes and cube roots, and comparing quantities. Each has small teaching steps, read-aloud, an experiment, and four missions (24 total).

The cube experiment projects three-dimensional unit-cube coordinates into SVG, supports rotation from 15–75 degrees, and adds/removes layers. It is a browser simulation, not a Blender render. Cubes inside the solid are included in the volume calculation.

Mission screens in Levels 2 and 3 offer chapter filters, preserve the selection for Next, and show the chapter in the right panel. Level 1 retains its existing filter and now explicitly names the chapter on the right. Level 3 printing respects its filter.

Level 3 progress currently uses its own browser-local storage key. Account/admin integration is a separate unfinished task; do not replace the current teaching files with the older account prototype.

Run node tests/level3.cjs plus all existing calculation and teaching tests. Browser checks cover the full cube, four-question filters, and next-question behaviour in Levels 2 and 3.
