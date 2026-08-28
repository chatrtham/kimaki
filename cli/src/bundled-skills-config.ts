export function buildBundledSkillsConfig({
  disabled,
  skillsDirectory,
}: {
  disabled: boolean
  skillsDirectory: string
}) {
  if (disabled) return {}
  return {
    skills: {
      paths: [skillsDirectory],
    },
  }
}
