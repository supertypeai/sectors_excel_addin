/// <reference types="vite/client" />

// Office.js CustomFunctions global (not declared in @types/office-js 1.0.377)
declare var CustomFunctions: {
  associate(name: string, fn: Function): void;
};
