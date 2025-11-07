import cors from "@fastify/cors";
import redis from "@fastify/redis";
import type { AxiosResponse } from "axios";
import axios from "axios";
import dotenv from "dotenv";
import fastify from "fastify";
import nodemailer from "nodemailer";
import sanitize from "sanitize-html";
import type { Project, ProjectVersion } from "@/types/project";
import { projects } from "./data/projects";
import {
  type ContactFormSchema,
  contactFormSchema,
} from "./schemas/contact-form-schema";

dotenv.config();

const api = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
  },
});

const app = fastify({ logger: true });

app.register(cors, { origin: process.env.CLIENT_URL });

app.register(redis, {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});

app.get("/api/projects", async () => {
  try {
    const projects = await getProjects();

    app.redis.set("projects", JSON.stringify(projects));

    return projects;
  } catch (error) {
    console.log(error);

    const projects = await app.redis.get("projects");

    return projects ? JSON.parse(projects) : [];
  }
});

app.post("/api/contact", async (request, reply) => {
  try {
    const data = await contactFormSchema.validate(request.body, {
      abortEarly: false,
    });

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      logger: true,
      debug: true,
    });

    const sanitizedData = {
      name: toSanitized(data.name),
      email: toSanitized(data.email),
      message: toSanitized(data.message),
    };

    await transporter.sendMail({
      from: process.env.MAIL_SENDER,
      to: process.env.MAIL_TO,
      subject: `🚨 Contato Recebido de ${sanitizedData.name} 🚨`,
      html: emailTemplate(sanitizedData),
    });

    reply.status(204).send();
  } catch (error) {
    console.log(error);

    reply.status(400).send({ message: "Cannot send email." });
  }
});

const port = Number(process.env.PORT) || 3000;

app.listen({ port, host: "0.0.0.0" }).then(() => {
  app.log.info(`🚀 Server running on http://localhost:${port}`);
});

const getRepository = async (name: string): Promise<ProjectVersion> => {
  const owner = "riandeoliveira";
  const url = `/repos/${owner}/${name}/releases/latest`;
  const response: AxiosResponse<{ tag_name: string }> = await api.get(url);

  return {
    version: response.data.tag_name,
  };
};

const getProjects = async (): Promise<Project[]> => {
  const promises = projects.map(async (item) => {
    const repo = await getRepository(item.name);

    const { id, name, ...rest } = item;

    return {
      id,
      name,
      version: repo.version,
      ...rest,
    };
  });

  return await Promise.all(promises);
};

const emailTemplate = (data: ContactFormSchema) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Contato Recebido</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    a { color: #1a73e8; text-decoration: none; }
    a:hover { text-decoration: underline; }
    p { margin: 0.5em 0; }
  </style>
</head>
<body>
  <h1>Contato Recebido</h1>
  <p><strong>Nome:</strong> ${data.name}</p>
  <p><strong>E-mail:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
  <p><strong>Mensagem:</strong><br>${data.message}</p>
  <hr>
  <p style="font-size: 0.9em; color: #555;">
    Este e-mail foi enviado automaticamente pelo formulário de <strong>contato</strong> do seu portfólio.
  </p>
</body>
</html>
`;

const toSanitized = (text: string) => {
  return sanitize(text, {
    allowedTags: [],
    allowedAttributes: {},
  });
};
