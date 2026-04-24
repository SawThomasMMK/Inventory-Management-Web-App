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

## 2026-03-12 — Service Team Leader Indicator and Member Ordering

**Problem:**  
The Service Teams page needed to visually indicate the team leader and ensure the leader always appears at the top of the member list. Additionally, editing a member’s position from the Service Team page was not updating the employee record.

**Fix:**  
Used a Heroicons StarIcon to mark the leader by comparing member.id with team.leader.id. Sorted the members array during rendering so the leader appears first. Fixed the edit modal bindings so the position field correctly updates job_title through the PUT /employees/{id} endpoint.

**Lesson:**
UI indicators should rely on the API response structure rather than assumed fields. When editing shared data across pages, ensure form bindings match the fields used in the update request.

**Code:**
See snippet → snippets/service-team-leader-ui.md

## 2026-04-24 — Employee Department Not Displaying

**Problem:**  
The "Department" column in the Employees table showed empty values (`—`) even though employees were assigned to service teams.

**Fix:**  
Discovered that the backend returns a single `service_team_id` instead of a `service_teams` relationship array. Updated the frontend mapping logic to resolve the department name by matching `service_team_id` with the preloaded `serviceTeams` list. Also ensured `loadServiceTeams()` is called before `loadEmployees()` to avoid undefined lookups.

**Lesson:**  
Always verify the actual API response structure before implementing frontend mappings. Incorrect assumptions about relationships (one-to-many vs many-to-many) can cause silent UI issues.

**Code:**  
→ [View Snippet](snippets/employee-department-fix.md)

---

## 2026-04-24 — Vue Table Scoped Slot Undefined Row Error

**Problem:**  
Clicking the delete button caused a runtime error:  
`Cannot read properties of undefined (reading 'id')`

**Fix:**  
Corrected the table slot syntax by destructuring the `row` object in the scoped slot (`#cell-actions="{ row }"`), ensuring proper access to row data when triggering edit and delete actions.

**Lesson:**  
Scoped slots in Vue require explicit destructuring of passed props. Failing to do so results in undefined values and runtime errors.

**Code:**  
→ [View Snippet](snippets/vue-table-slot-fix.md)

Scratch:

- ~~We cant set someone as a teamleader if there is already a leader.~~
- ~~Team leader selection and changes~~
- active projects

To Do:

- employee departments
- mention UI fixes in page layout, search bar and add buttons
