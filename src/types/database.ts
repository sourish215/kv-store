export interface Database {
  data: Map<string, string>;
  print(): void;
  delete(key: string): void;
  set(key: string, value: string): void;
  get(key: string): string | undefined;
}

export type Command = "SET" | "GET" | "DELETE";
