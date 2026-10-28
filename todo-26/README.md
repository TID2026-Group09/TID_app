# todo-26

The reference to-do app for **Technical Interaction Design**, ITU, Autumn 2026 — built
live, in the lectures. Your team forks it in week 3.

## Getting the app from a particular lecture

Every lecture ends with a tag, so you can check out the app exactly as it stood when you
walked out of the room:

```bash
git clone https://github.com/itu-tid/todo-26.git
cd todo-26
git checkout week-01
npm install
npm run dev
```

`git checkout main` takes you back to the latest, and `git tag` lists every week that
exists so far. If you switch between tags, run `npm install` again — the dependencies
change as the course goes on.

### What is in week-01

Components, props, `children`, and rendering a list with keys. **Add** is wired up but only
logs — making it actually add something needs state, which is lecture 2.

The commits inside a week are the live coding as it happened, warts and dead ends
included. The **tag** is applied afterwards, once it has been tidied — so the commits show
you the process and the tag shows you the version worth reading.

## The notes

Written up at [itu-tid.github.io](https://github.com/itu-tid/itu-tid.github.io#readme),
with each week also bundled as a PDF at
[itu-tid.github.io/lecture-notes-pdf](https://itu-tid.github.io/lecture-notes-pdf/).
