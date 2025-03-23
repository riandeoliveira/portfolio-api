import emailJs from "@emailjs/nodejs";
import type { FastifyInstance } from "fastify";
import { type ContactForm, contactSchema } from "../schemas";

export = (fastify: FastifyInstance): void => {
  fastify.post(
    "/api/contact",
    {
      config: {
        rateLimit: {
          max: 3,
          timeWindow: 10.7 * 60 * 60 * 1000, // 10h42min
        },
      },
    },
    async (request, reply) => {
      try {
        contactSchema.parse(request.body);
      } catch {
        return reply.status(400).send();
      }

      try {
        await emailJs.send(
          process.env.EMAIL_SERVICE_ID as string,
          process.env.EMAIL_TEMPLATE_ID as string,
          request.body as ContactForm,
          {
            privateKey: process.env.EMAIL_PRIVATE_KEY as string,
            publicKey: process.env.EMAIL_PUBLIC_KEY as string,
          },
        );

        return reply.status(200).send();
      } catch {
        return reply.status(400).send();
      }
    },
  );
};
