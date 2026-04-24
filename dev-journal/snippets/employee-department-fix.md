### Employee Department Mapping Fix

```js
employees.value = data.data.map((employee) => ({
  ...employee,
  name: `${employee.first_name} ${employee.last_name}`,

  department: employee.service_team_id
    ? serviceTeams.value.find((t) => t.id === employee.service_team_id)?.name || '—'
    : '—',

  status: employee.is_active ? 'Active' : 'Inactive',
}))
```

### Important

```js
onMounted(async () => {
  await loadServiceTeams()
  await loadEmployees()
})
```
