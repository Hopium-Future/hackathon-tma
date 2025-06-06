export const replaceContentSocial = (content: string, replacements: Record<string, React.ReactNode>) => {
    return content.replace(/\[Icon_side\]/g, `${replacements?.['Icon_side']}`).replace(/\[Icon_symbol\]/g, `${replacements?.['Icon_symbol']}`);
};
