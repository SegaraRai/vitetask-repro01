import { defineConfig } from "vite-plus";

export default defineConfig({
  run: {
    tasks: {
      build: {
        command: "node ../../scripts/build.mjs @repro/app-a dist/app-a.txt",
        dependsOn: ["parallel"],
        cache: false
      },
      nested: {
        command: "node ../../scripts/build.mjs @repro/app-a:nested dist/nested.txt",
        dependsOn: ["nested:wrapper"],
        cache: false
      },
      parallel: {
        command: "node ../../scripts/build.mjs @repro/app-a:parallel dist/parallel.txt",
        dependsOn: ["parallel:a", "parallel:b"],
        cache: false
      },
      control: {
        command: "node ../../scripts/build.mjs @repro/app-a:control dist/control.txt",
        dependsOn: ["unit:a", "unit:b"],
        cache: false
      },
      "nested:wrapper": {
        command: "vp run unit:a && vp run unit:b",
        cache: false
      },
      "parallel:a": {
        command: "vp run unit:a",
        cache: false
      },
      "parallel:b": {
        command: "vp run unit:b",
        cache: false
      },
      "unit:a": {
        command: "node ../../scripts/build.mjs @repro/app-a:unit-a dist/unit-a.txt",
        dependsOn: ["shared"],
        cache: false
      },
      "unit:b": {
        command: "node ../../scripts/build.mjs @repro/app-a:unit-b dist/unit-b.txt",
        dependsOn: ["shared"],
        cache: false
      },
      shared: {
        command: "node ../../scripts/build.mjs @repro/app-a:shared dist/shared.txt",
        cache: false
      }
    }
  }
});
