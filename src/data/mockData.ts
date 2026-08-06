import type { Bookmark, Collection } from "../types/api";

export const COLLECTIONS: Collection[] = [
  {
    id: "col-1",
    name: "Frontend",
    description: "Frontend development resources",
    color: "#818cf8",
    icon: "Monitor",
    parentId: "",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    userId: "user-1"
  },
  {
    id: "col-2",
    name: "Backend",
    description: "Backend development resources",
    color: "#34d399",
    icon: "Server",
    parentId: "",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    userId: "user-1"
  },
  {
    id: "col-3",
    name: "DevOps",
    description: "DevOps and infrastructure",
    color: "#fb923c",
    icon: "Container",
    parentId: "",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    userId: "user-1"
  },
  {
    id: "col-4",
    name: "Design",
    description: "Design resources",
    color: "#f472b6",
    icon: "Palette",
    parentId: "",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    userId: "user-1"
  },
  {
    id: "col-5",
    name: "Learning",
    description: "Learning materials",
    color: "#60a5fa",
    icon: "GraduationCap",
    parentId: "",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    userId: "user-1"
  }
];

const createTag = (name: string) => ({
  tag: { id: `tag-${name}`, name, color: "#818cf8" }
});

export const BOOKMARKS: Bookmark[] = [
  {
    id: "bm-1",
    url: "https://nextjs.org/docs",
    title: "Next.js Documentation",
    description:
      "Next.js is the React framework for the web. It enables you to create high-quality web applications with the power of React components.",
    image: "https://nextjs.org/static/twitter-cards/home.jpg",
    favicon: "https://nextjs.org/favicon.ico",
    tags: [
      createTag("nextjs"),
      createTag("react"),
      createTag("frontend"),
      createTag("ssr")
    ],
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
    tags: [
      createTag("typescript"),
      createTag("react"),
      createTag("data-fetching"),
      createTag("state")
    ],
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
    tags: [
      createTag("css"),
      createTag("tailwind"),
      createTag("frontend"),
      createTag("design")
    ],
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
    tags: [
      createTag("typescript"),
      createTag("javascript"),
      createTag("learning")
    ],
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
    tags: [
      createTag("backend"),
      createTag("database"),
      createTag("typescript"),
      createTag("nodejs")
    ],
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
    tags: [
      createTag("devops"),
      createTag("containers"),
      createTag("docker"),
      createTag("infrastructure")
    ],
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
    tags: [
      createTag("ui"),
      createTag("react"),
      createTag("components"),
      createTag("design"),
      createTag("frontend")
    ],
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
    image: "https://vite.dev/og.png",
    favicon: "https://vitejs.dev/logo.svg",
    tags: [
      createTag("frontend"),
      createTag("bundler"),
      createTag("vite"),
      createTag("tooling")
    ],
    collectionId: "col-1",
    createdAt: new Date("2025-06-16T10:15:00"),
    isFavorite: false
  }
];

export const ALL_TAGS = Array.from(
  new Set(BOOKMARKS.flatMap((b) => b.tags?.map((t) => t.tag.name) ?? []))
).sort();
