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

export const types = [
  { id: '1', label: '喜剧' },
  { id: '2', label: '爱情' },
  { id: '3', label: '恐怖' },
  { id: '4', label: '科幻' },
  { id: '5', label: '动作' },
  { id: '6', label: '战争' },
  { id: '7', label: '其他' },
];

export const channels = [
  { id: '1', label: '电影' },
  { id: '2', label: '戏剧' },
  { id: '3', label: '动漫' },
  { id: '4', label: '电视剧' },
  { id: '5', label: '其他' },
];

export const regions = [
  { id: '1', label: '中国' },
  { id: '2', label: '美国' },
  { id: '3', label: '法国' },
  { id: '4', label: '日本' },
  { id: '5', label: '韩国' },
  { id: '6', label: '其他' },
];

export const languages = [
  { id: '1', label: '汉语' },
  { id: '2', label: '英语' },
  { id: '3', label: '汉语' },
  { id: '4', label: '日语' },
  { id: '5', label: '法语' },
  { id: '6', label: '德语' },
  { id: '7', label: '其他' },
];
