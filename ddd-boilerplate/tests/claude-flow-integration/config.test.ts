const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..', '..');

describe('Claude Flow Configuration', () => {
  describe('.flowconfig.json', () => {
    const configPath = path.join(PROJECT_ROOT, '.flowconfig.json');

    it('should exist', () => {
      expect(fs.existsSync(configPath)).toBe(true);
    });

    it('should be valid JSON', () => {
      const content = fs.readFileSync(configPath, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    });

    it('should have required namespaces', () => {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const namespaces = config.claudeFlow?.memory?.namespaces || [];
      
      expect(namespaces).toContain('domain');
      expect(namespaces).toContain('application');
      expect(namespaces).toContain('infrastructure');
      expect(namespaces).toContain('interface');
      expect(namespaces).toContain('architecture');
    });

    it('should have reasoningBank enabled', () => {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      expect(config.claudeFlow?.memory?.reasoningBank?.enabled).toBe(true);
    });

    it('should have agentdb enabled', () => {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      expect(config.claudeFlow?.memory?.agentdb?.enabled).toBe(true);
    });

    it('should have vectorSearch settings', () => {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const vs = config.claudeFlow?.memory?.agentdb?.vectorSearch;
      
      expect(vs?.k).toBeGreaterThan(0);
      expect(vs?.threshold).toBeGreaterThan(0);
      expect(vs?.threshold).toBeLessThanOrEqual(1);
    });
  });

  describe('.mcp.json', () => {
    const mcpPath = path.join(PROJECT_ROOT, '.mcp.json');

    it('should exist', () => {
      expect(fs.existsSync(mcpPath)).toBe(true);
    });

    it('should have claude-flow server configured', () => {
      const config = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
      expect(config.mcpServers?.['claude-flow']).toBeDefined();
    });

    it('should use npx to run claude-flow', () => {
      const config = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
      const args = config.mcpServers?.['claude-flow']?.args || [];
      expect(args).toContain('claude-flow@alpha');
    });
  });

  describe('.swarm/config.json', () => {
    const swarmConfigPath = path.join(PROJECT_ROOT, '.swarm', 'config.json');

    it('should exist', () => {
      expect(fs.existsSync(swarmConfigPath)).toBe(true);
    });

    it('should have memory storage path', () => {
      const config = JSON.parse(fs.readFileSync(swarmConfigPath, 'utf8'));
      expect(config.memory?.reasoningBank?.storage).toBeDefined();
    });

    it('should have patterns directory', () => {
      const config = JSON.parse(fs.readFileSync(swarmConfigPath, 'utf8'));
      expect(config.patterns?.tactical).toBeDefined();
      expect(config.patterns?.strategic).toBeDefined();
    });
  });

  describe('.swarm/hive-config.json', () => {
    const hiveConfigPath = path.join(PROJECT_ROOT, '.swarm', 'hive-config.json');

    it('should exist', () => {
      expect(fs.existsSync(hiveConfigPath)).toBe(true);
    });

    it('should have queenAgent defined', () => {
      const config = JSON.parse(fs.readFileSync(hiveConfigPath, 'utf8'));
      expect(config.queenAgent?.role).toBe('strategic-coordinator');
    });

    it('should have at least 4 worker agents', () => {
      const config = JSON.parse(fs.readFileSync(hiveConfigPath, 'utf8'));
      expect(config.workerAgents?.length).toBeGreaterThanOrEqual(4);
    });

    it('should have domain-expert worker', () => {
      const config = JSON.parse(fs.readFileSync(hiveConfigPath, 'utf8'));
      const workers = config.workerAgents || [];
      const domainExpert = workers.find(function(w) { return w.role === 'domain-expert'; });
      expect(domainExpert).toBeDefined();
      expect(domainExpert?.namespace).toBe('domain');
    });
  });

  describe('.swarm/neural/config.json', () => {
    const neuralConfigPath = path.join(PROJECT_ROOT, '.swarm', 'neural', 'config.json');

    it('should exist', () => {
      expect(fs.existsSync(neuralConfigPath)).toBe(true);
    });

    it('should have learning enabled', () => {
      const config = JSON.parse(fs.readFileSync(neuralConfigPath, 'utf8'));
      expect(config.learning?.enabled).toBe(true);
    });

    it('should track DDD patterns', () => {
      const config = JSON.parse(fs.readFileSync(neuralConfigPath, 'utf8'));
      const tracked = config.learning?.patterns?.track || [];
      
      expect(tracked).toContain('entity-creation');
      expect(tracked).toContain('aggregate-design');
    });
  });
});
