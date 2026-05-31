import type { Bookmark, Collection } from "../types";

export const COLLECTIONS: Collection[] = [
  { id: "col-1", name: "Frontend", icon: "Monitor", color: "#818cf8" },
  { id: "col-2", name: "Backend", icon: "Server", color: "#34d399" },
  { id: "col-3", name: "DevOps", icon: "Container", color: "#fb923c" },
  { id: "col-4", name: "Design", icon: "Palette", color: "#f472b6" },
  { id: "col-5", name: "Learning", icon: "GraduationCap", color: "#60a5fa" }
];

export const BOOKMARKS: Bookmark[] = [
  {
    id: "bm-1",
    url: "https://nextjs.org/docs",
    title: "Next.js Documentation",
    description:
      "Next.js is the React framework for the web. It enables you to create high-quality web applications with the power of React components.",
    image: "https://nextjs.org/static/twitter-cards/home.jpg",
    favicon: "https://nextjs.org/favicon.ico",
    tags: ["nextjs", "react", "frontend", "ssr"],
    collectionId: "col-1",
    createdAt: new Date("2025-06-10T10:00:00"),
    isFavorite: true
  },
  {
    id: "bm-2",
    url: "https://tanstack.com/query/latest",
    title: "TanStack Query",
    description:
      "Powerful asynchronous state management for TypeScript, React, Vue, Solid, Svelte and Angular. Fetch, cache and update data without touching any global state.",
    image: "https://tanstack.com/og.png",
    favicon: "https://tanstack.com/favicon.png",
    tags: ["typescript", "react", "data-fetching", "state"],
    collectionId: "col-1",
    createdAt: new Date("2025-06-12T14:30:00"),
    isFavorite: false
  },
  {
    id: "bm-3",
    url: "https://tailwindcss.com/docs",
    title: "Tailwind CSS Docs",
    description:
      "A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup.",
    image: "https://tailwindcss.com/api/og?path=/docs/installation",
    favicon: "https://tailwindcss.com/favicons/favicon.ico",
    tags: ["css", "tailwind", "frontend", "design"],
    collectionId: "col-1",
    createdAt: new Date("2025-06-13T09:15:00"),
    isFavorite: true
  },
  {
    id: "bm-4",
    url: "https://www.typescriptlang.org/docs/",
    title: "TypeScript Handbook",
    description:
      "TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. Learn everything about types, interfaces, and generics.",
    image: "https://www.typescriptlang.org/images/og-image.png",
    favicon: "https://www.typescriptlang.org/favicon-32x32.png",
    tags: ["typescript", "javascript", "learning"],
    collectionId: "col-5",
    createdAt: new Date("2025-06-14T16:45:00"),
    isFavorite: false
  },
  {
    id: "bm-5",
    url: "https://www.prisma.io/docs",
    title: "Prisma ORM Documentation",
    description:
      "Next-generation Node.js and TypeScript ORM for PostgreSQL, MySQL, MariaDB, SQLite, AWS Aurora, MongoDB and CockroachDB. Build data-driven applications with confidence.",
    image: "https://www.prisma.io/docs/social/docs-social.png",
    favicon: "https://www.prisma.io/images/favicon-32x32.png",
    tags: ["backend", "database", "typescript", "nodejs"],
    collectionId: "col-2",
    createdAt: new Date("2025-06-15T11:00:00"),
    isFavorite: true
  },
  {
    id: "bm-6",
    url: "https://docs.docker.com",
    title: "Docker Documentation",
    description:
      "Docker Docs is the official documentation for Docker products including Docker Desktop, Docker Hub, Docker Compose, and the Docker Engine CLI reference.",
    image: "https://docs.docker.com/assets/images/docker-docs-share-image.png",
    favicon: "https://docs.docker.com/favicons/docs@2x.ico",
    tags: ["devops", "containers", "docker", "infrastructure"],
    collectionId: "col-3",
    createdAt: new Date("2025-06-15T13:30:00"),
    isFavorite: false
  },
  {
    id: "bm-7",
    url: "https://ui.shadcn.com",
    title: "shadcn/ui Components",
    description:
      "Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source. Built with Radix UI and Tailwind CSS.",
    image: "https://ui.shadcn.com/og.jpg",
    favicon: "https://ui.shadcn.com/favicon.ico",
    tags: ["ui", "react", "components", "design", "frontend"],
    collectionId: "col-4",
    createdAt: new Date("2025-06-16T08:00:00"),
    isFavorite: true
  },
  {
    id: "bm-8",
    url: "https://vitejs.dev/guide",
    title: "Vite — Next Generation Frontend Tooling",
    description:
      "Get familiar with the new frontend build tool Vite. A fast and lean development server with instant HMR, rich features, and optimized production builds.",
    image: "https://vitejs.dev/og-image.png",
    favicon: "https://vitejs.dev/logo.svg",
    tags: ["frontend", "bundler", "vite", "tooling"],
    collectionId: "col-1",
    createdAt: new Date("2025-06-16T10:15:00"),
    isFavorite: false
  }
];

export const ALL_TAGS = Array.from(
  new Set(BOOKMARKS.flatMap((b) => b.tags))
).sort();
