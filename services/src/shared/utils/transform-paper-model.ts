import { PaperRecord } from "../types";

export type TransformOptions = {
  isStarred?: boolean;
};

export const transformPaperModel = async (rawPapers: any, options: TransformOptions = {}) => {
  const { isStarred } = options;

  return rawPapers.map((paper: any): PaperRecord => ({
    ...paper,
    status: 0,
    relevancy: isStarred ? 1 : 0,
    isStarred: !!isStarred,
    authors: paper.authors.join('; ')
  }));
};
