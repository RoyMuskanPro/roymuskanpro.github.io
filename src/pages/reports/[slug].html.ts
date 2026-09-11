import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const reports = {
  "genai-operations-analytics":
    "assets/genai-operations-analytics-dashboard/genai-operations-analytics-report-dashboard.html",
  "bank-loan-analysis":
    "assets/powerbi-bank-loan-analysis-dashboard/bank-loan-report-dashboard.html",
} as const;

export function getStaticPaths() {
  return Object.entries(reports).map(([slug, sourcePath]) => ({
    params: { slug },
    props: { sourcePath },
  }));
}

export async function GET({ props }: { props: { sourcePath: string } }) {
  const source = await readFile(resolve(process.cwd(), props.sourcePath), "utf8");
  const document = source.replace(
    "</head>",
    '<meta name="robots" content="noindex, nofollow" />\n</head>',
  );

  return new Response(document, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
