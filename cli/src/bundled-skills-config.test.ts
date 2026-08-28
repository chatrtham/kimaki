import { describe, expect, test } from 'vitest'
import { buildBundledSkillsConfig } from './bundled-skills-config.js'

describe('buildBundledSkillsConfig', () => {
  test('loads bundled skills by default', () => {
    expect(
      buildBundledSkillsConfig({
        disabled: false,
        skillsDirectory: '/opt/kimaki/skills',
      }),
    ).toEqual({
      skills: {
        paths: ['/opt/kimaki/skills'],
      },
    })
  })

  test('omits bundled skills when disabled', () => {
    expect(
      buildBundledSkillsConfig({
        disabled: true,
        skillsDirectory: '/opt/kimaki/skills',
      }),
    ).toEqual({})
  })
})
