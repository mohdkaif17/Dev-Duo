require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const Challenge = require('./models/Challenge');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/clubhub';

// Sample data
const sampleEvents = [
  {
    title: 'React Workshop: Building Modern UIs',
    description: 'Learn how to build responsive, interactive user interfaces with React hooks, context API, and modern patterns. Perfect for beginners and intermediate developers.',
    date: new Date('2026-04-15T14:00:00Z'),
    location: 'Tech Lab Room 301',
    difficulty: 'Easy'
  },
  {
    title: 'Advanced Node.js & Microservices',
    description: 'Deep dive into building scalable backend systems with Node.js, Express, and microservices architecture. Includes authentication, caching, and database optimization.',
    date: new Date('2026-04-22T15:00:00Z'),
    location: 'Conference Hall A',
    difficulty: 'Hard'
  },
  {
    title: 'AI & Machine Learning Hackathon',
    description: '48-hour hackathon focused on building AI-powered applications. Teams compete to solve real-world problems using ML models and APIs.',
    date: new Date('2026-05-01T09:00:00Z'),
    location: 'Innovation Center',
    difficulty: 'Hard'
  },
  {
    title: 'Git & GitHub Fundamentals',
    description: 'Master version control with hands-on exercises. Learn branching strategies, pull requests, and collaborative workflows essential for any developer.',
    date: new Date('2026-04-18T16:00:00Z'),
    location: 'Computer Lab B',
    difficulty: 'Easy'
  },
  {
    title: 'Full Stack Project Showcase',
    description: 'Members present their full-stack projects with live demos. Get feedback from peers and learn about different tech stacks and architectures.',
    date: new Date('2026-04-25T13:00:00Z'),
    location: 'Auditorium',
    difficulty: 'Med'
  }
];

const sampleChallenges = [
  {
    title: 'Build a REST API',
    description: 'Create a complete REST API for a task management app with CRUD operations, authentication, and data validation. Use any Node.js framework.',
    difficulty: 'Med'
  },
  {
    title: 'Portfolio Website',
    description: 'Design and build a responsive personal portfolio website with HTML, CSS, and JavaScript. Must include animations and mobile-friendly layout.',
    difficulty: 'Easy'
  },
  {
    title: 'Real-time Chat App',
    description: 'Build a real-time chat application using WebSockets. Support multiple rooms, user presence, and message history. Deploy to a live server.',
    difficulty: 'Hard'
  },
  {
    title: 'Weather Dashboard',
    description: 'Create a weather dashboard that fetches data from a public API and displays current conditions and 5-day forecast. Include search by city.',
    difficulty: 'Easy'
  },
  {
    title: 'E-commerce Cart System',
    description: 'Implement a shopping cart system with product listings, cart management, checkout flow, and payment integration simulation.',
    difficulty: 'Hard'
  }
];

async function seed() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!\n');

    // Clear existing collections
    console.log('Clearing existing data...');
    await Event.deleteMany({});
    await Challenge.deleteMany({});
    console.log('Cleared Event and Challenge collections\n');

    // Find an existing user to use as organizer, or create one
    let organizer = await User.findOne();
    
    if (!organizer) {
      console.log('No existing user found. Creating seed user...');
      organizer = await User.create({
        name: 'Tech Club Admin',
        email: 'admin@techclub.com',
        password: 'password123', // Will be hashed by User model
        role: 'admin'
      });
      console.log('Seed user created: admin@techclub.com\n');
    } else {
      console.log(`Using existing user as organizer: ${organizer.name} (${organizer.email})\n`);
    }

    // Insert events with organizer
    const eventsWithOrganizer = sampleEvents.map(event => ({
      ...event,
      organizer: organizer._id
    }));

    const insertedEvents = await Event.insertMany(eventsWithOrganizer);
    console.log(`Inserted ${insertedEvents.length} events:`);
    insertedEvents.forEach((e, i) => console.log(`  ${i + 1}. ${e.title} (${e.difficulty})`));

    console.log('');

    // Insert challenges
    const insertedChallenges = await Challenge.insertMany(sampleChallenges);
    console.log(`Inserted ${insertedChallenges.length} challenges:`);
    insertedChallenges.forEach((c, i) => console.log(`  ${i + 1}. ${c.title} (${c.difficulty})`));

    console.log('\n✅ Seeding completed successfully!');

  } catch (err) {
    console.error('\n❌ Seeding failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
