export const createResourceName = (name: string) => {
    return `dh-${process.env.STAGE || 'dev'}-${name}`;
};
