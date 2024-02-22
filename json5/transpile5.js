import * as fs from 'fs';
import JSON5 from 'json5';

try {
  const data = fs.readFileSync('./package.json5', 'utf8');
  const jsonData = JSON5.parse(data);
  const jsonString = JSON.stringify(jsonData, null, '\t');
  fs.writeFileSync('package.json', jsonString, 'utf8');
  console.log('Transpiled json.');
} catch (error) {
  console.error('Error:', error);
}