import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FAQService {
  /**
   * Search FAQs in database by keywords
   * Super fast - no AI needed!
   */
  static async searchFAQs(query: string, language: 'en' | 'tl' | 'taglish' = 'en'): Promise<any[]> {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 3);

    if (searchTerms.length === 0) {
      return [];
    }

    // Build search conditions
    const searchConditions = searchTerms.map(term => ({
      searchKeywords: {
        contains: term
      }
    }));

    // Query database
    const faqs = await prisma.fAQ.findMany({
      where: {
        OR: searchConditions
      },
      take: 3 // Return top 3 matches
    });

    // Map to appropriate language
    return faqs.map(faq => ({
      id: faq.faqId,
      category: faq.category,
      question: language === 'en' ? faq.questionEn : language === 'tl' ? faq.questionTl : faq.questionTag,
      answer: language === 'en' ? faq.answerEn : language === 'tl' ? faq.answerTl : faq.answerTag
    }));
  }

  /**
   * Get FAQ by category
   */
  static async getFAQsByCategory(category: string, language: 'en' | 'tl' | 'taglish' = 'en'): Promise<any[]> {
    const faqs = await prisma.fAQ.findMany({
      where: {
        category: {
          contains: category
        }
      },
      take: 5
    });

    return faqs.map(faq => ({
      id: faq.faqId,
      category: faq.category,
      question: language === 'en' ? faq.questionEn : language === 'tl' ? faq.questionTl : faq.questionTag,
      answer: language === 'en' ? faq.answerEn : language === 'tl' ? faq.answerTl : faq.answerTag
    }));
  }

  /**
   * Search Q&A database
   */
  static async searchQA(query: string, language: 'en' | 'tl' | 'taglish' = 'en'): Promise<any | null> {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 3);

    if (searchTerms.length === 0) {
      return null;
    }

    const searchConditions = searchTerms.map(term => ({
      searchKeywords: {
        contains: term
      }
    }));

    const qa = await prisma.qA.findFirst({
      where: {
        OR: searchConditions
      }
    });

    if (!qa) return null;

    return {
      question: language === 'en' ? qa.questionEn : language === 'tl' ? qa.questionTl : qa.questionTag,
      answer: language === 'en' ? qa.answerEn : language === 'tl' ? qa.answerTl : qa.answerTag
    };
  }

  /**
   * Get all FAQ categories
   */
  static async getCategories(): Promise<string[]> {
    const categories = await prisma.fAQ.findMany({
      select: {
        category: true
      },
      distinct: ['category']
    });

    return categories.map(c => c.category);
  }
}
