import cors from "@fastify/cors";
import dotenv from "dotenv";
import Fastify from "fastify";

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

const fastify = Fastify({
  logger: true,
});

(async () => {
  fastify.register(cors, {
    origin:
      process.env.NODE_ENV === "production" ? process.env.ALLOWED_ORIGIN : true,
  });

  await fastify.register(import("@fastify/rate-limit"));
  await fastify.register(import("./routes/contact"));
  await fastify.register(import("./routes/projects"));

  const PORT = Number(process.env.PORT) || 3000;

  fastify.listen({ port: PORT }, () => {
    // biome-ignore lint/suspicious/noConsole: logging server URL for debugging
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})();
