// TypeScript 类型声明文件，用于支持 .md 文件的导入
// esbuild 会将 .md 文件作为文本字符串打包

declare module '*.md' {
  const content: string;
  export default content;
}
