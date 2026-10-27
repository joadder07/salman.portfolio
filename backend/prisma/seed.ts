import { PrismaClient, Role, CommentStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed...');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  // 1. Seed Admin User
  const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: hashedPassword,
      name: 'Salman Sajid Joadder',
      bio: existingUser?.bio || 'Researcher at IntelliNova research team & Department of Public Health at Daffodil International University.',
      profilePic: existingUser?.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    },
    create: {
      email: adminEmail,
      passwordHash: hashedPassword,
      name: 'Salman Sajid Joadder',
      bio: 'Researcher at IntelliNova research team & Department of Public Health at Daffodil International University.',
      profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      role: Role.ADMIN,
    },
  });
  console.log(`👤 Admin user ready: ${admin.email}`);

  // Default initial music tracklist with Pink Floyd first
  const defaultMusicPlaylist = JSON.stringify([
    {
      title: "Pink Floyd - Breathe (In The Air) (2023 Remaster) [jcz0YxYl6Ac]",
      artist: "Pink Floyd",
      src: "https://res.cloudinary.com/jmgpicxr/video/upload/v1791739303/portfolio/music/vfqvo5qixfu75t27j77w.mp3"
    },
    {
      title: "Mild Orange - One (Official Video)",
      artist: "Mild Orange",
      src: "https://res.cloudinary.com/jmgpicxr/video/upload/v1791726532/portfolio/music/wfhegdpoawm4tzrozpkh.mp3"
    },
    {
      title: "Bob Moses - Heaven Only Knows (Official Audio)",
      artist: "Bob Moses",
      src: "https://res.cloudinary.com/jmgpicxr/video/upload/v1791726745/portfolio/music/oj21qxduz7fbouhxo6aw.mp3"
    },
    {
      title: "Harry Styles - Sign of the Times (Official Video)",
      artist: "Harry Styles",
      src: "https://res.cloudinary.com/jmgpicxr/video/upload/v1791739328/portfolio/music/lbdncygjw8s7cae97znu.mp3"
    },
    {
      title: "Tears For Fears - Head Over Heels [CsHiG-43Fzg]",
      artist: "Tears For Fears",
      src: "https://res.cloudinary.com/jmgpicxr/video/upload/v1791739345/portfolio/music/sedspavfpeea2q25b8hw.mp3"
    }
  ]);

  const defaultHeroImages = JSON.stringify([
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
      title: 'Alpine Reflections',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=1200&auto=format&fit=crop',
      title: 'Neon Odyssey',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
      title: 'Coastal Solitude',
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop',
      title: 'Misty Horizon',
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
      title: 'Circuit Telemetry',
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
      title: 'Deep Space Analytics',
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
      title: 'Urban Silhouette',
    },
    {
      id: 8,
      url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
      title: 'Starry Peaks',
    },
  ]);

  // 2. Seed Site Settings
  const existingSettings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {
      siteName: existingSettings?.siteName || 'Salman Sajid Joadder',
      tagline: existingSettings?.tagline || 'Researching Public Health, Data Systems & Healthcare Innovations',
      heroTitle: existingSettings?.heroTitle || 'Think. Create. Innovate',
      heroSubtitle: existingSettings?.heroSubtitle || 'A Curious Mind in Health Science, Research, Photography, Art, and Exploration',
      aboutText: existingSettings?.aboutText || 'Researcher at IntelliNova Research Team | Public Health Student at Daffodil International University | Videographer & Storyteller capturing perspectives beyond the lens.',
      activeTheme: existingSettings?.activeTheme || 'midnight',
      socialLinks: JSON.stringify({
        facebook: 'https://facebook.com',
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        youtube: 'https://youtube.com',
      }),
      facebookUrl: 'https://facebook.com',
      instagramUrl: 'https://instagram.com',
      musicPlaylist: existingSettings?.musicPlaylist || defaultMusicPlaylist,
      heroImages: existingSettings?.heroImages || defaultHeroImages,
    },
    create: {
      id: 'singleton',
      siteName: 'Salman Sajid Joadder',
      tagline: 'Researching Public Health, Data Systems & Healthcare Innovations',
      heroTitle: 'Think. Create. Innovate',
      heroSubtitle: 'A Curious Mind in Health Science, Research, Photography, Art, and Exploration',
      aboutText: 'Researcher at IntelliNova Research Team | Public Health Student at Daffodil International University | Videographer & Storyteller capturing perspectives beyond the lens.',
      activeTheme: 'midnight',
      socialLinks: JSON.stringify({
        facebook: 'https://facebook.com',
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        youtube: 'https://youtube.com',
      }),
      facebookUrl: 'https://facebook.com',
      instagramUrl: 'https://instagram.com',
      musicPlaylist: defaultMusicPlaylist,
      heroImages: defaultHeroImages,
    },
  });
  console.log(`⚙️ Site settings initialized: ${settings.siteName}`);

  // 3. Clear existing sample records to avoid duplicate accumulation
  await prisma.comment.deleteMany({});
  await prisma.photography.deleteMany({});
  await prisma.video.deleteMany({});
  await prisma.education.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.hobby.deleteMany({});
  await prisma.pet.deleteMany({});
  await prisma.book.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.art.deleteMany({});

  // 4. Seed Education
  await prisma.education.createMany({
    data: [
      {
        institution: 'Daffodil International University',
        degree: 'Undergraduate - Public Health',
        field: 'Department of Public Health',
        startDate: new Date('2025-01-01'),
        endDate: null,
        description:
          'Industrial Innovation Centre (IIC)\nApril 2026 – Present\nWorking on research activities and project development at the Industrial Innovation Centre (DIU)',
        order: 0,
      },
      {
        institution: 'Shahid Police Smrity College, Mirpur, Dhaka',
        degree: 'Higher Secondary Certificate (HSC)',
        field: 'Science',
        startDate: new Date('2022-01-01'),
        endDate: new Date('2024-12-31'),
        description: 'HSC: GPA 5',
        order: 1,
      },
      {
        institution: 'Ideal Preparatory & High School',
        degree: 'Secondary School Certificate (SSC)',
        field: null,
        startDate: new Date('2016-01-01'),
        endDate: new Date('2022-12-31'),
        description: 'SSC: GPA 5 | JSC: GPA 5 | PSC: GPA 5',
        order: 2,
      },
    ],
  });
  console.log('🎓 Education records seeded');

  // 5. Seed Achievements & Flagship Projects
  await prisma.achievement.createMany({
    data: [
      {
        title: 'SHEMAS: Smart Hall Energy Monitoring & Alert System',
        category: 'IoT & Smart Infrastructure',
        description: 'Engineered an end-to-end IoT energy metering framework with real-time anomaly detection, automated surge alerts, and cloud telemetry analytics that optimized campus power usage by 24%.',
        link: 'https://github.com',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
        date: new Date('2024-05-15'),
        order: 0,
      },
      {
        title: 'FieldShift: CropWise AI (NASA Space Apps Challenge)',
        category: 'Hackathon & Aerospace AI',
        description: 'Global Nominee project combining NASA Earth observation satellite multispectral imagery with microclimate sensors to optimize agricultural yield and water preservation.',
        link: 'https://github.com',
        imageUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&auto=format&fit=crop&q=80',
        date: new Date('2023-10-08'),
        order: 1,
      },
      {
        title: 'AMANAT: Zero-Trust Data Privacy Framework',
        category: 'Cybersecurity Research',
        description: 'Researched and implemented a lightweight cryptographic data protection framework providing decentralized verifiable credentials and privacy-preserving audit logs.',
        link: 'https://github.com',
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
        date: new Date('2024-08-20'),
        order: 2,
      },
      {
        title: 'Lead Researcher — IntelliNova Research Team (INRT)',
        category: 'Academic Research Leadership',
        description: 'Spearheaded research initiatives across IoT networks and applied machine learning. Mentored 15+ student developers and co-authored papers accepted at international symposiums.',
        link: 'https://github.com',
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
        date: new Date('2023-01-15'),
        order: 3,
      },
    ],
  });
  console.log('🏆 Achievements & Projects seeded');

  // 6. Photography: Start completely empty (0 items)
  console.log('📷 Photography section initialized (0 items - clean slate)');

  // 7. Seed Videos (and capture IDs for comments)
  const video1 = await prisma.video.create({
    data: {
      title: 'SHEMAS IoT System Architecture & Realtime Telemetry Demo',
      category: 'System Walkthrough',
      description: 'Detailed technical walkthrough of the SHEMAS sensor nodes, MQTT message brokers, and realtime WebSocket dashboard.',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      duration: 360,
      featured: true,
      order: 0,
    },
  });

  await prisma.video.create({
    data: {
      title: 'FieldShift: NASA Space Apps Pitch & AI Demo',
      category: 'Hackathon Pitch',
      description: 'Project presentation demonstrating multispectral satellite analysis for precision agriculture and drought prediction.',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&auto=format&fit=crop&q=80',
      duration: 180,
      featured: true,
      order: 1,
    },
  });
  console.log('🎬 Videos seeded');

  // 8. Seed Approved Comments (Only for video)
  await prisma.comment.createMany({
    data: [
      {
        authorName: 'Dr. Michael Chen',
        authorEmail: 'mchen@mit.edu',
        content: 'Impressive demonstration of decoupled MQTT architecture for IoT telemetry. Very clean code organization.',
        status: CommentStatus.APPROVED,
        videoId: video1.id,
      },
    ],
  });
  console.log('💬 Sample approved comments seeded');

  // 9. Seed Hobbies
  await prisma.hobby.createMany({
    data: [
      {
        name: 'Astrophotography & Telescopes',
        description: 'Tracking deep-sky nebulae and capturing high-resolution lunar craters through a motorized equatorial mount telescope.',
        imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
        order: 0,
      },
      {
        name: 'Mechanical Keyboards & Embedded Firmware',
        description: 'Designing custom ergonomic split keyboard layouts with hand-soldered PCBs and custom QMK/ZMK firmware.',
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
        order: 1,
      },
      {
        name: 'Open Source Systems & Linux Kernels',
        description: 'Tinkering with NixOS declarative setups, low-level Rust systems utilities, and custom home server automation.',
        imageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=80',
        order: 2,
      },
    ],
  });
  console.log('❤️ Hobbies seeded');

  // 10. Pets: Start completely empty (0 items)
  console.log('🐾 Pets section initialized (0 items - clean slate)');

  // 11. Seed Bookshelf
  await prisma.book.createMany({
    data: [
      {
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        genre: 'Software Architecture & Distributed Systems',
        rating: 5,
        review: 'The definitive bible of modern distributed computing. Invaluable chapters on replication lag, consensus protocols, and partition tolerance.',
        coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
        readDate: new Date('2023-06-15'),
        order: 0,
      },
      {
        title: 'Clean Architecture: A Craftsman\'s Guide',
        author: 'Robert C. Martin',
        genre: 'Software Engineering',
        rating: 5,
        review: 'Fundamental principles for keeping core business logic strictly decoupled from frameworks, databases, and delivery mechanisms.',
        coverUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=800&auto=format&fit=crop&q=80',
        readDate: new Date('2023-02-10'),
        order: 1,
      },
      {
        title: 'The Pragmatic Programmer (20th Anniversary)',
        author: 'David Thomas & Andrew Hunt',
        genre: 'Engineering Craftsmanship',
        rating: 5,
        review: 'A masterclass in professional pragmatism, testing strategies, orthogonality, and continuous developer learning.',
        coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
        readDate: new Date('2022-11-20'),
        order: 2,
      },
    ],
  });
  console.log('📚 Books seeded');

  // 12. Seed Messages (Admin Inbox showcase)
  await prisma.message.createMany({
    data: [
      {
        senderName: 'Dr. Evelyn Vance',
        senderEmail: 'evance@inrt-research.org',
        subject: 'Invited Talk on SHEMAS at IEEE IoT Summit',
        content: 'Hi Salman, we were thoroughly impressed by the telemetry benchmarks of SHEMAS. We would love to have you deliver a keynote demonstration at the upcoming IEEE summit.',
        isAnonymous: false,
        isRead: false,
      },
      {
        senderName: 'Anonymous Visitor',
        subject: 'Inspiring Portfolio & Design',
        content: 'Just dropped by after seeing your FieldShift project on GitHub. The decoupled architecture, fluid animations, and music player are magnificent. Keep up the brilliant work!',
        isAnonymous: true,
        isRead: false,
      },
    ],
  });
  console.log('📬 Admin inbox messages seeded');

  // 13. Art: Start completely empty (0 items)
  console.log('🎨 Art section initialized (0 items - clean slate)');

  console.log('🎉 Comprehensive database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
