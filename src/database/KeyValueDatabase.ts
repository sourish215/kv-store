import { Database } from "../types/database";

export class KeyValueDatabase implements Database {
  data: Map<string, string>;

  constructor() {
    this.data = new Map<string, string>();
  }

  print(): void {
    console.log("Database:", Object.fromEntries(this.data));
  }

  delete(key: string): void {
    this.data.delete(key);
  }

  set(key: string, value: string): void {
    this.data.set(key, value);
  }

  get(key: string): string | undefined {
    return this.data.get(key);
  }
}
