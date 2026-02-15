import { defineConfig } from "vite";

export default defineConfig({
    publicDir: "public",
    build: {
        lib: {
            entry: "src/bundle.manifests.ts",
            formats: ["es"],
            fileName: "oc-multi-hotspot-editor", // Changed to match the expected filename
        },
        outDir: "../wwwroot/App_Plugins/OCMultiHotspot",
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
            external: [/^@umbraco/],
        },
    },
});
