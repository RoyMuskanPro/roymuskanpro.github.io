import type { ImageMetadata } from "astro";

import profileImage from "../../assets/images/muskan.png";
import genAiExecutiveImage from "../../assets/genai-operations-analytics-dashboard/screenshots/Page_1_Executive_Overview.png";
import genAiUsageImage from "../../assets/genai-operations-analytics-dashboard/screenshots/Page_2_Usage_and_Assumed_Cost.png";
import genAiLatencyImage from "../../assets/genai-operations-analytics-dashboard/screenshots/Page_3_Latency_and_Reliability.png";
import genAiDetailImage from "../../assets/genai-operations-analytics-dashboard/screenshots/Page_4_Drill_Through_Model_&_Log_Type_Details.png";
import bankSummaryImage from "../../assets/powerbi-bank-loan-analysis-dashboard/screenshots/01-loan-summary.png";
import bankOverviewImage from "../../assets/powerbi-bank-loan-analysis-dashboard/screenshots/02-loan-category-overview.png";
import bankDetailImage from "../../assets/powerbi-bank-loan-analysis-dashboard/screenshots/03-loan-detailed-analysis.png";

export interface ProjectImage {
  src: ImageMetadata;
  alt: string;
  caption: string;
}

export interface ProjectMetric {
  value: string;
  label: string;
  note?: string;
}

export interface ProjectMethod {
  label: string;
  title: string;
  description: string;
}

export interface Project {
  slug: string;
  eyebrow: string;
  title: string;
  shortDescription: string;
  seoDescription: string;
  overview: string[];
  question: string;
  dataset: string;
  method: ProjectMethod[];
  metrics: ProjectMetric[];
  insights: string[];
  limitations: string[];
  tools: string[];
  interactiveReport: {
    url: string;
    title: string;
    instruction: string;
    aspectRatio: string;
  };
  coverImage: ProjectImage;
  images: ProjectImage[];
  githubUrl: string;
  sourceUrl?: string;
  sourceLabel?: string;
}

export interface Experience {
  company: string;
  location?: string;
  roles: Array<{
    title: string;
    dates: string;
  }>;
  summary: string;
}

