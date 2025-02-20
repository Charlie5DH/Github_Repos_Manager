import { z } from "zod";

export type RepoFormType = z.infer<typeof RepoFormSchema>;

export const RepoFormSchema = z.object({
  username: z.string().min(2, {
    message: "Repo must contain at least 2 characters.",
  }),
});

export const RepoFormDefaultValues: RepoFormType = {
  username: "",
};
