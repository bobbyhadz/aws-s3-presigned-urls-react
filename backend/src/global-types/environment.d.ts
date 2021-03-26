declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TABLE_NAME: string;
    }
  }
}

// If this file has no import/export (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
