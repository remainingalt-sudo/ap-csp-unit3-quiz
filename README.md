# AP CSP Unit 3 Study Lab

A complete, buildless static quiz website for Code.org AP Computer Science Principles Unit 3: Intro to App Design. No login, backend, or runtime dependencies.

## Run

Open `dist/index.html` directly, or run `npm start` with Node.js and open http://127.0.0.1:4173. Use a hosted address or the local server for reliable saved progress and link sharing; browser handling of localStorage on file URLs varies.

## Deploy and share

Publish the **contents of `dist/`** on any static hosting service. The site uses hash navigation, so refresh and direct links such as `/#stats` and `/#topics` need no special redirect rules. All application assets are local; optional Google Fonts fall back to system fonts.

`npm run build` verifies the existing static files and runs the automated logic checks. There is no bundler or dependency installation. `npm test` runs bank and engine checks.

## Included

- 112 original four-choice questions across eight topic groups and Easy, Medium, Hard.
- 80 original core questions in `dist/questions.js`, preserved with stable IDs.
- 32 additive real-world scenarios in `dist/scenarios.js`: four per topic group, with all three difficulties in each group. They share the same shuffled pools in all modes.
- Quick Quiz (10), balanced Full Unit Review (25; 3–4 per topic), topic practice (14), and Endless Practice.
- Answer selection, explicit submission, locked answers, correct-answer display, explanation, and explicit Next Question.
- Results, topic accuracy, retry, missed questions, and weak-topic practice.
- Stats, recent misses, confirmed reset, and persistent in-progress quizzes.
- Responsive design, keyboard access, screen-reader labels, visible focus, and reduced-motion support.

Endless Practice has no repeated IDs within a round. After all 112 questions, it starts a fresh shuffled round. Each completed round is a quiz in recent history; finishing early reports the current round. Scores are saved immediately on submission; returning to a locked question after refresh never adds another attempt. Starting a different mode ends an existing session and records its submitted answers.

## Add questions

Questions have `id`, `topic`, `difficulty`, `question`, `choices`, `correctAnswer` (index), `explanation`, and optional `code`. Scenario questions also have `kind: 'scenario'`. IDs must stay stable and unique. Add rows to either question file. The engine shuffles answer indices and compares the original index, so shuffling preserves correctness. Topic metadata is in `questions.js`; behavior is separate in `engine.js` and `app.js`.

Saved data lives under `studylab-csp-unit3-v1` in localStorage. The additive scenario update changes neither that key nor existing IDs nor the saved structure. Progress belongs to a browser and origin; it is not shared between different hostnames/devices. No progress is sent to a server.

## Curriculum

Independent resource; not an official Code.org assessment. Questions are original and avoid later-unit requirements such as loops, lists, conditionals, and custom procedures. Referenced elements and uploaded assets are assumed to exist unless an error is explicitly described.

Reviewed against primary references:

- [Unit 3 Intro to Programming, 2025](https://studio.code.org/courses/csp-2025/units/3/lessons/5)
- [Unit 3 Debugging, 2022](https://studio.code.org/courses/csp-2022/units/3/lessons/7)
- [App Lab randomNumber](https://studio.code.org/docs/ide/applab/expressions/randomNumber_min_max)
- [Intro to App Lab teacher guide](https://lesson-plans.code.org/applab-intro/20220317223454/teacher-lesson-plans/Intro-to-App-Lab.pdf)

Lesson numbers can vary by curriculum year. The question bank follows the Intro to App Design scope of this project.
