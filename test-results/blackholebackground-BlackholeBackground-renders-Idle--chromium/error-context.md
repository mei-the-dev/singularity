# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]: "[plugin:vite:esbuild] Transform failed with 1 error: /run/media/mei/neo/singularity/ui/.storybook/preview.ts:19:11: ERROR: Expected \">\" but found \"className\""
  - generic [ref=e5]: /run/media/mei/neo/singularity/ui/.storybook/preview.ts:19:11
  - generic [ref=e6]: "Expected \">\" but found \"className\" 17 | decorators: [ 18 | (Story) => ( 19 | <div className=\"text-amber-100 antialiased selection:bg-amber-500/30 bg-black min-h-screen p-6\"> | ^ 20 | <Story /> 21 | </div>"
  - generic [ref=e7]: at failureErrorWithLog (/run/media/mei/neo/singularity/node_modules/esbuild/lib/main.js:1467:15) at /run/media/mei/neo/singularity/node_modules/esbuild/lib/main.js:736:50 at responseCallbacks.<computed> (/run/media/mei/neo/singularity/node_modules/esbuild/lib/main.js:603:9) at handleIncomingPacket (/run/media/mei/neo/singularity/node_modules/esbuild/lib/main.js:658:12) at Socket.readFromStdout (/run/media/mei/neo/singularity/node_modules/esbuild/lib/main.js:581:7) at Socket.emit (node:events:508:28) at addChunk (node:internal/streams/readable:559:12) at readableAddChunkPushByteMode (node:internal/streams/readable:510:3) at Readable.push (node:internal/streams/readable:390:5) at Pipe.onStreamRead (node:internal/stream_base_commons:189:23)
  - generic [ref=e8]:
    - text: Click outside, press Esc key, or fix the code to dismiss.
    - text: You can also disable this overlay by setting
    - code [ref=e9]: server.hmr.overlay
    - text: to
    - code [ref=e10]: "false"
    - text: in
    - code [ref=e11]: vite.config.js
    - text: .
```