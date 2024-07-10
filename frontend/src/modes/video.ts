import { FileInfo } from './fileInfo';

export interface Video {
  id: number;
  videoName: string;
  channel: string;
  type: string;
  year: string;
  region: string;
  language: string;
  intro: string;
  createTime: string;
  fileInfo: FileInfo;
}
