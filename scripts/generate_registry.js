#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const workflowsDir = path.join(__dirname, '..', 'workflows');
const readmePath = path.join(__dirname, '..', 'README.md');

const categories = [
  { id: '01-core', name: 'Core Handlers' },
  { id: '02-integrations', name: 'External Integrations' },
  { id: '03-ai-swarm', name: 'Sovereign Swarm' },
  { id: '04-ops', name: 'Infrastructure & Ops' },
  { id: '05-security', name: 'Security & Auth' },
  { id: '06-business', name: 'Business & Intelligence' }
];

let registryMarkdown = '# 🌌 Antigravity n8n Master Registry\n\n> **Status:** 🟢 SOVEREIGN OPERATIONAL\n\n## 📊 Workflow Inventory\n\n';

categories.forEach(cat => {
  const catDir = path.join(workflowsDir, cat.id);
  if (fs.existsSync(catDir)) {
    registryMarkdown += `### 📂 ${cat.name} (${cat.id})\n\n`;
    registryMarkdown += '| ID | Name | Tags | Status |\n|----|------|------|--------|\n';

    const files = fs.readdirSync(catDir).filter(f => f.endsWith('.json'));
    files.forEach(file => {
      try {
        const content = JSON.parse(fs.readFileSync(path.join(catDir, file), 'utf8'));
        const id = file.split('-')[0];
        const tags = (content.tags || []).join(', ');
        const status = content.active ? '✅ Active' : '⚪ Inactive';
        registryMarkdown += `| ${id} | ${content.name} | ${tags} | ${status} |\n`;
      } catch (e) {
        registryMarkdown += `| - | ${file} | (Error parsing) | - |\n`;
      }
    });
    registryMarkdown += '\n';
  }
});

fs.writeFileSync(readmePath, registryMarkdown);
console.log('Master Registry updated successfully.');
