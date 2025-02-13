interface ServerConfig {
  port: number;
  timeout: number;
}

interface Config {
  development: ServerConfig;
  production: ServerConfig;
  test: ServerConfig;
}

const config: Config = {
  development: {
    port: 8080,
    timeout: 20000,
  },
  production: {
    port: 3000,
    timeout: 5000,
  },
  test: {
    port: 8888,
    timeout: 1000,
  },
};

const env = process.env.NODE_ENV || "development";

export const activeConfig: ServerConfig = config[env as keyof Config];

export const envConfig: ServerConfig = {
  port: parseInt(process.env.PORT || "8080"),
  timeout: parseInt(process.env.TIMEOUT || "10000"),
};
