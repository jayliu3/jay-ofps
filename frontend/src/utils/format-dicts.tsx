export interface Dict {
  id: string;
  label: string;
}
export function getLabelById(data: Dict[], id: string): string | undefined {
  const find = data.find((item) => item.id === id);
  return find ? find.label : undefined;
}
