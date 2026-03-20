const fs = require('fs');

const files = [
  'c:/gravity/livreur/src/services/api/driversService.js',
  'c:/gravity/livreur/src/services/api/ridesService.js',
  'c:/gravity/livreur/src/services/api/usersService.js'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/catch \(err\) \{\n    console\.warn\('(.+?)'\)\n  \}/g, "catch (err) {\n    console.warn('$1', err)\n  }");
  fs.writeFileSync(f, content);
});

console.log('Fixed err refs');
