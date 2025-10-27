import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Load seed data from JSON file
const seedDataPath = path.join(__dirname, 'seed-data.json');
const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'));

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing FAQ and QA data...');
    await prisma.fAQ.deleteMany({});
    await prisma.qA.deleteMany({});

    // Seed Q&A data
    console.log('📝 Seeding Q&A data...');
    const qaCount = seedData.qaData.english.length;

    for (let i = 0; i < qaCount; i++) {
      const enQ = seedData.qaData.english[i];
      const tlQ = seedData.qaData.tagalog[i] || enQ; // Fall back to English if not available
      const tagQ = seedData.qaData.taglish[i] || enQ; // Fall back to English if not available

      await prisma.qA.create({
        data: {
          questionEn: enQ.question,
          answerEn: enQ.answer,
          questionTl: tlQ.question,
          answerTl: tlQ.answer,
          questionTag: tagQ.question,
          answerTag: tagQ.answer,
          searchKeywords: `${enQ.question} ${enQ.answer}`.toLowerCase()
        }
      });
    }
    console.log(`✅ Seeded ${qaCount} Q&A entries`);

    // Seed FAQ data
    console.log('📚 Seeding FAQ data...');
    for (const faq of seedData.faqData.faqs) {
      await prisma.fAQ.create({
        data: {
          faqId: faq.id,
          category: faq.category,
          questionEn: faq.english.question,
          answerEn: faq.english.answer,
          questionTl: faq.tagalog.question,
          answerTl: faq.tagalog.answer,
          questionTag: faq.taglish.question,
          answerTag: faq.taglish.answer,
          searchKeywords: `${faq.category} ${faq.english.question} ${faq.english.answer}`.toLowerCase()
        }
      });
    }
    console.log(`✅ Seeded ${seedData.faqData.faqs.length} FAQ entries`);

    console.log('🎉 Seeding completed successfully!');
    console.log(`\nSummary:`);
    console.log(`  - Q&A Entries: ${qaCount}`);
    console.log(`  - FAQ Entries: ${seedData.faqData.faqs.length}`);
    console.log(`  - Total: ${qaCount + seedData.faqData.faqs.length} entries\n`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
