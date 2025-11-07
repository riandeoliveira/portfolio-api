export type ProjectVersion = {
  version: string;
};

export type ProjectDetails = {
  id: number;
  name: string;
  url: string;
  repositoryUrl: string | null;
  isPrivate: boolean;
  isNew: boolean;
  stack: string[];
  info: {
    enUs: {
      fullName: string;
      description: string;
    };
    ptBr: {
      fullName: string;
      description: string;
    };
  };
};

export type Project = ProjectVersion & ProjectDetails;
