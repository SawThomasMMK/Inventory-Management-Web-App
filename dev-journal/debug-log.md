# Developer Debug Journal

## 2026-03-12 — Vue Modal Rendering Issue

**Problem:**  
The modal opened but only displayed a dark overlay with no visible content.

**Fix:**  
Removed the outdated Tailwind vertical alignment pattern (`inline-block`, `align-middle`, spacer span) and replaced it with a flex-based centered layout.

**Lesson:**  
Legacy CSS layout patterns can break modern component rendering (Teleport, transitions). Prefer flexbox for modal positioning.

**Code:**  
→ [View Snippet](snippets/modal-layout-fix.md)

---

## 2026-03-12 — API Validation Error (422) During Product Update

**Problem:**  
Updating a product returned a `422 Unprocessable Entity` error from the Laravel API.

**Fix:**  
Converted numeric form values (`quantity`, `price`) from strings to numbers before sending the request.

**Lesson:**  
Frontend forms often produce strings; APIs may enforce strict types. Always validate and transform request payloads before sending.

**Code:**  
→ [View Snippet](snippets/api-number-conversion.md)

---

## 2026-03-12 — Vue v-model Prop Mutation Error

**Problem:**  
Vue threw an error because `v-model` was used directly on a prop in a child component (`ConfirmDelete.vue`).

**Fix:**  
Replaced `v-model` with explicit `:isOpen` binding and emitted `update:isOpen` events.

**Lesson:**  
Props in Vue are immutable. Child components must communicate changes through emitted events rather than modifying props.

**Code:**  
→ [View Snippet](snippets/vue-prop-update-pattern.md)

---

## 2026-03-12 — Modal Rendering Inside Table Rows

**Problem:**  
The delete confirmation modal was rendered inside each table row, causing multiple hidden modal instances and unnecessary component duplication.

**Fix:**  
Moved the `ConfirmDelete` component outside the table and controlled it with a single page-level state (`showDeleteModal`).

**Lesson:**  
State-driven UI components such as modals should exist once at the page level rather than inside repeated UI structures.

**Code:**  
→ [View Snippet](snippets/modal-placement-fix.md)
