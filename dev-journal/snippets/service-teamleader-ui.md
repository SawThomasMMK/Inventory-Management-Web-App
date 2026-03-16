<!-- Leader indicator -->

<StarIcon
  v-if="team.leader && member.id === team.leader.id"
  class="w-4 h-4 text-amber-500"
/>

<!-- Ensure leader appears first -->
<div
  v-for="member in [...team.members].sort((a, b) => {
    if (team.leader && a.id === team.leader.id) return -1
    if (team.leader && b.id === team.leader.id) return 1
    return 0
  })"
  :key="member.id"
>

<!-- Edit position binding -->

<Input
  label="Position"
  v-model="editMemberForm.job_title"
  placeholder="Technician, Assistant, Lead..."
/>
