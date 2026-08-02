const configuredPort = Number.parseInt(process.env.PORT ?? "3000", 10);

if (!Number.isInteger(configuredPort) || configuredPort < 1 || configuredPort > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}

export const port = configuredPort;
