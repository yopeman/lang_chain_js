import { createRequire } from 'module';
import path from 'path';

// Create a CommonJS require function for pdf-parse
const require = createRequire(import.meta.url);

// Temporarily override require to prevent pdf-parse from running its debug code
const Module = require('module');
const originalLoad = Module._load;

Module._load = function(request, parent, isMain) {
  if (request === 'pdf-parse') {
    // Set NODE_ENV to prevent debug mode
    process.env.NODE_ENV = 'production';
  }
  return originalLoad.apply(this, arguments);
};

// Now require pdf-parse
const pdfParse = require('pdf-parse');

// Restore original require
Module._load = originalLoad;

export default pdfParse;
