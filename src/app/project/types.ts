
export interface ProjectFile {
  id: string;
  name: string;
  content?: string;
  language?: string;
  isFolder: boolean;
  children: ProjectFile[];
}

export const exampleFiles: ProjectFile[] = [
  {
    id: "0",
    name: "project.py",
    language: "python",
    content: "print('Hello, World!');",
    isFolder: false,
    children: [],
  },
  {
    id: "1",
    name: "index.js",
    language: "javascript",
    content: "console.log('Hello, World!');",
    isFolder: false,
    children: [],
  },
  {
    id: "2",
    name: "index.html",
    language: "HTML",
    content: "<h1>Hello, World!</h1>",
    isFolder: false,
    children: [],
  },
  {
    id: "3",
    name: "styles",
    content: "",
    isFolder: true,
    children: [
      {
        id: "4",
        name: "styles.css",
        language: "CSS",
        content: "body { font-family: Arial, sans-serif; }",
        isFolder: false,
        children: [],
      },
      {
        id: "5",
        name: "reset.css",
        language: "CSS",
        content: "*, *::before, *::after { box-sizing: border-box; }",
        isFolder: false,
        children: [],
      },
    ],
  },
];
