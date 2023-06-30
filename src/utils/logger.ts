import { format, createLogger, transports } from 'winston';

const { timestamp, combine, printf, errors } = format;

function logger() {
  const logFormat = printf(
    ({ level, message, timestamp, stack }) =>
      `${timestamp} ${level}: ${stack || message}`,
  );

  return createLogger({
    format: combine(
      format.colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      logFormat,
    ),
    transports: [new transports.Console()],
  });
}

export default logger();
