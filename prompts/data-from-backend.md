Generate a Next.js application setup that fetches binary Protobuf data and decodes it using a WebAssembly (WASM) module written in Rust.

**Part 1: Rust WASM Decoder Module**

1.  **Project Setup:**
    * Provide `Cargo.toml` for a new Rust library project (`chart-decoder`).
    * List necessary dependencies: `wasm-bindgen`, `prost`, `serde`, `serde-wasm-bindgen`.
    * Include build dependencies: `prost-build`.
2.  **Protobuf Integration:**
    * Include a `build.rs` file to automatically compile the `trading_data.proto` file (assuming it's placed in `proto/`) into Rust structs using `prost-build`.
    * Show the resulting Rust struct definitions (or how they would look).
3.  **WASM Function:**
    * Create `src/lib.rs`.
    * Define a function `decode_chart_data(data: &[u8]) -> Result<JsValue, JsValue>` exposed via `#[wasm_bindgen]`.
    * This function should take a byte slice (`&[u8]`, which will come from a JavaScript `Uint8Array`).
    * Use `prost::Message::decode` to parse the bytes into the `ChartDataResponse` Rust struct.
    * Use `serde-wasm-bindgen::to_value` to convert the `ChartDataResponse` Rust struct (ensure it derives `Serialize`) into a JavaScript `JsValue` (which will appear as a JS object/array).
    * Handle potential decoding errors and return them as `JsValue` errors.
4.  **Build Instructions:** Provide `wasm-pack` commands to build this Rust code into an npm package (e.g., `wasm-pack build --target web`).

**Part 2: Next.js Frontend Application**

1.  **Project Setup:**
    * Show how to set up a new Next.js project (or assume one exists).
    * Explain how to include the locally built WASM package (e.g., using `npm link` or adding it as a file dependency in `package.json`).
2.  **React Component (`ChartDataViewer.tsx`):**
    * Create a React functional component using TypeScript.
    * Use `useState` to manage loading state, error state, and the decoded data.
    * Use `useEffect` for fetching and decoding:
        * Define an async function inside `useEffect`.
        * Dynamically `import` the WASM module (e.g., `import('chart-decoder')`). This is crucial for Next.js and WASM.
        * Fetch the data from `http://localhost:8080/api/chart-data`. Use `response.arrayBuffer()` to get the raw binary data.
        * Convert the `ArrayBuffer` to a `Uint8Array`.
        * Call the `decode_chart_data` function from the loaded WASM module.
        * Update the state with the result or any errors.
    * Render the component: Show a loading message, an error message, or display the decoded data (e.g., using `<pre>{JSON.stringify(data, null, 2)}</pre>`).
3.  **Next.js Configuration:** Mention any necessary adjustments to `next.config.js` for handling WASM, especially regarding `asyncWebAssembly` or `experiments`.

**Provide:**
* `Cargo.toml`, `build.rs`, `src/lib.rs`.
* `ChartDataViewer.tsx`.
* Key configuration snippets and commands.