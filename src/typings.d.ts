// file `typings.d.ts` beside your tsconfig.json
declare module '*.json' {
    const value: any;
    export default value;
}
