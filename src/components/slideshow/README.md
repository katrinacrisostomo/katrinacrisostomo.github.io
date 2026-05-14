# Slideshow layout patterns

`Slide` keeps a consistent max width/height but does not force an internal layout.

Recommended patterns:

- Two-column content: `flex flex-col items-center gap-8 md:flex-row md:gap-12`
- Tile row: `grid grid-cols-1 gap-4 md:grid-cols-4`
