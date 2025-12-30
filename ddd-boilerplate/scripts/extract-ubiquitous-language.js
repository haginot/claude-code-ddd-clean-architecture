#!/usr/bin/env node
/**
 * Ubiquitous Language Extractor
 * 
 * Extracts domain terms from the codebase and compares with docs/ubiquitous-language.md
 * 
 * Usage:
 *   node scripts/extract-ubiquitous-language.js [--output .swarm/extracted-terms.json]
 */

const fs = require('fs');
const path = require('path');

const SRC_DIRS = ['src'];
const DOMAIN_PATTERNS = [
  { regex: /class\s+(\w+)\s+extends\s+Entity/g, type: 'entity' },
  { regex: /class\s+(\w+)\s+extends\s+AggregateRoot/g, type: 'aggregate' },
  { regex: /class\s+(\w+)\s+extends\s+ValueObject/g, type: 'value-object' },
  { regex: /class\s+(\w+)\s+implements\s+DomainEvent/g, type: 'domain-event' },
  { regex: /interface\s+(\w+Repository)/g, type: 'repository' },
  { regex: /class\s+(\w+)UseCase/g, type: 'use-case' },
  { regex: /class\s+(\w+)Command/g, type: 'command' },
  { regex: /class\s+(\w+)Query/g, type: 'query' },
];

function walkDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && !file.includes('node_modules')) {
      walkDir(filePath, fileList);
    } else if (file.endsWith('.ts') && !file.endsWith('.test.ts') && !file.endsWith('.spec.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function extractTerms(filePath, content) {
  const terms = [];
  for (const pattern of DOMAIN_PATTERNS) {
    let match;
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    while ((match = regex.exec(content)) !== null) {
      terms.push({
        term: match[1],
        type: pattern.type,
        codeReference: filePath,
        context: inferContext(filePath),
      });
    }
  }
  return terms;
}

function inferContext(filePath) {
  const parts = filePath.split(path.sep);
  const srcIndex = parts.indexOf('src');
  if (srcIndex >= 0 && parts.length > srcIndex + 1) {
    return parts[srcIndex + 1];
  }
  return 'unknown';
}

function loadExistingTerms(docPath) {
  if (!fs.existsSync(docPath)) return [];
  const content = fs.readFileSync(docPath, 'utf8');
  const termRegex = /^\|\s*\*\*(\w+)\*\*/gm;
  const terms = [];
  let match;
  while ((match = termRegex.exec(content)) !== null) {
    terms.push(match[1]);
  }
  // Also try simple list format
  const listRegex = /^[-*]\s+\*\*(\w+)\*\*/gm;
  while ((match = listRegex.exec(content)) !== null) {
    terms.push(match[1]);
  }
  return [...new Set(terms)];
}

function main() {
  const args = process.argv.slice(2);
  const outputIndex = args.indexOf('--output');
  const outputPath = outputIndex >= 0 ? args[outputIndex + 1] : '.swarm/extracted-terms.json';

  const projectRoot = process.cwd();
  const docPath = path.join(projectRoot, 'docs', 'ubiquitous-language.md');

  console.log('🔍 Extracting domain terms from codebase...');

  const allTerms = [];
  for (const srcDir of SRC_DIRS) {
    const fullPath = path.join(projectRoot, srcDir);
    const files = walkDir(fullPath);
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = path.relative(projectRoot, file);
      const terms = extractTerms(relativePath, content);
      allTerms.push(...terms);
    }
  }

  console.log(`📦 Found ${allTerms.length} domain terms`);

  const existingTerms = loadExistingTerms(docPath);
  console.log(`📄 Existing documented terms: ${existingTerms.length}`);

  const extractedNames = allTerms.map(t => t.term);
  const newTerms = extractedNames.filter(t => !existingTerms.includes(t));
  const obsoleteTerms = existingTerms.filter(t => !extractedNames.includes(t));

  const result = {
    extractedAt: new Date().toISOString(),
    terms: allTerms,
    summary: {
      total: allTerms.length,
      documented: existingTerms.length,
      new: newTerms.length,
      obsolete: obsoleteTerms.length,
    },
    newTerms,
    obsoleteTerms,
  };

  // Ensure output directory exists
  const outputDir = path.dirname(path.join(projectRoot, outputPath));
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(path.join(projectRoot, outputPath), JSON.stringify(result, null, 2));
  console.log(`✅ Results saved to ${outputPath}`);

  if (newTerms.length > 0) {
    console.log('\n🆕 New terms (not yet documented):');
    newTerms.forEach(t => console.log(`   - ${t}`));
  }

  if (obsoleteTerms.length > 0) {
    console.log('\n⚠️  Obsolete terms (in docs but not in code):');
    obsoleteTerms.forEach(t => console.log(`   - ${t}`));
  }

  return result;
}

main();
