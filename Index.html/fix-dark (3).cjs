const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const replacements = [
        ['bg-gray-50', 'bg-gray-50 dark:bg-gray-900'],
        ['bg-white', 'bg-white dark:bg-gray-800'],
        ['text-gray-900', 'text-gray-900 dark:text-gray-100'],
        ['text-gray-700', 'text-gray-700 dark:text-gray-200'],
        ['text-gray-600', 'text-gray-600 dark:text-gray-300'],
        ['text-gray-500', 'text-gray-500 dark:text-gray-400'],
        ['border-gray-200', 'border-gray-200 dark:border-gray-700'],
        ['border-gray-100', 'border-gray-100 dark:border-gray-800'],
        ['bg-gray-100', 'bg-gray-100 dark:bg-gray-800'],
        ['bg-gray-200', 'bg-gray-200 dark:bg-gray-700'],
      ];

      for (const [search, replacement] of replacements) {
         content = content.replace(new RegExp(`(?<!dark:)\\b${search}\\b(?!\\s+dark:)`, 'g'), replacement);
      }

      fs.writeFileSync(fullPath, content);
    }
  }
}

replaceInDir('./src/screens');
replaceInDir('./src/components');
console.log('Done');
