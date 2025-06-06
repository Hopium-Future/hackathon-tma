export const replaceContentEarn = (content: string, replacements: Record<string, React.ReactNode>) => {
  return content.replace(/\[icon_pocket_money\]/g, `${replacements?.['icon_pocket_money']}`);
};
