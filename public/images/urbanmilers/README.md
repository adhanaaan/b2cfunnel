# /urbanmilers images

**Almost nothing belongs here yet, on purpose.**

`/urbanmilers` is the `/mambacares` arc on a leaderboard of its own, and it
raises for the same Dementia Singapore campaign, so its report reads the same
photographs, crew logos and sponsor logos - the ones already committed one
folder over, in `../mambacares/`. Nothing to re-upload to get the report
looking right.

To give this run its own artwork, point the paths in
`src/config/urbanmilers.ts` (`URBANMILERS_PHOTOS`,
`URBANMILERS_RUNNING_PARTNERS`, `URBANMILERS_GIVEAWAY_SPONSORS`) at files in
this folder and drop them in with those names. Export rules - sizes, square
logos, what is cropped - are in `../mambacares/README.md`; they are the same
frames. Every file stays optional: while one is missing the report draws a warm
tile or the partner's name, never a broken image, and only `/urbanmilers`
changes.

## The TV board

The board at `/urbanmilers/leaderboard` **does** read this folder - its own
`board/` subfolder, which has its own README listing every file, its box and
the size to export it at. Each of those is optional too, so the board is live
and correct before any of them land.

## Campaign numbers, not images

The amount raised, the goal, the "last updated" date, the deadline and the
donation short link are in `src/config/urbanmilers.ts`. Edit that file and
redeploy to move the thermometer.
