# 📝 Tiptap & ProseMirror: The Foundation

## 1. What is Tiptap?

**Tiptap** is a **headless** rich-text editor built on top of **ProseMirror**. It provides ready-made extensions and a friendly API so you don’t have to fight low-level ProseMirror complexities directly.

- **Headless:** It manages logic & state, but **you** design the UI (buttons, toolbar, styling).
- **Engine:** It uses ProseMirror internally as its core engine.

---

## 2. What is ProseMirror?

**ProseMirror** is a low-level JavaScript toolkit for building rich-text editors.

- It provides a powerful **document model** and **plugin system**.
- **The Catch:** It has **no UI** and is very complex to set up from scratch.

### 💡 Why do we need Tiptap?

ProseMirror alone is too low-level for most application developers. Tiptap acts as a wrapper that creates a better developer experience.

**Tiptap provides:**

- **Extensions:** Ready-to-use blocks for bold, italic, lists, code blocks, links, etc.
- **Framework Bindings:** specific packages like `@tiptap/react`.
- **Clean API:**
  - _Instead of:_ Manual ProseMirror transactions.
  - _You write:_ `editor.chain().focus().toggleBold().run()`

> **Summary:** “Tiptap = ProseMirror made friendly for real-world projects.”

---

# ⚛️ Tiptap React Hooks## 1. useEditor Hook

`useEditor` is a React hook that creates and manages a Tiptap editor instance for your component.

### How it works:

Think of it as: `useEditor = new Editor(...)`, but optimized for the React lifecycle.

### Why do we need it?

We need the editor to handle the component lifecycle automatically:

1.  **Mounting:** It creates the editor instance once when the component loads.
2.  **Configuration:** It allows you to set up:
    - `extensions` (functionality)
    - `content` (initial text)
    - `onUpdate` (event handlers)
3.  **Unmounting:** It properly **destroys** the editor instance to prevent memory leaks when the user leaves the page.

---

## 2. useEditorState Hook

`useEditorState` is a React hook that listens to **specific parts** of the editor state (like ‘is bold active?’) and re-renders your UI **only** when those parts change.

### How it works:

- It subscribes to Tiptap’s internal updates.
- It runs a **selector** (a check you define).
- If the result changes → it calls `setState` → The Toolbar re-renders with the new state.

### Why is this important?

Performance! It ensures your entire app doesn't re-render on every single keystroke, only the parts of the UI (like a bold button highlighting) that need to update.

---

# BubbleMenu is already built into Tiptap.

- You just import it, pass your editor instance, and Tiptap automatically shows the bubble near your selected text.
- I only design the UI inside it — Tiptap handles all positioning and state logic for me.
- BubbleMenu is for formatting existing text — it shows when you select something.

# FloatingMenu (cursor/empty-line based)

Appears when the cursor is in a certain position, usually:
On an empty paragraph
Or wherever you configure with shouldShow
Great for block-level actions
Add heading, list, quote, image, component, etc.
Feels like Notion's “+” or slash menu

# Attached to the line/block, not the selection

Use FloatingMenu when:

- You want tools to appear when the user is about to insert something new
- You are doing block-level operations:
- Change paragraph → heading
- Turn line into list / quote / code block
- Insert image, divider, custom components
- You want a Notion-like block insert menu on empty lines

“User is on an empty line → show FloatingMenu with block options.”

---

1. What getRootProps() Returns
   getRootProps() comes from React Dropzone. It returns an object containing event handlers and accessibility attributes required for the drag-and-drop area.

The returned object looks like this:

{
onClick, // Handles the click to open file picker
onDragEnter, // Visual feedback when dragging enters
onDragLeave, // Visual feedback when dragging leaves
onDragOver, // Allows the drop event
onDrop, // The core function receiving the files
role, // Accessibility (e.g., "presentation")
tabIndex, // Keyboard navigation support
aria-\* // Accessibility attributes
}

2. Why We Spread It ({...getRootProps()})
   We spread this object onto the container div to wire up all those event listeners automatically.

<div {...getRootProps()}>
  {/* Content */}
</div>

"This makes the entire div behave like a file input. It tells React: 'If anyone drops a file on this specific div, trigger the onDrop function immediately.'"

3. The Hidden Input Logic
   Why do we need a hidden input? Only an <input type="file"> element has the native browser capability to open the OS file picker window. The div is just for custom UI; the hidden input does the heavy lifting.

🔄 Workflow: What happens when the user clicks?
User clicks the Container <div {...getRootProps()}>

React Dropzone programmatically triggers the Hidden Input

The native File Picker window opens

User selects a file

The Input fires the onChange event

React Dropzone catches this and calls onDrop

Finally, your handleFileSelect() executes

Summary: "This hidden input is the bridge between browser security and our custom UI."

4. UploadThing Technical Note
   Important Type Definition:

The function startUpload is defined to accept an Array of Files, not a single File object.

❌ Incorrect: File (Single Object)

✅ Correct: File[] (Array of Files)

Reason: UploadThing is designed to handle multiple file uploads by default, so it always expects the data to be wrapped in an array, even if you are only uploading one file.

TypeScript

// Example usage
startUpload([selectedFile]); // Must pass as array
