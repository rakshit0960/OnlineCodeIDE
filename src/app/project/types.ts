
export interface ProjectFile {
  id: string;
  name: string;
  content?: string;
  language?: string;
  isFolder: boolean;
  path: string;
  children: ProjectFile[];
}


export const exampleFiles: ProjectFile[] = [
  {
    id: "0",
    name: "project.py",
    language: "python",
    content: "print('Hello, World!');",
    isFolder: false,
    path: "/app/project.py",
    children: [],
  },
  {
    id: "1",
    name: "index.js",
    language: "javascript",
    content: "console.log('Hello, World!');",
    isFolder: false,
    path: "/app/index.js",
    children: [],
  },
  {
    id: "2",
    name: "index.html",
    language: "HTML",
    content: "<h1>Hello, World!</h1>",
    isFolder: false,
    path: "/app/index.html",
    children: [],
  },
  {
    id: "3",
    name: "styles",
    content: "",
    isFolder: true,
    path: "/app/styles",
    children: [
      {
        id: "4",
        name: "styles.css",
        language: "CSS",
        content: "body { font-family: Arial, sans-serif; }",
        isFolder: false,
        path: "/app/styles/styles.css",
        children: [],
      },
      {
        id: "5",
        name: "reset.css",
        language: "CSS",
        content: "*, *::before, *::after { box-sizing: border-box; }",
        isFolder: false,
        path: "/app/styles/reset.css",
        children: [],
      },
    ],
  },
];
