import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize placeholder campaigns if none exist
async function initializePlaceholderCampaigns() {
  try {
    const existingCampaigns = await kv.getByPrefix("campaign:");
    if (existingCampaigns.length === 0) {
      console.log("Initializing placeholder campaigns...");
      
      const placeholderCampaigns = [
        {
          id: "campaign:placeholder-1",
          title: "Community Garden Revival",
          description: "Transform our neighborhood's abandoned lot into a thriving community garden where families can grow fresh produce and connect with nature.",
          category: "environment",
          goalAmount: 15000,
          currentAmount: 8500,
          location: { lat: 33.7490, lng: -84.3880 },
          locationName: "Atlanta, GA",
          creatorId: "system",
          creatorName: "Green Spaces Initiative",
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          orgWebsite: "https://example.org/garden-revival",
          needType: "both", // money, volunteer, goods, both
          volunteerNeeds: "Weekend garden maintenance, planting help",
          urgent: false,
          campaignType: "organization", // organization or personal
        },
        {
          id: "campaign:placeholder-2",
          title: "Tech Education for Youth",
          description: "Provide coding workshops and laptops to underserved youth in our community. Every child deserves access to technology education.",
          category: "technology",
          goalAmount: 25000,
          currentAmount: 12000,
          location: { lat: 33.7490, lng: -84.3880 },
          locationName: "Atlanta, GA",
          creatorId: "system",
          creatorName: "Future Coders",
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          orgWebsite: "https://example.org/youth-tech",
          needType: "both",
          volunteerNeeds: "Coding instructors, laptop setup assistance",
          urgent: false,
          campaignType: "organization",
        },
        {
          id: "campaign:placeholder-3",
          title: "Senior Meal Delivery Program",
          description: "Deliver nutritious meals to homebound seniors in our community. Help us ensure no senior goes hungry.",
          category: "seniors",
          goalAmount: 10000,
          currentAmount: 7200,
          location: { lat: 33.7490, lng: -84.3880 },
          locationName: "Atlanta, GA",
          creatorId: "system",
          creatorName: "Meals on Wheels Community",
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          orgWebsite: "https://example.org/senior-meals",
          needType: "both",
          volunteerNeeds: "Meal delivery drivers (2 hours/week)",
          urgent: true,
          campaignType: "organization",
        },
        {
          id: "campaign:placeholder-4",
          title: "Animal Shelter Expansion",
          description: "Build a new wing for our animal shelter to save more homeless pets. Every donation helps us provide care for abandoned animals.",
          category: "animals",
          goalAmount: 50000,
          currentAmount: 28000,
          location: { lat: 33.7490, lng: -84.3880 },
          locationName: "Atlanta, GA",
          creatorId: "system",
          creatorName: "Paws & Hearts Shelter",
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          orgWebsite: "https://example.org/animal-shelter",
          needType: "both",
          volunteerNeeds: "Pet socialization, cleaning help, adoption event staff",
          urgent: false,
          campaignType: "organization",
        },
        {
          id: "campaign:placeholder-5",
          title: "Free After-School Art Program",
          description: "Bring art education to children who can't afford classes. Art supplies, instruction, and a safe creative space for all kids.",
          category: "arts",
          goalAmount: 8000,
          currentAmount: 2500,
          location: { lat: 33.7490, lng: -84.3880 },
          locationName: "Atlanta, GA",
          creatorId: "system",
          creatorName: "Arts for All Kids",
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          orgWebsite: "https://example.org/kids-art",
          needType: "both",
          volunteerNeeds: "Art instructors, material organization",
          urgent: false,
          campaignType: "organization",
        },
        {
          id: "campaign:placeholder-6",
          title: "Homeless Shelter Winter Supplies",
          description: "Stock our shelter with warm blankets, coats, and winter essentials. Help us keep our community members warm this winter.",
          category: "housing",
          goalAmount: 12000,
          currentAmount: 9800,
          location: { lat: 33.7490, lng: -84.3880 },
          locationName: "Atlanta, GA",
          creatorId: "system",
          creatorName: "Safe Harbor Shelter",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          orgWebsite: "https://example.org/safe-harbor",
          needType: "goods",
          goodsNeeded: "Blankets, winter coats (sizes M-XXL), warm socks",
          urgent: true,
          campaignType: "organization",
        },
        {
          id: "campaign:placeholder-7",
          title: "Community Health Clinic Equipment",
          description: "Purchase new medical equipment for our free community clinic. Quality healthcare should be accessible to everyone.",
          category: "health",
          goalAmount: 35000,
          currentAmount: 15000,
          location: { lat: 33.7490, lng: -84.3880 },
          locationName: "Atlanta, GA",
          creatorId: "system",
          creatorName: "Community Care Clinic",
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          orgWebsite: "https://example.org/health-clinic",
          needType: "money",
          urgent: false,
          campaignType: "organization",
        },
        {
          id: "campaign:placeholder-8",
          title: "School Library Book Drive",
          description: "Rebuild our elementary school library with diverse, engaging books for young readers. Every child deserves access to great literature.",
          category: "education",
          goalAmount: 6000,
          currentAmount: 4200,
          location: { lat: 33.7490, lng: -84.3880 },
          locationName: "Atlanta, GA",
          creatorId: "system",
          creatorName: "Lincoln Elementary PTA",
          createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          orgWebsite: "https://example.org/school-books",
          needType: "both",
          volunteerNeeds: "Book sorting and cataloging",
          goodsNeeded: "New or gently used children's books",
          urgent: false,
          campaignType: "organization",
        },
        {
          id: "campaign:placeholder-9",
          title: "Food Bank Expansion Project",
          description: "Expand our food bank to serve 500 more families each month. Fighting hunger in our community, one meal at a time.",
          category: "food",
          goalAmount: 20000,
          currentAmount: 11000,
          location: { lat: 33.7490, lng: -84.3880 },
          locationName: "Atlanta, GA",
          creatorId: "system",
          creatorName: "Valley Food Bank",
          createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
          orgWebsite: "https://example.org/food-bank",
          needType: "both",
          volunteerNeeds: "Food sorting and distribution (4 hour shifts)",
          urgent: true,
          campaignType: "organization",
        },
        {
          id: "campaign:placeholder-10",
          title: "Youth Sports Equipment Fund",
          description: "Provide sports equipment and uniforms for kids whose families can't afford them. Every child should have the chance to play.",
          category: "youth",
          goalAmount: 7500,
          currentAmount: 3200,
          location: { lat: 33.7490, lng: -84.3880 },
          locationName: "Atlanta, GA",
          creatorId: "system",
          creatorName: "Youth Sports Alliance",
          createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          orgWebsite: "https://example.org/youth-sports",
          needType: "both",
          volunteerNeeds: "Coaches and referees for weekend games",
          urgent: false,
          campaignType: "organization",
        },
        {
          id: "campaign:placeholder-11",
          title: "Community Center Renovation",
          description: "Renovate our aging community center to continue serving as the heart of our neighborhood with programs for all ages.",
          category: "community",
          goalAmount: 40000,
          currentAmount: 18500,
          location: { lat: 33.7490, lng: -84.3880 },
          locationName: "Atlanta, GA",
          creatorId: "system",
          creatorName: "Mission District Community Center",
          createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
          orgWebsite: "https://example.org/community-center",
          needType: "both",
          volunteerNeeds: "Construction volunteers, painters",
          urgent: false,
          campaignType: "organization",
        },
        {
          id: "campaign:placeholder-12",
          title: "Emergency Disaster Relief Fund",
          description: "Support families affected by recent flooding with emergency supplies, temporary housing, and rebuilding assistance.",
          category: "disaster",
          goalAmount: 30000,
          currentAmount: 22000,
          location: { lat: 33.7490, lng: -84.3880 },
          locationName: "Atlanta, GA",
          creatorId: "system",
          creatorName: "Emergency Relief Network",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          orgWebsite: "https://example.org/disaster-relief",
          needType: "both",
          volunteerNeeds: "Emergency responders, supply distribution",
          goodsNeeded: "Non-perishable food, water, first aid supplies",
          urgent: true,
          campaignType: "organization",
        },
        {
          id: "campaign:personal-1",
          title: "Help Sarah's Family After House Fire",
          description: "Our neighbor Sarah and her two children lost everything in a devastating house fire last week. They need help rebuilding their lives with basic necessities, clothing, and temporary housing costs.",
          category: "disaster",
          goalAmount: 8000,
          currentAmount: 3400,
          location: { lat: 33.7490, lng: -84.3880 },
          locationName: "Atlanta, GA",
          creatorId: "user:sarah-helper",
          creatorName: "Community for Sarah",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          needType: "both",
          goodsNeeded: "Children's clothing (ages 6 and 9), household items",
          urgent: true,
          campaignType: "personal",
          personalStory: "Sarah is a single mother who has always been there for our community. Now she needs our help.",
        },
        {
          id: "campaign:personal-2",
          title: "Medical Bills for David's Cancer Treatment",
          description: "David is a beloved teacher in our community facing mounting medical bills from cancer treatment. Every contribution helps ease the financial burden during this difficult time.",
          category: "health",
          goalAmount: 15000,
          currentAmount: 6800,
          location: { lat: 33.7490, lng: -84.3880 },
          locationName: "Atlanta, GA",
          creatorId: "user:david-friend",
          creatorName: "Friends of David",
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          needType: "money",
          urgent: false,
          campaignType: "personal",
          personalStory: "David has inspired countless students over his 20-year teaching career. Let's support him now.",
        },
        {
          id: "campaign:personal-3",
          title: "Support Maria's College Dream",
          description: "Maria is a first-generation college student with a full scholarship to MIT, but she needs help with living expenses, books, and supplies to make her dream a reality.",
          category: "education",
          goalAmount: 5000,
          currentAmount: 2100,
          location: { lat: 33.7490, lng: -84.3880 },
          locationName: "Atlanta, GA",
          creatorId: "user:maria-mentor",
          creatorName: "Maria's Mentors",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          needType: "money",
          urgent: false,
          campaignType: "personal",
          personalStory: "Maria has overcome incredible obstacles to achieve academic excellence. Help her continue her journey.",
        },
      ];

      for (const campaign of placeholderCampaigns) {
        await kv.set(campaign.id, campaign);
      }
      
      console.log(`Initialized ${placeholderCampaigns.length} placeholder campaigns`);
    }
  } catch (error) {
    console.error("Error initializing placeholder campaigns:", error);
  }
}

