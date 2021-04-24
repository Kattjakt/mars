# Mars

A procedural planet drawn on a HTML canvas.

https://kattjakt.github.io/mars

---

The original intent was to generate a procedural planet using only the current time and x/y-position (similar to fragment shaders).

For a while it featured 3D OpenSimplex noise `(x, y, t)` for the hill generation, but it was later scrapped since I didn't feel like pulling in external dependencies or bundling a full noise implementation.

The hill generation now works by utilizing the following seedable RNG to generate *n* random `[x, y]` points for each row, and draws the hill using `Canvas.quadraticCurveTo` with lookbehind for pretty and curvy curves. Since lookbehind requires the previous point (obviously), we sadly need to store one additional state. Since the RNG is deterministic we could in theory get the RNGs previous value and draw the curves on the fly, but I ain't got time for that.

```ts
function* random(seed = 0): Generator<number, number> {
  while (true) {
    seed = (seed * 16807) % 2147483647;
    yield (seed - 1) / 2147483646;
  }
}
```