export const site = {
  name: "Muskan Roy",
  role: "Data Analyst",
  location: "Noida, India",
  url: "https://muskanroy.com",
  email: "roy.muskan.pro@gmail.com",
  description:
    "Explore Muskan Roy’s data analyst portfolio: Power BI dashboards, SQL Server and Excel expertise, plus GenAI operations and bank loan case studies.",
  headline: "I make messy data make sense.",
  introduction:
    "I’m Muskan Roy, a data analyst based in Noida. I work with finance, operations, CRM, and performance data, preparing source files, checking figures, and building Power BI reports for founders and project managers. This includes resolving differences across Excel files and clarifying metric definitions, so the report gives its readers a consistent view of what changed and where to look more closely.",
  profileImage: {
    src: profileImage,
    alt: "Portrait of Muskan Roy",
  },
  social: {
    linkedin: "https://linkedin.com/in/muskanroy/",
    github: "https://github.com/RoyMuskanPro",
  },
  navigation: [
    { label: "Projects", href: "/#work" },
    { label: "Experience", href: "/#experience" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;

export const projects: Project[] = [
  {
    slug: "genai-operations-analytics",
    eyebrow: "Power BI and SQL Server case study",
    title: "GenAI Operations Analytics",
    shortDescription:
      "I compared LLM usage, estimated cost, latency, and failures by model and log type in a four-page Power BI report, with fictional pricing and service targets documented separately.",
    seoDescription:
      "Power BI and SQL Server case study analysing 4.997 million LLM requests across token usage, estimated cost, latency, failures, and fictional SLA targets.",
    overview: [
      "I used the BurstGPT workload trace to examine how request volume, token consumption, and response times differ by model and log type. The source contains almost five million requests but does not provide prices, service targets, or failure reasons. I defined these assumptions and reporting rules explicitly, including the use of zero response tokens to identify a failed request.",
      "The report moves from an executive overview to usage and estimated cost, latency and reliability, and model-level detail. I kept fictional pricing and service targets separate from the source records and retained data quality flags in the reporting tables. The main figures can be checked across Power BI, SQL Server, and the original Excel extract.",
    ],
    question:
      "Which models and workload types account for the most usage, estimated cost, slow responses, and failures?",
    dataset:
      "The public BurstGPT v2.0 workload trace contains 4.997 million requests after validation. Calendar dates, model prices, service targets, and an organisational setting were added for this case study because the source does not supply them. These are scenario assumptions, not facts about the original dataset or a real provider.",
    method: [
      {
        label: "01",
        title: "Review the source and define assumptions",
        description:
          "I reviewed a repeatable sample in Excel, documented the available fields, and identified the questions they could support. I stored fictional pricing and service targets separately so their effect on the reported figures could be reviewed or changed without altering the source data.",
      },
      {
        label: "02",
        title: "Clean and validate records in SQL Server",
        description:
          "I kept the original records, cleaned data, and reporting tables separate in SQL Server to make the transformations traceable. I flagged conversion errors, duplicates, unknown mappings, token mismatches, and missing sessions for review, preserving a record of the data quality issues.",
      },
      {
        label: "03",
        title: "Build the model and reporting measures",
        description:
          "I built a star schema with one row per request in the main reporting table and shared reference tables across all pages. DAX measures cover request volume, token usage, average and percentile response times, estimated cost, failures, and breaches of the fictional service targets.",
      },
      {
        label: "04",
        title: "Reconcile totals and organise the report",
        description:
          "I reconciled the main totals across Excel, SQL Server, and Power BI before arranging the pages. The executive overview summarises the workload, with separate pages for usage and cost, reliability, and a closer review of a selected model and log type.",
      },
    ],
    metrics: [
      { value: "4.997M", label: "included requests" },
      { value: "2.92B", label: "total tokens" },
      { value: "15 sec", label: "overall P95 latency" },
      { value: "3.83%", label: "request failure rate", note: "Zero response tokens" },
    ],
    insights: [
      "ChatGPT accounts for roughly 85% of included requests, making it the main workload to consider in a capacity review. Its share of estimated cost is lower than its share of requests, so volume and cost need to be examined separately.",
      "GPT-4 represents about 15% of requests, 34% of tokens, and 39% of estimated cost. Comparing these measures shows its greater token use and assumed cost per request, which request counts alone would miss.",
      "API traffic accounts for about 90% of estimated cost under the fictional rate card. I would start a cost review by comparing API and conversation workloads, then examine the model breakdown within each.",
      "Most requests finish within two seconds, while the overall P95 elapsed time is 15 seconds. Showing the average alongside P95 makes the slower end of the response-time distribution visible instead of relying on the average alone.",
    ],
    limitations: [
      "Elapsed time measures the full request duration, not time to first token.",
      "A request with zero response tokens is counted as a failure. The source does not provide failure reasons.",
      "Differences between models and workloads are observable, but the trace does not contain enough operational detail to establish their causes.",
      "Pricing, calendar labels, and service targets are fictional case-study assumptions, not actual provider costs or commitments.",
    ],
    tools: [
      "SQL Server",
      "Power BI",
      "DAX",
      "Power Query",
      "Excel",
      "Star schema",
      "Data validation",
    ],
    interactiveReport: {
      url: "/reports/genai-operations-analytics.html",
      title: "GenAI Operations Analytics report preview",
      instruction: "Use the tabs to browse the four pages. Model and log type selections update the summary figures; select a segment in the request distribution chart to open the detail page for that combination.",
      aspectRatio: "1433 / 840",
    },
    coverImage: {
      src: genAiExecutiveImage,
      alt: "Power BI executive overview of GenAI operations showing request volume, token usage, assumed cost, SLA breaches, and performance by model and log type",
      caption: "The executive overview summarises usage, estimated cost, latency, and reliability by model and log type.",
    },
    images: [
      {
        src: genAiExecutiveImage,
        alt: "Power BI executive overview of GenAI operations showing request volume, token usage, assumed cost, SLA breaches, and performance by model and log type",
        caption: "The executive overview summarises usage, estimated cost, latency, and reliability by model and log type.",
      },
      {
        src: genAiUsageImage,
        alt: "Power BI usage and assumed cost dashboard comparing request and response tokens, model mix, and estimated cost",
        caption: "The usage page compares request and response tokens, model shares, and estimated cost.",
      },
      {
        src: genAiLatencyImage,
        alt: "Power BI latency and reliability dashboard showing average and P95 elapsed time, failure rate, SLA status, and request detail",
        caption: "The reliability page compares average and P95 elapsed time, failure rates, and fictional SLA targets.",
      },
      {
        src: genAiDetailImage,
        alt: "Power BI drill-through page for GPT-4 conversation requests showing volume, token, latency, cost, and SLA details",
        caption: "The detail page shows volume, tokens, elapsed time, estimated cost, and SLA status for a model and log type.",
      },
    ],
    githubUrl: "https://github.com/RoyMuskanPro/genai-operations-analytics",
    sourceUrl: "https://github.com/HPMLL/BurstGPT",
    sourceLabel: "BurstGPT dataset",
  },
  {
    slug: "bank-loan-analysis",
    eyebrow: "Power BI and SQL Server case study",
    title: "Bank Loan Analysis",
    shortDescription:
      "I analysed loan applications, funded amounts, and repayments in SQL Server and Power BI, organising the report into portfolio totals, comparisons by loan and borrower group, and individual records.",
    seoDescription:
      "Power BI and SQL Server case study analysing 38,576 loan applications across funding, repayments, loan status, monthly trends, regions, and borrower groups.",
    overview: [
      "I analysed loan records to compare application volume, funding, repayments, and loan status across the portfolio. The data includes dates, locations, and borrower attributes, allowing the overall figures to be examined by month, region, loan type, and borrower group.",
      "I organised the Power BI report into three pages. The summary presents the main KPIs and good and bad loan groupings. The overview compares monthly trends and portfolio composition, while the details page lists individual loans. This structure keeps the main measures together and makes more detailed comparisons available on separate pages.",
    ],
    question:
      "How do lending volume, funded amounts, and repayments vary over time and across loan and borrower groups?",
    dataset:
      "The dataset contains 38,576 anonymised loan applications issued in 2021. The project repository does not identify the original publisher. I used it as a portfolio exercise, so the findings describe this dataset rather than a verified lender or market.",
    method: [
      {
        label: "01",
        title: "Prepare the data and check totals",
        description:
          "I cleaned and organised loan records in Power Query, then used SQL Server to combine fields and calculate totals. Checking the results outside Power BI provided a separate reference for validating the figures used in the report.",
      },
      {
        label: "02",
        title: "Define consistent portfolio KPIs",
        description:
          "I defined measures for applications, funded and received amounts, average interest rate, and average debt-to-income ratio (DTI). Good and bad loan groupings follow the project’s status definitions, and all three pages use the same measures for consistent comparisons.",
      },
      {
        label: "03",
        title: "Compare trends and borrower groups",
        description:
          "I examined monthly and regional patterns alongside loan term, purpose, employment length, home ownership, grade, and status. These comparisons show how funding is distributed across the portfolio and where changes in volume or loan mix are concentrated.",
      },
      {
        label: "04",
        title: "Separate summaries from loan records",
        description:
          "I arranged the pages from portfolio totals to grouped comparisons and individual records. The details table includes loan purpose, home ownership, grade, issue date, funding, interest, instalment, and amount received, so those fields can be reviewed together.",
      },
    ],
    metrics: [
      { value: "38.6K", label: "loan applications" },
      { value: "$435.8M", label: "total funded" },
      { value: "$473.1M", label: "total received" },
      { value: "86.18%", label: "good-loan share" },
    ],
    insights: [
      "Under the project’s status definitions, good loans account for 86.18% of applications and charged-off loans account for 13.82%. This gives a portfolio-wide baseline for comparing the status mix within loan and borrower groups.",
      "Across the full dataset, monthly funded amount rises from about $25 million in January to $54 million in December. Reading funding alongside application volume distinguishes the amount lent from the number of loans issued.",
      "At roughly $230 million, debt consolidation has the highest funded amount of any loan purpose. Its size makes it a relevant category to examine when reviewing changes in total funding.",
      "The portfolio is weighted towards 36-month loans, which account for 62.66% of funded value. The remaining 37.34% is in 60-month loans.",
    ],
    limitations: [
      "The records are described as anonymised; the repository does not document their original public source.",
      "The comparisons describe patterns in the data. They do not establish causes or demonstrate an impact on real lending outcomes.",
      "Good and bad loan groupings use this project’s status definitions and may differ from a lender’s own policy.",
    ],
    tools: ["Power BI", "SQL Server", "DAX", "Power Query", "Excel", "KPI reporting"],
    interactiveReport: {
      url: "/reports/bank-loan-analysis.html",
      title: "Bank Loan Analysis report preview",
      instruction: "Browse the summary, overview, and details pages. Hover over charts to read values, select chart items to highlight them, or choose a state on the overview map. The preview displays fixed portfolio totals and sample loan records.",
      aspectRatio: "1442 / 810",
    },
    coverImage: {
      src: bankOverviewImage,
      alt: "Power BI bank loan overview showing funded amount by month, state, term, employment length, purpose, and home ownership",
      caption: "The overview compares monthly funding with state, term, employment length, purpose, and home ownership.",
    },
    images: [
      {
        src: bankSummaryImage,
        alt: "Power BI bank loan summary showing applications, funded amount, amount received, interest rate, DTI, and good and bad loan performance",
        caption: "The summary shows portfolio KPIs, good and bad loan shares, and funded and received amounts by status.",
      },
      {
        src: bankOverviewImage,
        alt: "Power BI bank loan overview showing funded amount by month, state, term, employment length, purpose, and home ownership",
        caption: "The overview compares monthly funding with state, term, employment length, purpose, and home ownership.",
      },
      {
        src: bankDetailImage,
        alt: "Power BI bank loan detail table with purpose, home ownership, grade, issue date, funded amount, interest rate, installment, and amount received",
        caption: "The details table lists individual loans with borrower attributes, funding, interest, and amounts received.",
      },
    ],
    githubUrl: "https://github.com/RoyMuskanPro/powerbi-bank-loan-analysis",
  },
];

export const experience: Experience[] = [
  {
    company: "Plan Thy Business",
    roles: [
      { title: "Freelance Data Analyst", dates: "Jul 2024 — Present" },
      { title: "Associate Business Analyst", dates: "Mar 2022 — Jun 2024" },
    ],
    summary:
      "Across six client engagements, I have worked with more than 50 Excel and CSV files for finance, operations, CRM, and performance reporting. My responsibilities include checking records, investigating differences between figures, and building Power BI reports for founders and project managers. I adapt the measures and level of detail to each audience’s reporting needs.",
  },
  {
    company: "Marqual IT Solution Pvt Ltd",
    roles: [{ title: "Research Associate", dates: "Sep 2021 — Mar 2022" }],
    summary:
      "I prepared more than 15 Excel and CSV datasets across five research projects, standardising names and formats and combining files for analysis. I checked records with spreadsheet lookups and used PivotTables to summarise more than 5,000 rows. This work focused on making the source data consistent and the research comparisons easier to review.",
  },
];

export const skillGroups = [
  {
    title: "Business intelligence",
    skills: ["Power BI", "DAX", "Dashboard development", "Business and KPI reporting"],
  },
  {
    title: "Data preparation",
    skills: ["SQL Server", "Power Query", "Excel", "Data cleaning", "Data transformation"],
  },
  {
    title: "Analysis and modelling",
    skills: ["Data validation", "Exploratory analysis", "Trend and variance analysis", "Data modelling", "Star schema"],
  },
] as const;

export const education = [
  {
    degree: "MBA, Finance & Business Analytics",
    school: "Indira Gandhi Delhi Technical University for Women",
    dates: "2022 — 2024",
    detail: "7.97 CGPA",
  },
  {
    degree: "BBA",
    school: "IIMT, GGSIPU",
    dates: "2018 — 2021",
    detail: "8.3 CGPA",
  },
] as const;

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
