import morgan, { StreamOptions } from "morgan";
import winstonLogger from "../libs/winstonLogger";

const stream: StreamOptions = {
  write: (message: string) => {
    winstonLogger.http(message.trim());
  },
};

const skip = (): boolean => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream, skip },
);

export default morganMiddleware;