// Initialize placeholder campaigns on startup
initializePlaceholderCampaigns();

// Health check endpoint
app.get("/make-server-0f0fb175/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-0f0fb175/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log("Sign up error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log("Sign up error:", error);
    return c.json({ error: "Failed to sign up user" }, 500);
  }
});

// Get all campaigns
app.get("/make-server-0f0fb175/campaigns", async (c) => {
  try {
    console.log("Fetching all campaigns...");
    const campaigns = await kv.getByPrefix("campaign:");
    console.log(`Found ${campaigns.length} campaigns`);
    return c.json({ campaigns });
  } catch (error) {
    console.log("Error fetching campaigns:", error);
    return c.json({ error: "Failed to fetch campaigns" }, 500);
  }
});

// Create a new campaign (requires auth)
app.post("/make-server-0f0fb175/campaigns", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: "Unauthorized - please sign in to create a campaign" }, 401);
    }

    const campaignData = await c.req.json();
    const campaignId = `campaign:${crypto.randomUUID()}`;
    
    const campaign = {
      id: campaignId,
      ...campaignData,
      creatorId: user.id,
      creatorName: user.user_metadata?.name || 'Anonymous',
      createdAt: new Date().toISOString(),
      currentAmount: 0,
    };

    await kv.set(campaignId, campaign);
    return c.json({ campaign });
  } catch (error) {
    console.log("Error creating campaign:", error);
    return c.json({ error: "Failed to create campaign" }, 500);
  }
});

