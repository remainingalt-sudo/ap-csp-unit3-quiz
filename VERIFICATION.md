# Verification

## Passed

- Static build validation: complete deployable assets; all JavaScript parses.
- Question integrity: 112 unique IDs and unique question stems; four distinct choices each; one correct-answer index; explanations; eight valid topic groups; Easy/Medium/Hard.
- Additive scenario update: all original 80 questions retained; 32 scenarios added; four per topic, including all three difficulty levels.
- App Lab snippets: parse as JavaScript; manually reviewed commands, ID assumptions, execution order, random-number bounds, and intended debugging examples.
- Curriculum review: primary Code.org Unit 3 and App Lab references; no later-unit programming constructs required.
- 200 randomization trials: varied question sets, all 24 answer permutations, correct-answer mapping preserved.
- Full Review coverage: 25 questions with 3–4 per topic.
- Actual browser tests in Microsoft Edge: Quick Quiz, Full Unit Review, topic practice, Endless Practice, keyboard submission, answer locking, explanations, scoring, results, retry, missed and weak-topic practice.
- localStorage: submitted-answer persistence; locked question restored after refresh without another score increment; topic totals; older sessions using original question IDs load against expanded bank.
- Stats reset: cancellation retains progress; confirmation clears it.
- Direct hash routes and refresh verified.
- Desktop 1440px and mobile 390px layouts visually reviewed; no mobile page overflow across home, topics, code questions, results, stats, and curriculum notes.
- No browser JavaScript exceptions in the functional test run.

## Publication

Local static version is complete. Sites deployment is not verified or completed: its publishing tools were no longer callable after plugin selection. No public URL has been created.

## Behavior notes

Question order is random, so a short quiz is not guaranteed to include every question type. Scenarios are in the same pools used by every mode. Endless Practice does not repeat a question within a round; each new round begins a fresh shuffle and appears as a separate session in stats.
