# /phkl images

Every file here is optional: the code checks for it and falls back to a
placeholder (a gradient tile, a stand-in photo, or nothing at all) until the
real file is committed. Drop a file in with the exact name below and it
appears on the next deploy - no code change needed.

## Quiz intro ("your brain speed isn't fixed")

Three photos in a row, cropped to fill (`object-cover`), roughly 80-96px tall
on screen. Shoot or crop them portrait-ish/square; landscape works too.
Suggested export: ~600x600px, JPEG.

| File | Shows |
| --- | --- |
| `quiz-intro-sleep.jpg` | Sleep |
| `quiz-intro-exercise.jpg` | Exercise |
| `quiz-intro-diet.jpg` | Diet |

Until they land, each tile is a warm gradient with its caption on top.

## Report

| File | Shows | Fallback while missing |
| --- | --- | --- |
| `screening-devices.png` | The assessment on phone/tablet/laptop | `/landing/woman-tablet.png` |
| `report-1.png` | A page of the full report | The pair of shots is hidden |
| `report-2.png` | Another page of the full report | The pair of shots is hidden |
| `memory-screening-package.png` | The hospital's own package poster | An HTML rebuild of the poster |

`report-1.png` and `report-2.png` show side by side, so give them a matching
shape. The poster renders full width of the section, so export it at least
1000px wide.
