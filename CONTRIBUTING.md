# Contributing to Dev Toolbox

Thanks for your interest in contributing! 🎉

## How to Contribute

### Reporting Bugs

1. Check [existing issues](https://github.com/your-username/dev-toolbox/issues) first.
2. Open a new issue with a clear title and description.
3. Include browser/OS info and steps to reproduce.

### Suggesting Features

Open an issue with the `enhancement` label. Describe the tool or feature you'd like to see.

### Submitting Code

1. **Fork** the repo and create a feature branch:
   ```bash
   git checkout -b feature/my-new-tool
   ```

2. **Install** dependencies:
   ```bash
   npm install
   ```

3. **Develop** with the dev server:
   ```bash
   npm run dev
   ```

4. **Follow the patterns**: Look at existing tools in `src/components/tools/` for the structure:
   - Each tool is a React component (`.tsx`) with its own CSS file (`.css`)
   - Use the shared `CopyButton` component for all copy actions
   - Put reusable logic in `src/utils/`
   - Use CSS custom properties from `src/styles/global.css`

5. **Test** your changes manually in both dark and light mode, on desktop and mobile.

6. **Commit** with a clear message:
   ```bash
   git commit -m "feat: add base64 encoder/decoder tool"
   ```

7. **Push** and open a Pull Request.

## Code Style

- **TypeScript** — use proper types, avoid `any`
- **React** — functional components with hooks
- **CSS** — vanilla CSS with custom properties, co-located with components
- **Comments** — document non-obvious logic

## Adding a New Tool

1. Create `src/components/tools/MyTool.tsx` and `MyTool.css`
2. Add the tool to the `TABS` array in `src/components/App.tsx`
3. Update `README.md` with the new tool description

That's it! The tab navigation handles the rest.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
