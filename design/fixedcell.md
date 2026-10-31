# Fixed Cell: channel plan (owned by Claude; started 31 Oct 2026, owner-approved)

## The channel
- **Name:** Fixed Cell. **Username:** @fixedcell (if taken: @fixedcell.daily, then @thefixedcell; the team member checks).
- **Bio:** "Broken spreadsheet? One fix a day, shown before → after. Save it for when yours breaks."
- **Logo:** one selected cell reading `$A$1` with the green fill-handle square at its corner. Source `design/brand/accounts/fixedcell-logo.svg`
  (IBM Plex Mono, OFL); 1080 × 1080 PNG in `templates/channels/fixedcell-logo.png` (the app's Download logo) and `design/brand/accounts/`.
- **Who posts:** a team member of the owner, from the app (Fixed Cell tab: profile card, reels, Copy post text, Save video, Mark uploaded),
  signed in with the second site account (BASIC_AUTH_USER_2). **When:** daily, 18:00-20:00 IST.
- **Audience:** everyday spreadsheet users (budgets, lists, small-business sheets, office work), not power users.

## The format
- One real problem, one fix, 15-18 s. The reel opens on the problem already on screen at frame 0: an error (#N/A, ####, #REF!, #VALUE!,
  #SPILL!, #DIV/0!) or a quietly wrong result (a short total, a wrong date, a broken sort).
- Hook: a question the viewer has asked themselves ("Why does your lookup break when you add a column?"), shown in full from frame 0
  (pale), each word inking in as the voice says it. The cover is the moment the title is complete (window.COVER).
- The middle shows why, literally: the column numbers, the left-aligned text, the hidden space. Then a visible fix: the pointer clicks the
  cell and the formula is retyped in the formula bar. It ends on the fixed sheet (green), holding about a second.
- One-take voice (Kokoro af_heart, speed 1.0) with breaths between sentences (`gap`, 0.45-0.6 s); every spoken line is on screen as a
  caption; at most ~46 words (the voice check's 2.7 words a second). Function names are spoken as words and shown in capitals
  ("V lookup" → VLOOKUP, "sum product" → SUMPRODUCT, lowercase "sum"/"trim" so the voice does not spell them out).
- Generic "spreadsheet" wording: no product names or logos on screen or in the voice. Function names are fine. The caption may say
  "Excel" and "Google Sheets" when it notes where the two apps differ.
- **Facts:** every formula behaviour is checked against the official function pages (support.microsoft.com, support.google.com) and
  cited in the config's `sources`. Teach only fixes that work in both apps, or say which app on screen (a note chip) and in the caption.
  This session's network blocks both hosts: dispatch the **Sources** workflow (it prints the cited pages in its log) and read it
  before the render; or ask the owner to allow both hosts in the environment.
- Example data only (Mug, Lamp, Rent, Power); no real companies or people.

## Look (distinct from @webin20sec's dark scenes)
- Paper white `#fbfaf6`, ink `#16181d`, one green accent `#138a4b` (the fill handle, the fix), red `#d4382c` only for what is broken.
- A crisp cell grid (row numbers, column letters, 40 px rows, 20 px cells), a monospace formula bar (IBM Plex Mono) with a cell-name box
  and a blinking caret while typing, a pointer that clicks, a context menu where the fix needs one. Type: Inter Tight.
- Fixed zones: label + live readout at 104 px (e.g. TOTAL · 0 in red → 125 in green), title then captions at 132-250 px, the formula bar
  and sheet below, note chips under the sheet (never below 750 px: Instagram's caption zone).
- Motion: the camera pushes in on the cell that matters, columns slide in when inserted, values count up or down, cells flash green
  when fixed. The faint page grid drifts so no frame is still.
- Film settings in the config: `"blur": 4, "shutter": 0.45, "grain": 3`, no vignette (light ground).

## How a reel is made
1. Scene `scripts/fixedcell/<slug>.html`: the shared engine (title, captions, sheet(), fx(), cam(), pointer) plus the reel's part below
   "THIS REEL". Copy the newest scene and replace that part (and the title, label and hook lines); every frame a pure function of t.
2. Config `scripts/fixedcell/<slug>.json`: name `showreel-fcNN-<slug>`, `"channel": "fc"`, dur 15-18, fps 60, voice with gaps,
   caption, 6+ keywords, exactly 5 hashtags, `sources`.
3. Checks before the one render: `node scripts/showreel/preflight.mjs <config>` (must say "fits"), `node scripts/fixedcell/qa.mjs <config>`
   (no text wider than its box, notes above 750 px), `node scripts/showreel/stills.mjs <config> <out>` (one sheet: cover shows the
   whole title, no overlap, no empty frame, every beat readable), and the Sources workflow read for every cited fact.
4. Render: Actions → Showreel → config = the json (it takes any config path). Then read the voice check in the run summary and look at the
   contact sheet and cover in the reels release. Re-render only for a real defect.
5. Schedule: an entry `{ "channel": "fc", "postOn": "YYYY-MM-DD" }` under the reel's name in templates/showreels/captions.json.
   Reels named `showreel-fc<digits>-…` land in the app's Fixed Cell tab.

## Craft bar (every reel)
- Frame 0 is a finished frame: the problem visible, the title in place. Something moves from the first frame.
- The problem is unmistakable without sound: a red error, a red total next to a readout saying what it should be.
- Something changes at least every ~3 s (camera, a column, the formula, a value); nothing still for more than ~1.2 s.
- Every spoken line is shown and finished; captions never cover the sheet; nothing clipped, nothing overlapping.
- The fix is typed where people type it (the formula bar), and the last ~1.5 s holds the fixed sheet.
- It teaches one concrete thing someone can use today; the caption carries the exact formula to copy.

## Post text
- One block, no labels: caption, a blank line, the first 6 keywords joined by " · ", a blank line, exactly 5 hashtags.
- Caption: the hook question first (with one emoji), then why it happens in plain words, then "Fix:" with the exact formula, then where
  it works (Excel version / Google Sheets) and the one caveat that matters, then a save invitation ("Save it for the next #N/A").
- Keywords: what people type into search for this problem, most specific first ("vlookup wrong value after inserting column",
  "numbers stored as text", "xlookup vs vlookup"), then the general ones ("excel lookup tips", "google sheets sum").
- Hashtags: 5 niche ones chosen for reach, most specific first: the function (#xlookup, #vlookup, #sumproduct), then #exceltips,
  #googlesheetstips, #excelformulas, #spreadsheettips, or a use (#budgetspreadsheet). Never broad tags (#excel alone, #tech, #viral).

## Lessons from the first renders (31 Oct: fc01-fc03)
- Pacing: the voice check read 2.73-2.92 words a second against its 2.7 limit (43-47 words in 14.7-17 s), and every hook is flagged
  "fast". Next scripts: at most 40 words for a 16-17 s reel, and cut a word from the hook rather than speed anything up.
- The recogniser hears "sum" as "some" (same sound): not a defect; the captions show SUM.
- The cover frame's pointer sits on the error cell (fc02, fc03): park the pointer beside the error until the title is complete.

## Weekly batch
A Sunday session makes the next 7 reels from the backlog below (strongest hooks first, never two from the same group in a row), runs
every check, renders each once and schedules them (postOn) for the coming week. The team member posts daily at 18:00-20:00 IST.

## Backlog (mark ✅ with the date and reel name when a topic ships)
Notes in brackets say where Excel and Google Sheets differ; check each against the function pages before making it.

### Errors
1. What does each error code mean? (#N/A, #REF!, #VALUE!, #DIV/0!, #NAME?: one line and one picture each)
2. Why does your cell show only ####? (a column too narrow for the number, or a negative date or time) [the negative-date #### is Excel only]
3. Why does your formula say #REF! after you delete a row? (a reference that pointed at the deleted cells)
4. Why does adding two cells give #VALUE!? (one of them is text, a space or a typed dash)
5. Why does your formula say #SPILL!? (something is in the way of the spilled results) [Excel; Sheets shows #REF! "would overwrite"]
6. Why does your average say #DIV/0!? (nothing to divide by yet; IFERROR or an IF on the count)
7. Why does your sheet say #NAME?? (a function name typo or text without quotes)
8. Why does your formula show as text instead of a result? (the cell is formatted as text, or it starts with a space/apostrophe)
9. How do you hide #N/A without hiding real problems? (IFNA instead of IFERROR)
10. Why does your formula point at itself? (a circular reference: the total includes its own cell)

### Lookups
21. ✅ 31 Oct, showreel-fc01-lookup-column: Why does your lookup break when you add a column? (VLOOKUP's column number; XLOOKUP points at the column)
22. ✅ 2 Nov, showreel-fc03-trim-space: Why does your lookup miss a name that's right there? (a trailing space; TRIM inside the lookup; Sheets trims typed text, so there the space comes from pastes and imports)
23. Why does your lookup find the wrong row? (VLOOKUP's last argument left out = approximate match; use FALSE / XLOOKUP's exact default)
24. Why can't VLOOKUP look to the left? (it only returns columns right of the key; XLOOKUP or INDEX + MATCH)
25. Why does your lookup fail on numbers that look the same? (a number vs a number stored as text: 1001 vs "1001")
26. How do you show "Not found" instead of #N/A? (XLOOKUP's if_not_found argument)
27. Why does your lookup only return the first match? (FILTER returns all of them)
28. Why does your lookup break when you copy it down? (the table range moves; $ to lock it)
29. How do you look up with two conditions? (XLOOKUP on joined keys, or FILTER)
30. Why does a lookup between two sheets suddenly break? (the other sheet was renamed or moved) [cross-file links differ: IMPORTRANGE in Sheets]

### Dates
31. Why does your date turn into a number like 45678? (a date is a number underneath; format it as a date)
32. Why does 03/04 mean March in one sheet and April in another? (the file's locale) [Sheets: File → Settings → Locale]
33. Why won't your dates sort in order? (dates stored as text; DATEVALUE)
34. How do you count days between two dates without counting weekends? (NETWORKDAYS)
35. Why is your age calculation off by one? (DATEDIF with "Y", not dividing by 365)
36. How do you get the month name from a date? (TEXT(date, "mmmm"))
37. Why does adding 1 month to 31 Jan give a weird date? (EDATE)
38. Why does your time total stop at 24 hours? (format [h]:mm) [Sheets: Format → Number → Duration]
39. How do you stop TODAY() from changing your saved dates? (Ctrl+; enters a fixed date)

### Text cleanup
41. How do you split a full name into first and last? (TEXTSPLIT) [Sheets: SPLIT]
42. Why does your join lose the space? (A2&" "&B2, or TEXTJOIN)
43. How do you fix NAMES IN CAPITALS? (PROPER)
44. Why do your phone numbers lose their leading zero? (they became numbers; text format or TEXT(A2,"0000000000"))
45. How do you pull the code out of "INV-2041-NY"? (TEXTBEFORE / TEXTAFTER) [Sheets: REGEXEXTRACT or SPLIT]
46. Why does a cell look empty but isn't? (a space; LEN shows it)
47. How do you remove the line breaks pasted into cells? (CLEAN / SUBSTITUTE with CHAR(10))
48. How do you find duplicates in a list? (COUNTIF > 1 with conditional formatting)

### Sums and counts
51. ✅ 1 Nov, showreel-fc02-sum-text: Why does SUM skip some of your numbers? (numbers stored as text; SUMPRODUCT(--range))
52. Why is your total different from the calculator? (cells show rounded values; ROUND the source)
53. How do you sum only one category? (SUMIF)
54. Why does SUMIF miss some rows? (spaces or different spelling in the criteria column)
55. Why does your total include the hidden rows? (SUBTOTAL(109, …) ignores rows you hide) [check Sheets filtered vs hidden rows]
56. How do you count cells that aren't empty? (COUNTA vs COUNT)
57. How do you count unique values? (COUNTA(UNIQUE(…)))
58. Why does your percentage show 1500%? (the number is already a percent; format, don't multiply by 100)
59. Why does your running total break when you sort? (relative references; $B$2:B2)
60. Why is 0.1 + 0.2 not exactly 0.3 in your check? (floating point; ROUND before comparing)

### Sorting and filtering
61. Why does sorting scramble your rows? (only one column was selected; sort the whole table)
62. Why does 10 sort before 2? (numbers stored as text)
63. How do you keep the header out of the sort? ("Data has header row")
64. How do you show only the rows you need without deleting any? (FILTER) [both apps; Sheets also has filter views]
65. Why does your filter miss new rows? (the range stops; use a table / whole columns)
66. How do you sort by a custom order like Low, Medium, High? (SORTBY with MATCH)

### Formatting
71. Why does your conditional formatting color the wrong rows? (the rule's reference needs $ on the column)
72. Why does your number show as 1.23E+11? (the column is too narrow for a long number; widen or format as number) [Excel; Sheets widens differently]
73. How do you make negative numbers red? (number format with a [Red] section)
74. Why does your "0" disappear? (a format hides zeros, or the cell is formatted as text)
75. How do you shade every other row? (a banded table / alternating colors)
76. Why does your currency symbol change when someone else opens the file? (locale-dependent format)

### Charts
81. Why does your chart skip months? (the dates are text; the axis treats them as labels)
82. Why does your chart drop to zero at the end? (empty cells plotted as zero; show gaps)
83. Why does your chart not grow with new data? (a fixed range; use a table or whole columns)
84. Why does your chart plot the year as a line? (the header row has a number; make it text)

### Shortcuts
91. How do you fill a formula down 1,000 rows in one move? (double-click the fill handle)
92. How do you lock a cell reference without typing $ signs? (F4 cycles $A$1 → A$1 → $A1 → A1) [Excel; Sheets uses F4 too on Windows]
93. How do you jump to the last row of your data? (Ctrl + ↓)
94. How do you paste values only? (Ctrl+Shift+V) [Sheets; Excel 365 has it too, older Excel uses Paste Special]
95. How do you see every formula on the sheet at once? (Ctrl + `)
96. How do you enter today's date in one keystroke? (Ctrl + ;)
