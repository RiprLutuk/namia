import type { BlogPostData, FaqData, PersonilData, StatData, TestimonialData } from "./cms";

// The editor's legacy field names are translated at one API boundary.
export const statInput = (data: Partial<StatData>) => ({
  title: data.label ?? data.title,
  amount: data.value ?? data.amount,
  unit: data.unit ?? "",
  icon: data.icon,
  subtitle: data.sublabel ?? data.subtitle,
});
export const articleInput = (data: Partial<BlogPostData>) => ({
  ...data,
  photo: data.coverImage ?? data.photo,
  content: Array.isArray(data.content) ? data.content.join("\n\n") : data.content,
});
export const faqInput = (data: Partial<FaqData>) => ({
  question: data.question,
  answer: data.answer,
  categoryId: data.category === "investor" ? 3 : data.category === "borrower" ? 2 : data.categoryId,
  categoryName:
    data.category === "investor"
      ? "Pendana"
      : data.category === "borrower"
        ? "Penerima pembiayaan"
        : data.categoryName,
  isInvestor: data.category ? Number(data.category === "investor") : data.isInvestor,
});
export const personilInput = (data: Partial<PersonilData>) => ({
  fullName: data.fullname ?? data.fullName,
  jobTitle: data.job_title ?? data.jobTitle,
  jobLevel: data.job_level ?? data.jobLevel,
  biography: data.biography,
  photo: data.photo,
  department: data.department ?? "",
  education: data.education,
});
export const testimonialInput = (data: Partial<TestimonialData>) => ({
  ...data,
  type: data.type ?? (data.role === "investor" ? "investor" : "borrower"),
});
export const editorStat = (data: StatData): StatData => ({
  ...data,
  label: data.title ?? data.label,
  value: data.amount ?? data.value,
  sublabel: data.subtitle ?? data.sublabel,
});
export const editorArticle = (data: BlogPostData): BlogPostData => ({
  ...data,
  coverImage: data.photo ?? data.coverImage,
});
export const editorFaq = (data: FaqData): FaqData => ({
  ...data,
  category: data.isInvestor ? "investor" : "borrower",
  answer: data.answer.replace(/<[^>]*>/g, " "),
});
