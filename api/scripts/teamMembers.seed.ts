import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { teamMembers } from "@models/teamMembers";
import { DatabaseService } from "@modules/database/database.service";
import { AppModule } from "@src/app.module";

(async () => {
  const logger = new Logger("TeamMembersSeed");
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ["error", "warn", "log"] });
  const db = app.get(DatabaseService).db;

  try {
    logger.log("Seeding team members...");

    // Clear existing team members to allow clean re-seeding
    await db.delete(teamMembers);

    const seedData = [
      {
        name: "Muhammad Ayoob",
        jobTitle: "Business Development Representative",
        socialLink: "https://www.linkedin.com/in/mohammad-ayoub-baloch/",
        profileImage: "https://ui-avatars.com/api/?name=Muhammad+Ayoob&background=0D8ABC&color=fff&size=256",
        review: "Great team, exciting projects, and a strong focus on client success."
      },
      {
        name: "Fatima Ali",
        jobTitle: "People Ops",
        socialLink: "https://www.linkedin.com/in/onefatima/",
        profileImage: "https://ui-avatars.com/api/?name=Fatima+Ali&background=0D8ABC&color=fff&size=256",
        review: "A supportive workplace where people are valued and encouraged to grow."
      },
      {
        name: "Yasir Khalil",
        jobTitle: "Technical Project Manager",
        socialLink: "https://www.linkedin.com/in/oneyasirkhalil/",
        profileImage: "https://ui-avatars.com/api/?name=Yasir+Khalil&background=0D8ABC&color=fff&size=256",
        review: "Delivering quality solutions with a talented and collaborative team is truly rewarding."
      },
      {
        name: "Muhammad Ali",
        jobTitle: "Senior Front End Developer",
        socialLink: null,
        profileImage: "https://ui-avatars.com/api/?name=Muhammad+Ali&background=0D8ABC&color=fff&size=256",
        review: "I enjoy building modern, user friendly applications that create real impact."
      },
      {
        name: "Muhammad Asad",
        jobTitle: "AI Engineer",
        socialLink: "https://www.linkedin.com/in/axadishaq/",
        profileImage: "https://ui-avatars.com/api/?name=Muhammad+Asad&background=0D8ABC&color=fff&size=256",
        review: "Working on innovative AI solutions makes every project exciting and meaningful."
      },
      {
        name: "M. Safiullah",
        jobTitle: "Senior AI Engineer",
        socialLink: null,
        profileImage: "https://ui-avatars.com/api/?name=M+Safiullah&background=0D8ABC&color=fff&size=256",
        review: "Sharkstack encourages innovation while maintaining high engineering standards."
      },
      {
        name: "Muhammad Hamza",
        jobTitle: "Automation Engineer",
        socialLink: null,
        profileImage: "https://ui-avatars.com/api/?name=Muhammad+Hamza&background=0D8ABC&color=fff&size=256",
        review: "Building smart automations that save time and improve business efficiency is what I love."
      },
      {
        name: "Alina Rahman",
        jobTitle: "Client Success Manager",
        socialLink: null,
        profileImage: "https://ui-avatars.com/api/?name=Alina+Rahman&background=0D8ABC&color=fff&size=256",
        review: "Helping clients succeed and seeing their growth is the best part of my role."
      },
      {
        name: "Maida R.",
        jobTitle: "Talent Acquisition Expert",
        socialLink: null,
        profileImage: "https://ui-avatars.com/api/?name=Maida+R&background=0D8ABC&color=fff&size=256",
        review: "A positive culture with talented people and endless learning opportunities."
      },
      {
        name: "Samee",
        jobTitle: "Accounts Head",
        socialLink: null,
        profileImage: "https://ui-avatars.com/api/?name=Samee&background=0D8ABC&color=fff&size=256",
        review: "A professional environment built on trust, teamwork, and long term growth."
      },
      {
        name: "Izza",
        jobTitle: "DR Copywriter | Frontend Developer | Mobile App Developer",
        socialLink: "https://www.linkedin.com/in/izza-zainab-niazi/",
        profileImage: "https://ui-avatars.com/api/?name=Izza&background=0D8ABC&color=fff&size=256",
        review: "Combining creative copywriting with frontend and mobile app development to craft exceptional user experiences."
      },
      {
        name: "Khizer",
        jobTitle: "MERN Stack Developer @ SharkStack | Built AI Chatbot Platform | Scalable APIs | AWS",
        socialLink: "https://www.linkedin.com/in/khizer30/",
        profileImage: "https://ui-avatars.com/api/?name=Khizer&background=0D8ABC&color=fff&size=256",
        review: "Building scalable APIs, AI platforms, and cloud infrastructure to power modern digital solutions."
      },
      {
        name: "Arsalan",
        jobTitle: "Software Engineer Intern @ SharkStack | Automation, Full Stack AI Engineer",
        socialLink: "https://www.linkedin.com/in/arslanasghar-/",
        profileImage: "https://ui-avatars.com/api/?name=Arsalan&background=0D8ABC&color=fff&size=256",
        review: "Engineering intelligent automations and full-stack AI applications with a high-performing team."
      },
      {
        name: "Sunaina",
        jobTitle: "BS Computer Science Graduate | Python Developer | Aspiring Software Engineer",
        socialLink: "https://www.linkedin.com/in/sunaina-shamshad-3621b024a/",
        profileImage: "https://ui-avatars.com/api/?name=Sunaina&background=0D8ABC&color=fff&size=256",
        review: "Developing Python applications and contributing to innovative software solutions at Sharkstack."
      },
      {
        name: "Kashif",
        jobTitle:
          "Klaviyo x Shopify Expert | Specialized in Customer Retention | $10M+ Revenue Impact | Managing 7-8 Figure DTC & E-commerce Brands | Klaviyo Certified",
        socialLink: "https://www.linkedin.com/in/kashif-ali-shaheen/",
        profileImage: "https://ui-avatars.com/api/?name=Kashif&background=0D8ABC&color=fff&size=256",
        review: "Specializing in e-commerce retention strategies and email marketing that drive massive revenue impact."
      },
      {
        name: "Abdullah Afzal",
        jobTitle:
          "Business Development Specialist | LinkedIn Outreach & LinkedIn Lead Gen Expert | Upwork Bidding | Client Acquisition | B2B | B2C | Sales Funnel Optimization",
        socialLink: "https://www.linkedin.com/in/abdullah-afzal-ch/",
        profileImage: "https://ui-avatars.com/api/?name=Abdullah+Afzal&background=0D8ABC&color=fff&size=256",
        review: "Driving client acquisition, sales funnel optimization, and strategic business growth."
      },
      {
        name: "Muneeba",
        jobTitle: "Team Lead | Senior Fullstack Engineer | MERN Stack | 20+ Apps Shipped",
        socialLink: "https://www.linkedin.com/in/muneeba-dilawaze/",
        profileImage: "https://ui-avatars.com/api/?name=Muneeba&background=0D8ABC&color=fff&size=256",
        review: "Leading fullstack development teams and delivering high-quality, production-ready applications."
      }
    ];

    const inserted = await db.insert(teamMembers).values(seedData).returning();

    logger.log(`✅ Successfully seeded ${inserted.length} team members:`);
    inserted.forEach((m) => {
      logger.log(`  - [ID: ${m.id}] ${m.name} (${m.jobTitle})`);
    });
  } catch (error) {
    logger.error("Seeding team members failed:", error);
    process.exit(1);
  } finally {
    await app.close();
  }
})();
