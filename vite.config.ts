import react from "@vitejs/plugin-react";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { defineConfig, UserConfigExport } from "vite";
import dts from "vite-plugin-dts";

const App = async (): Promise<UserConfigExport> => {
  let componentName = "hi";

  const data: string = await readFile(
    path.join(__dirname, "src", "lib", "index.tsx"),
    { encoding: "utf-8" }
  );

  const components = data.split("\n");

  for (const component of components.reverse())
    if (component.includes("export default"))
    componentName = component.replace("export default ", "").replace(" ", "");

  return defineConfig({
    plugins: [
      react(),
      dts({
        insertTypesEntry: true,
      }),
    ],
    build: {
      lib: {
        entry: path.resolve(__dirname, "src/lib/index.tsx"),
        name: componentName,
        formats: ["es", "umd"],
        fileName: (format) => `re-components.${format}.js`,
      },
      rollupOptions: {
        external: ["react", "react-dom"],
        output: {
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
        },
      },
    },
  });
};

export default App;
