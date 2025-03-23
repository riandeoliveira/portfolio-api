import type { AxiosResponse } from "axios";
import type { FastifyInstance } from "fastify";
import { api } from "../api";
import { repositories } from "../data/repositories";
import { type Project, type ProjectMetadata, projectSchema } from "../schemas";

type ProjectResponse = Omit<Project, "metadata"> &
  ProjectMetadata & {
    id: number;
  };

const fetchRepositoryMetadata = async (
  repoName: string,
): Promise<AxiosResponse<Project>> => {
  return await api.get(`/${repoName}/refs/heads/main/package.json`, {
    headers: {
      Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
    },
  });
};

export = (fastify: FastifyInstance): void => {
  fastify.get("/api/projects", async (_, reply) => {
    const projects: ProjectResponse[] = [];

    for (const repo of repositories) {
      const response = await fetchRepositoryMetadata(repo.name);

      if (response.status === 200) {
        try {
          const data = projectSchema.parse(response.data);

          const { name, version, ...rest } = data;

          projects.push({
            id: repo.id,
            name,
            version: `v${version}`,
            ...rest.metadata,
          });
        } catch {
          return;
        }
      }
    }

    return reply.status(200).send(projects);
  });
};
