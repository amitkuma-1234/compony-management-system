const fs = require('fs');
const files = ['./js/pages/modules1.js', './js/pages/modules2.js', './js/pages/modules3.js', './js/pages/modules4.js'];
files.forEach(f => {
  let code = fs.readFileSync(f, 'utf8');
  // Remove db.table block at the start of page functions
  const regex = /pages\.(\w+)\s*=\s*function\(container\)\s*\{\s*(?:const|let|var)\s+\w+\s*=\s*db\.table[\s\S]*?(?=container\.innerHTML\s*=\s*`)/g;
  code = code.replace(regex, 'pages.$1 = function(container) {\n  ');
  fs.writeFileSync(f, code);
  console.log('Fixed', f);
});
