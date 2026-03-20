/**
 * Sample Data Generator for DataTableV2 Demo
 * Generates realistic data to test all field types and operators
 */

export interface SampleDataRow extends Record<string, unknown> {
  id: string;
  // Text fields
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  // Number fields
  age: number;
  salary: number;
  rating: number;
  score: number;
  // Date fields
  createdAt: string;
  updatedAt: string;
  birthDate: string;
  hireDate: string;
  // Select fields
  status: "active" | "inactive" | "pending" | "suspended";
  department: "engineering" | "marketing" | "sales" | "hr" | "finance";
  role: "admin" | "manager" | "employee" | "intern";
  // Multi-select fields
  skills: string[];
  tags: string[];
  // Boolean fields
  isVerified: boolean;
  isActive: boolean;
  hasSubscription: boolean;
  // Range field (for testing)
  progress: number;
}

// Status options
export const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending", value: "pending" },
  { label: "Suspended", value: "suspended" },
];

// Department options
export const departmentOptions = [
  { label: "Engineering", value: "engineering" },
  { label: "Marketing", value: "marketing" },
  { label: "Sales", value: "sales" },
  { label: "HR", value: "hr" },
  { label: "Finance", value: "finance" },
];

// Role options
export const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
  { label: "Employee", value: "employee" },
  { label: "Intern", value: "intern" },
];

// Skills options
export const skillsOptions = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "React", value: "react" },
  { label: "Node.js", value: "nodejs" },
  { label: "Python", value: "python" },
  { label: "SQL", value: "sql" },
  { label: "AWS", value: "aws" },
  { label: "Docker", value: "docker" },
];

// Tags options
export const tagsOptions = [
  { label: "Priority", value: "priority" },
  { label: "Urgent", value: "urgent" },
  { label: "Review", value: "review" },
  { label: "Completed", value: "completed" },
  { label: "In Progress", value: "in-progress" },
  { label: "Blocked", value: "blocked" },
];

// First names pool
const firstNames = [
  "James",
  "Mary",
  "John",
  "Patricia",
  "Robert",
  "Jennifer",
  "Michael",
  "Linda",
  "William",
  "Elizabeth",
  "David",
  "Barbara",
  "Richard",
  "Susan",
  "Joseph",
  "Jessica",
  "Thomas",
  "Sarah",
  "Charles",
  "Karen",
  "Christopher",
  "Nancy",
  "Daniel",
  "Lisa",
  "Matthew",
  "Betty",
  "Anthony",
  "Margaret",
  "Mark",
  "Sandra",
  "Donald",
  "Ashley",
  "Steven",
  "Kimberly",
  "Paul",
  "Emily",
  "Andrew",
  "Donna",
  "Joshua",
  "Michelle",
];

// Last names pool
const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
];

// Description templates
const descriptionTemplates = [
  "Experienced professional with expertise in {skill}.",
  "Team lead focusing on {skill} development.",
  "Specialist in {skill} with 5+ years experience.",
  "Junior developer learning {skill}.",
  "Senior engineer proficient in {skill} and cloud technologies.",
  "Project manager overseeing {skill} initiatives.",
  "Consultant providing {skill} solutions.",
  "Analyst with strong {skill} background.",
];

// Helper functions
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomItems<T>(array: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 2): number {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatDateTime(date: Date): string {
  return date.toISOString();
}

/**
 * Generate sample data for testing
 * @param count Number of rows to generate
 * @param seed Optional seed for reproducibility
 */
export function generateSampleData(count: number = 100): SampleDataRow[] {
  const data: SampleDataRow[] = [];
  const now = new Date();
  const fiveYearsAgo = new Date(
    now.getFullYear() - 5,
    now.getMonth(),
    now.getDate(),
  );
  const thirtyYearsAgo = new Date(
    now.getFullYear() - 30,
    now.getMonth(),
    now.getDate(),
  );
  const sixtyYearsAgo = new Date(
    now.getFullYear() - 60,
    now.getMonth(),
    now.getDate(),
  );

  for (let i = 0; i < count; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const skills = randomItems(
      skillsOptions.map((s) => s.value),
      1,
      4,
    );
    const tags = randomItems(
      tagsOptions.map((t) => t.value),
      0,
      3,
    );
    const skill = randomItem(skillsOptions).label;

    const createdAt = randomDate(fiveYearsAgo, now);
    const updatedAt = randomDate(createdAt, now);
    const birthDate = randomDate(sixtyYearsAgo, thirtyYearsAgo);
    const hireDate = randomDate(fiveYearsAgo, now);

    data.push({
      id: `user-${i + 1}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      description: randomItem(descriptionTemplates).replace("{skill}", skill),
      age: randomInt(22, 65),
      salary: randomInt(30000, 200000),
      rating: randomFloat(1, 5, 1),
      score: randomInt(0, 100),
      createdAt: formatDateTime(createdAt),
      updatedAt: formatDateTime(updatedAt),
      birthDate: formatDate(birthDate),
      hireDate: formatDate(hireDate),
      status: randomItem(["active", "inactive", "pending", "suspended"]),
      department: randomItem([
        "engineering",
        "marketing",
        "sales",
        "hr",
        "finance",
      ]),
      role: randomItem(["admin", "manager", "employee", "intern"]),
      skills,
      tags,
      isVerified: Math.random() > 0.3,
      isActive: Math.random() > 0.2,
      hasSubscription: Math.random() > 0.5,
      progress: randomInt(0, 100),
    });
  }

  return data;
}

// Pre-generated sample data for consistent demo
export const sampleData = generateSampleData(100);
