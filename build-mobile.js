const fs = require('fs');
const path = require('path');

// Path to the index.html file in the dist folder
const indexPath = path.join(__dirname, 'dist', 'index.html');

// Read the current content of index.html
fs.readFile(indexPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading index.html:', err);
    return;
  }

  // Update the base path to work better with Capacitor
  const updatedContent = data.replace(
    '<base href="/" />',
    '<base href="./" />'
  );

  // Write the modified content back to index.html
  fs.writeFile(indexPath, updatedContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to index.html:', err);
      return;
    }
    console.log('Successfully updated index.html for mobile build');
  });
});