// AI matching endpoint - matches user preferences with campaigns
app.post("/make-server-0f0fb175/match", async (c) => {
  try {
    console.log("Match request received");
    const { preferences, location } = await c.req.json();
    console.log("Preferences:", preferences);
    console.log("Location:", location);
    
    // Get all campaigns
    const allCampaigns = await kv.getByPrefix("campaign:");
    console.log(`Total campaigns available: ${allCampaigns.length}`);
    
    // If no preferences or location provided, return all campaigns
    if (!preferences || (!preferences.categories && !location)) {
      console.log("No filters applied, returning all campaigns");
      return c.json({ matches: allCampaigns });
    }
    
    // Simple AI matching logic based on categories and location
    const matchedCampaigns = allCampaigns
      .filter((campaign: any) => {
        // Match by categories (if provided)
        let categoryMatch = true;
        if (preferences.categories && preferences.categories.length > 0) {
          categoryMatch = preferences.categories.some((cat: string) =>
            campaign.category === cat
          );
        }
        
        // Match by location (if provided)
        let locationMatch = true;
        if (location && location.lat && location.lng && campaign.location) {
          // Calculate distance using Haversine formula approximation
          const R = 3959; // Earth's radius in miles
          const lat1 = location.lat * Math.PI / 180;
          const lat2 = campaign.location.lat * Math.PI / 180;
          const dLat = (campaign.location.lat - location.lat) * Math.PI / 180;
          const dLng = (campaign.location.lng - location.lng) * Math.PI / 180;
          
          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1) * Math.cos(lat2) *
                    Math.sin(dLng / 2) * Math.sin(dLng / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c; // Distance in miles
          
          const radiusInMiles = preferences.radius || 50;
          locationMatch = distance <= radiusInMiles;
          
          console.log(`Campaign ${campaign.title}: distance=${distance.toFixed(1)} miles, radius=${radiusInMiles} miles, match=${locationMatch}`);
        }
        
        return categoryMatch && locationMatch;
      })
      .sort((a: any, b: any) => {
        // Prioritize urgent campaigns
        if (a.urgent && !b.urgent) return -1;
        if (!a.urgent && b.urgent) return 1;
        
        // Then sort by funding need
        const aProgress = (a.currentAmount / a.goalAmount) * 100;
        const bProgress = (b.currentAmount / b.goalAmount) * 100;
        return aProgress - bProgress;
      });
    
    console.log(`Matched ${matchedCampaigns.length} campaigns`);
    return c.json({ matches: matchedCampaigns });
  } catch (error) {
    console.error("Error matching campaigns:", error);
    return c.json({ error: `Failed to match campaigns: ${error.message}` }, 500);
  }
});

