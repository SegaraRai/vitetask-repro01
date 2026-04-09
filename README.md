# vitetask-repro01

Minimal repro for the same dependency task being executed in parallel in `vp run`.

## Minimal structure

Only one workspace package is needed:

- `apps/app-a`

Inside `apps/app-a/vite.config.mjs`:

- `shared` is a normal task
- `unit:a` and `unit:b` both depend on `shared`
- `control` depends directly on `unit:a` and `unit:b`
- `parallel:a` runs `vp run unit:a`
- `parallel:b` runs `vp run unit:b`
- `parallel` depends on `parallel:a` and `parallel:b`
- `nested:wrapper` runs `vp run unit:a && vp run unit:b`
- `nested` depends on `nested:wrapper`
- `build` depends on `parallel`

## Parallel repro

```sh
vp run clean
vp run build:parallel
```

Then inspect `build.log`.

Expected:

- `@repro/app-a:shared` runs once

Observed:

- `@repro/app-a:shared` starts twice almost at the same time

Example:

```text
START ... @repro/app-a:shared ...
START ... @repro/app-a:shared ...
```

## Repro

```sh
vp run clean
vp run build:nested
```

Then inspect `build.log`.

Expected:

- `@repro/app-a:shared` runs once

Observed:

- `@repro/app-a:shared` runs twice

## Control case

```sh
vp run clean
vp run build:control
```

Expected and observed:

- `@repro/app-a:shared` runs once

## Reduction notes

This repo started from a larger diamond dependency repro. The following reductions were tested.

What does **not** trigger the issue:

- A direct shared dependency graph in a single execution graph
- Example: `control -> [unit:a, unit:b]`, where both `unit:*` depend on `shared`
- In this case `shared` is de-duplicated correctly and runs once

What **does** trigger the issue:

- Two sibling tasks that run nested `vp run` commands in parallel
- Example: `parallel -> [parallel:a, parallel:b]`, where each `parallel:*` runs `vp run unit:*`
- In this case the same `shared` task starts twice concurrently

What also **does** trigger the issue:

- A task that shells out to nested `vp run` invocations
- Example: `nested:wrapper = "vp run unit:a && vp run unit:b"`
- Each nested `vp run` invocation plans `shared` independently, so `shared` runs twice

Minimum confirmed trigger:

- One workspace package
- One shared dependency task
- Two sibling tasks that both depend on that shared task
- Two wrapper tasks that invoke `vp run` for those sibling tasks in parallel

Minimum confirmed trigger for duplicate execution without parallel overlap:

- One workspace package
- One shared dependency task
- Two sibling tasks that both depend on that shared task
- A wrapper task that invokes them sequentially via nested `vp run ... && vp run ...`

## Files

- Root scripts: `package.json`
- Task definitions: `apps/app-a/vite.config.mjs`
- Logging helper: `scripts/build.mjs`
