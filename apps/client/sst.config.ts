/* eslint-disable @typescript-eslint/ban-ts-comment */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
//@ts-ignore
export default $config({
    app(input) {
        return {
            name: 'web',
            removal: input?.stage === 'production' ? 'retain' : 'remove',
            protect: ['production'].includes(input?.stage),
            home: 'aws',
        };
    },
    async run() {
        //@ts-ignore
        new sst.aws.Nextjs('MyWeb');
    },
});