// Record a donation
app.post("/make-server-0f0fb175/donate", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: "Unauthorized - please sign in to donate" }, 401);
    }

    const { campaignId, amount } = await c.req.json();
    
    // Get the campaign
    const campaign = await kv.get(campaignId);
    if (!campaign) {
      return c.json({ error: "Campaign not found" }, 404);
    }

    // Update campaign amount
    campaign.currentAmount = (campaign.currentAmount || 0) + amount;
    await kv.set(campaignId, campaign);

    // Record the donation
    const donationId = `donation:${crypto.randomUUID()}`;
    const donation = {
      id: donationId,
      campaignId,
      donorId: user.id,
      donorName: user.user_metadata?.name || 'Anonymous',
      amount,
      timestamp: new Date().toISOString(),
    };
    
    await kv.set(donationId, donation);

    return c.json({ success: true, campaign, donation });
  } catch (error) {
    console.log("Error processing donation:", error);
    return c.json({ error: "Failed to process donation" }, 500);
  }
});

// Get user's campaigns
app.get("/make-server-0f0fb175/my-campaigns", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const allCampaigns = await kv.getByPrefix("campaign:");
    const myCampaigns = allCampaigns.filter((c: any) => c.creatorId === user.id);
    
    return c.json({ campaigns: myCampaigns });
  } catch (error) {
    console.log("Error fetching user campaigns:", error);
    return c.json({ error: "Failed to fetch campaigns" }, 500);
  }
});

// Get user statistics (donations, campaigns supported, etc.)
app.get("/make-server-0f0fb175/user-stats", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get all donations by this user
    const allDonations = await kv.getByPrefix("donation:");
    const userDonations = allDonations.filter((d: any) => d.donorId === user.id);
    
    // Calculate total donated
    const totalDonated = userDonations.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
    
    // Count unique campaigns donated to
    const uniqueCampaigns = new Set(userDonations.map((d: any) => d.campaignId));
    const campaignsSupported = uniqueCampaigns.size;
    
    // Get volunteer commitments
    const allVolunteerCommitments = await kv.getByPrefix("volunteer:");
    const userVolunteerCommitments = allVolunteerCommitments.filter((v: any) => v.volunteerId === user.id);
    const hoursCommitted = userVolunteerCommitments.reduce((sum: number, v: any) => sum + (v.hours || 0), 0);
    
    return c.json({
      totalDonated,
      campaignsSupported,
      donationCount: userDonations.length,
      volunteerCommitments: userVolunteerCommitments.length,
      hoursCommitted,
    });
  } catch (error) {
    console.log("Error fetching user stats:", error);
    return c.json({ error: "Failed to fetch user statistics" }, 500);
  }
});

// Record a volunteer commitment
app.post("/make-server-0f0fb175/volunteer", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: "Unauthorized - please sign in to volunteer" }, 401);
    }

    const { campaignId, hours, message } = await c.req.json();
    
    // Get the campaign
    const campaign = await kv.get(campaignId);
    if (!campaign) {
      return c.json({ error: "Campaign not found" }, 404);
    }

    // Record the volunteer commitment
    const volunteerId = `volunteer:${crypto.randomUUID()}`;
    const volunteer = {
      id: volunteerId,
      campaignId,
      volunteerId: user.id,
      volunteerName: user.user_metadata?.name || 'Anonymous',
      hours: hours || 0,
      message: message || '',
      timestamp: new Date().toISOString(),
    };
    
    await kv.set(volunteerId, volunteer);

    return c.json({ success: true, volunteer });
  } catch (error) {
    console.log("Error recording volunteer commitment:", error);
    return c.json({ error: "Failed to record volunteer commitment" }, 500);
  }
});

Deno.serve(app.fetch);
