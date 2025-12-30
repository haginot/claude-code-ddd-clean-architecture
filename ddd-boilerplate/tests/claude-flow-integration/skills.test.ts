const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', '..', '.claude', 'skills');

describe('DDD Skills Configuration', () => {
  const requiredSkills = [
    'ddd-entity-builder',
    'architecture-guardian',
    'repository-generator',
    'domain-event-publisher',
  ];

  it.each(requiredSkills)('should have %s skill defined', (skillName) => {
    const skillPath = path.join(SKILLS_DIR, skillName, 'skill.md');
    expect(fs.existsSync(skillPath)).toBe(true);
  });

  it.each(requiredSkills)('%s skill should have required sections', (skillName) => {
    const skillPath = path.join(SKILLS_DIR, skillName, 'skill.md');
    const content = fs.readFileSync(skillPath, 'utf8');

    // All skills should have purpose/trigger/workflow
    expect(content).toMatch(/目的|Purpose/i);
    expect(content).toMatch(/トリガー|Trigger/i);
    expect(content).toMatch(/ワークフロー|Workflow/i);
  });

  describe('ddd-entity-builder', () => {
    it('should mention Entity base class', () => {
      const skillPath = path.join(SKILLS_DIR, 'ddd-entity-builder', 'skill.md');
      const content = fs.readFileSync(skillPath, 'utf8');
      expect(content).toMatch(/Entity<T>|Entity</);
    });

    it('should mention AggregateRoot', () => {
      const skillPath = path.join(SKILLS_DIR, 'ddd-entity-builder', 'skill.md');
      const content = fs.readFileSync(skillPath, 'utf8');
      expect(content).toMatch(/AggregateRoot/);
    });
  });

  describe('architecture-guardian', () => {
    it('should mention layer validation', () => {
      const skillPath = path.join(SKILLS_DIR, 'architecture-guardian', 'skill.md');
      const content = fs.readFileSync(skillPath, 'utf8');
      expect(content).toMatch(/レイヤ|layer/i);
    });

    it('should mention domain isolation', () => {
      const skillPath = path.join(SKILLS_DIR, 'architecture-guardian', 'skill.md');
      const content = fs.readFileSync(skillPath, 'utf8');
      expect(content).toMatch(/Domain|ドメイン/i);
    });
  });

  describe('repository-generator', () => {
    it('should reference shared Repository interface', () => {
      const skillPath = path.join(SKILLS_DIR, 'repository-generator', 'skill.md');
      const content = fs.readFileSync(skillPath, 'utf8');
      expect(content).toMatch(/Repository\.ts|Repository/);
    });

    it('should mention mapper generation', () => {
      const skillPath = path.join(SKILLS_DIR, 'repository-generator', 'skill.md');
      const content = fs.readFileSync(skillPath, 'utf8');
      expect(content).toMatch(/マッパー|Mapper/i);
    });
  });

  describe('domain-event-publisher', () => {
    it('should mention DomainEvent interface', () => {
      const skillPath = path.join(SKILLS_DIR, 'domain-event-publisher', 'skill.md');
      const content = fs.readFileSync(skillPath, 'utf8');
      expect(content).toMatch(/DomainEvent/);
    });

    it('should mention naming convention', () => {
      const skillPath = path.join(SKILLS_DIR, 'domain-event-publisher', 'skill.md');
      const content = fs.readFileSync(skillPath, 'utf8');
      expect(content).toMatch(/命名|naming|PastTense/i);
    });
  });
});
