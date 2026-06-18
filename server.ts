import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API routes go here FIRST
// Helper to construct highly accurate, natural fallback answers if the external Gemini API is temporarily unavailable/exhausted
function getLocalFallbackResponse(message: string): string {
  const lowercase = message.toLowerCase().trim();
  
  if (lowercase.includes("salon") || lowercase.includes("hair") || lowercase.includes("facial") || lowercase.includes("nail") || lowercase.includes("manicure") || lowercase.includes("balayage") || lowercase.includes("cut")) {
    return `👋 **BookEase Salon & Beauty Services & Pricing**:
- **Precision Haircut & Styling** — **$65** (45 mins)
  *Custom senior-stylist haircut including premium deep wash, massage, and blow-dry.*
- **Signature Facial Treatment** — **$85** (60 mins)
  *An invigorating deep cleanse, scrub, hydration mask, and facial acupressure massage.*
- **Balayage Hair Coloring** — **$180** (120 mins)
  *Hand-painted premium French highlights with protective bond-building treatment included.*
- **Luxury Gel Manicure** — **$45** (45 mins)
  *Full nail care, cuticle care, custom gel polish, and calming lavender hand massage.*

**Specialists available:**
- **Sarah Jenkins** (Senior Hair Stylist, Salon) – 09:00 - 18:00
- **Antoine Rossi** (Master Aesthetician) – 10:00 - 19:00 (Facials)
- **Chloe Thompson** (Gel Extensions & Nail Art) – 09:00 - 17:00 (Nails)

*You can lock in your time with any of these professionals on our live **Booking** page!*`;
  }

  if (lowercase.includes("gym") || lowercase.includes("fit") || lowercase.includes("workout") || lowercase.includes("train") || lowercase.includes("yoga") || lowercase.includes("hiit") || lowercase.includes("athletic")) {
    return `👋 **BookEase Fitness & Personal Training & Pricing**:
- **1-on-1 Personal Training** — **$90** (60 mins)
  *Custom strength, conditioning, and posture session tailored to your dynamic goals.*
- **Vinyasa Yoga Guided Flow** — **$60** (60 mins)
  *Individualized yoga practice targeting core strength, alignment, and breath-control.*
- **HIIT & Endurance Training** — **$75** (45 mins)
  *High-intensity interval program designed to spike your metabolism and build stamina.*

**Specialists available:**
- **Coach Jack Harrison** (Strength, Athletic Prep) – 06:00 - 15:00
- **Maria Sanchez** (Yoga & Alignment) – 08:00 - 17:00

*Head over to the **Booking** tab in our navbar to select your slot!*`;
  }

  if (lowercase.includes("tutor") || lowercase.includes("math") || lowercase.includes("calculus") || lowercase.includes("sat") || lowercase.includes("chem") || lowercase.includes("academic") || lowercase.includes("act") || lowercase.includes("study")) {
    return `👋 **BookEase Academic Tutoring & Pricing**:
- **Advanced Calculus Coaching** — **$55** (60 mins)
  *Visual breakdowns of limits, derivatives, integration, and physics applications.*
- **SAT / ACT Prep Session** — **$80** (90 mins)
  *Strategic analysis of test layouts, math shortcuts, and critical reading.*
- **High School Chemistry Lab Review** — **$50** (60 mins)
  *Stoichiometry, molecular geometry, and thermodynamic calculation breakdowns.*

**Specialists available:**
- **Dr. Alex Chen** (Math, Calculus, SAT) – 13:00 - 20:00
- **Prof. Clara Sterling** (Chemistry) – 11:00 - 19:00

*Book are private coaching lesson directly inside the **Booking** interface!*`;
  }

  if (lowercase.includes("doctor") || lowercase.includes("clinic") || lowercase.includes("medical") || lowercase.includes("exam") || lowercase.includes("check") || lowercase.includes("skin") || lowercase.includes("dermatology") || lowercase.includes("pediatric")) {
    return `👋 **BookEase Medical & Clinical Services & Pricing**:
- **General Medical Examination** — **$120** (30 mins)
  *Comprehensive physical evaluation, vital signs screening, and lifestyle consulting.*
- **Pediatric Care Consultation** — **$110** (30 mins)
  *Development surveillance, immunization check, and gentle clinical review.*
- **Dermatological Skin Inspection** — **$135** (40 mins)
  *Specialized diagnostic check for lesions, eczema, mole mapping, and acne.*

**Specialists available:**
- **Dr. Robert Carter** (Internal Medicine) – 09:00 - 16:00
- **Dr. Emily Vance** (Dermatology, Pediatrics) – 08:30 - 15:30

*Schedule an instant checkup appointment inside the **Booking** panel.*`;
  }

  if (lowercase.includes("consult") || lowercase.includes("saas") || lowercase.includes("tax") || lowercase.includes("architecture") || lowercase.includes("finance") || lowercase.includes("cto") || lowercase.includes("cloud")) {
    return `👋 **BookEase SaaS & Financial Consulting & Pricing**:
- **Tech Architecture Review** — **$250** (60 mins)
  *Review of Cloud system infrastructure, bottlenecks, and security design.*
- **Tax Planning & Business Setup** — **$180** (60 mins)
  *Asset structure advice, state filing optimization, and deductions audit.*
- **Fractional CTO Consultation** — **$320** (90 mins)
  *Strategic roadmap audit, developer resource planning, and product delivery.*

**Specialists available:**
- **Marcus Vance** (Principal Cloud Architect) – 10:00 - 18:00
- **David Kojo** (Chartered Startup CPA) – 09:00 - 17:00

*Book are professional consulting review directly on our **Booking** screen!*`;
  }

  if (lowercase.includes("coach") || lowercase.includes("life") || lowercase.includes("career") || lowercase.includes("transition") || lowercase.includes("mindset") || lowercase.includes("leadership")) {
    return `👋 **BookEase Life & Career Coaching & Pricing**:
- **Executive Leadership Strategy** — **$150** (60 mins)
  *Conflict resolution, corporate team alignment, and performance psychology.*
- **Career Transition Roadmap** — **$110** (60 mins)
  *Resume reframing, high-leverage interview roleplays, and negotiation.*
- **Life & Mindset Calibration** — **$95** (60 mins)
  *Goal mapping, self-advocacy drills, positive habit loops, and productivity.*

**Specialists available:**
- **Coach Elena Rostova** (Peak Mindsets) – 09:00 - 17:00
- **Coach Tyler Smith** (Career Strategist) – 10:00 - 18:00

*Unlock your customized peak training by booking onto the scheduler!*`;
  }

  if (lowercase.includes("price") || lowercase.includes("pricing") || lowercase.includes("how much") || lowercase.includes("cost") || lowercase.includes("fee") || lowercase.includes("rate") || lowercase.includes("$")) {
    return `👋 **BookEase Pricing Overview**:
Here is a quick overview of our popular services. You can view all descriptions on our **Booking** page:
- **Salon**: Precision Haircut ($65) | Signature Facial ($85) | Balayage highlights ($180) | Gel Manicure ($45)
- **Fitness & Training**: Personal Training ($90) | Yoga ($60) | HIIT session ($75)
- **Tutoring**: Calculus coaching ($55) | SAT preparation ($80) | Chemistry ($50)
- **Medical & Doctors**: General Exam ($120) | Pediatrics ($110) | Skin Inspection ($135)
- **Consulting**: Tech Architecture ($250) | Business Tax Planning ($180) | Fractional CTO ($320)
- **Coaching**: Executive Leadership ($150) | Career Transition ($110) | Mindset Calibration ($95)

*Simply click 'Booking' in the top header to choose your preferred service, length, and staff.*`;
  }

  if (lowercase.includes("availab") || lowercase.includes("slot") || lowercase.includes("schedule") || lowercase.includes("when") || lowercase.includes("time") || lowercase.includes("hour")) {
    return `📅 **BookEase Scheduling and Slots Availability**:
- All operations run standard business hours (generally **09:00 to 18:00**) with early options for Fitness with **Jack Harrison** starting at **06:00**, and evening/night options for Academic Tutoring with **Dr. Alex Chen** up to **20:00**.
- You can filter and adjust custom appointment durations (**30, 60, or 90 minutes**) inside our dynamic booking platform. Time slots list automatically update instantly!

*Simply select your preferred slot dynamically under the **Booking** tab in our header!*`;
  }

  // General default fallback explanation
  return `👋 Greetings! I am the **BookEase Companion** support bot. 

Currently, our primary AI cloud servers are experiencing transient high demand, so I've stepped in to assist you instantly. I can answer inquiries regarding:
1. 💇‍♀️ **Beauty & Hair Salon** services and pricing (cuts, colors, facials, gel manicure).
2. 🏋️‍♂️ **Fitness Gym Training** programs (1-on-1, yoga, HIIT).
3. 📐 **Academic Tutoring** (calculus, SAT/ACT prep, chemistry).
4. 🩺 **Medical Clinic** appointments (exams, pediatrics, skin).
5. 💼 **Consulting** packages (Tech reviews, CPAs, Fractional CTOs).
6. 📈 **Life & Career Coaching** sessions (leadership, interviews, calibration).

What information or pricing can I help you find? Try typing **"salon prices"** or **"coaching options"**!`;
}

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY environment variable is missing on the server. Please check Settings > Secrets in AI Studio." 
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const systemInstruction = `You are "BookEase Companion", an intelligent AI Assistant for BookEase — a top-tier appointment booking SaaS platform that serves 6 industries:
1. Beauty & Hair Salon ('salon')
2. Fitness & Gym Training ('fitness')
3. Academic Tutoring ('tutor')
4. Medical Clinics ('doctor')
5. SaaS & Financial Consulting ('consultant')
6. Life & Career Coaching ('coach')

Below is the master info about all services, staff, and pricing available on the platform:

=== INDUSTRIES & SERVICES ===
1. Beauty & Hair Salon ('salon'):
   - "srv_salon_1": Precision Haircut & Styling - $65 (45 min). Description: Custom senior-stylist haircut including premium deep wash, massage, and blow-dry styling.
   - "srv_salon_2": Signature Facial Treatment - $85 (60 min). Description: An invigorating deep cleanse, scrub, hydration mask, and facial acupressure massage.
   - "srv_salon_3": Balayage Hair Coloring - $180 (120 min). Description: Hand-painted premium French highlights with protective bond-building treatment included.
   - "srv_salon_4": Luxury Gel Manicure - $45 (45 min). Description: Full nail care, cuticle care, custom gel polish, and calming lavender hand massage.

2. Fitness & Gym Training ('fitness'):
   - "srv_fit_1": 1-on-1 Personal Training - $90 (60 min). Description: Custom strength, conditioning, and posture session tailored to your dynamic goals.
   - "srv_fit_2": Vinyasa Yoga Guided Flow - $60 (60 min). Description: Individualized yoga practice targeting core strength, alignment, breath-control and flexibility.
   - "srv_fit_3": HIIT & Endurance Training - $75 (45 min). Description: High-intensity interval program designed to spike your metabolism and build stamina.

3. Academic Tutoring ('tutor'):
   - "srv_tut_1": Advanced Calculus Coaching - $55 (60 min). Description: Visual breakdowns of limits, derivatives, integration, and physics-based applications.
   - "srv_tut_2": SAT / ACT Prep Session - $80 (90 min). Description: Strategic analysis of test layouts, math shortcuts, critical reading, and essay-scoring.
   - "srv_tut_3": High School Chemistry Lab Review - $50 (60 min). Description: Stoichiometry, molecular geometry, and thermodynamic calculation breakdowns.

4. Medical Clinics ('doctor'):
   - "srv_doc_1": General Medical Examination - $120 (30 min). Description: Comprehensive physical evaluation, vital signs screening, and generic lifestyle consult.
   - "srv_doc_2": Pediatric Care Consultation - $110 (30 min). Description: Caring development surveillance, immunization schedule checks, and gentle clinical review.
   - "srv_doc_3": Dermatological Skin Inspection - $135 (40 min). Description: Specialized diagnostic checkout for lesions, eczema, mole mapping, and acne therapies.

5. SaaS & Financial Consulting ('consultant'):
   - "srv_con_1": Tech Architecture Review - $250 (60 min). Description: Review of Cloud system infrastructure, server bottlenecks, security design, and database schemas.
   - "srv_con_2": Tax Planning & Business Setup - $180 (60 min). Description: Asset structure advice, state filing optimization, deductions audit, and ledger planning.
   - "srv_con_3": Fractional CTO Consultation - $320 (90 min). Description: Strategic roadmap audit, developer resource planning, and product delivery management.

6. Life & Career Coaching ('coach'):
   - "srv_ch_1": Executive Leadership Strategy - $150 (60 min). Description: Conflict resolution, corporate team alignment, and performance psychology for C-Suite leads.
   - "srv_ch_2": Career Transition Roadmap - $110 (60 min). Description: Resume reframing, high-leverage interview roleplays, and negotiation frameworks.
   - "srv_ch_3": Life & Mindset Calibration - $95 (60 min). Description: Goal mapping, self-advocacy drills, positive habit loops, and productivity workflows.

=== STAFF MEMBERS ===
- Sarah Jenkins (Senior Hair Stylist, Salon, rating 4.9). Specialty: Balayage & Modern Cuts. Services: Precision Haircut & Styling, Balayage Hand-painted highlights. Working hours: 09:00 - 18:00.
- Antoine Rossi (Master Aesthetician, Salon, rating 4.8). Specialty: Hydra-Facials & Skin Therapy. Services: Signature Facial Treatment. Working hours: 10:00 - 19:00.
- Chloe Thompson (Nail Artist, Salon, rating 4.9). Specialty: Gel Extensions & Nail Art. Services: Luxury Gel Manicure, Precision Haircut & Styling. Working hours: 09:00 - 17:00.
- Coach Jack Harrison (Strength Guide, Fitness, rating 4.9). Specialty: Powerlifting & Athletic Prep. Services: 1-on-1 Personal Training, HIIT & Endurance Training. Working hours: 06:05 - 15:00.
- Maria Sanchez (Yoga Instructor, Fitness, rating 4.9). Specialty: Vinyasa Flow & Pranayama. Services: Vinyasa Yoga Guided Flow. Working hours: 08:00 - 17:00.
- Dr. Alex Chen (Math Specialist, Tutor, rating 5.0). Specialty: Calculus, Algebra, SAT Math. Services: Advanced Calculus Coaching, SAT / ACT Prep. Working hours: 13:00 - 20:00.
- Prof. Clara Sterling (Chemistry Educator, Tutor, rating 4.7). Specialty: Analytical Chemistry & Basics. Services: High School Chem, SAT Prep. Working hours: 11:00 - 19:00.
- Dr. Robert Carter (General Physician, Doctor, rating 4.8). Specialty: Internal Medicine. Services: General Medical Exam. Working hours: 09:00 - 16:00.
- Dr. Emily Vance (Dermatology Expert, Doctor, rating 4.9). Specialty: Mole Diagnosis. Services: Dermatological General Medical, Pediatric Care. Working hours: 08:30 - 15:30.
- Marcus Vance (Principal Cloud Architect, Consultant, rating 4.9). Specialty: Google Cloud, Firebase, React. Services: Tech Architecture Review, Fractional CTO. Working hours: 10:00 - 18:00.
- David Kojo (Chartered Corporate CPA, Consultant, rating 4.8). Specialty: Startups, IRS. Services: Tax Planning. Working hours: 09:00 - 17:00.
- Coach Elena Rostova (Peak Bio-Hacker, Coach, rating 4.9). Specialty: VC Mindsets. Services: Executive Leadership, Life Calibration. Working hours: 09:00 - 17:00.
- Coach Tyler Smith (Career Strategist, Coach, rating 4.6). Specialty: FAANG Interview Placement. Services: Career Transition Roadmap, Life Mindset Calibration. Working hours: 10:00 - 18:00.

=== BOOKING STEPS AND AVAILABILITY ===
- Customers can make a real booking by clicking the 'Booking' tab in the app's top navigation bar.
- Inside the Booking system, they choose their Industry, Select a Service, Select a Staff Member, Choose an Available Date, and select a Time Slot.
- They then fill in their Name, Email, Phone, and Notes, and click 'Confirm Appointment' to register their slot immediately.
- If a user asks about slot availability, inform them they can check real-time availability dynamically inside the Interactive Scheduler by clicking on 'Booking' in the navbar. Give friendly suggestions of suitable dates or times depending on working hours (e.g. Jack Harrison is an early bird from 06:00 to 15:00, while Alex Chen works later from 13:00 to 20:00).

=== YOUR STYLE & RULES ===
- Be highly helpful, courteous, professional, and friendly.
- Format responses in clean Markdown. Bold key terms or services.
- Never make up fake services or pricing that aren't defined above.
- Ensure the user gets direct answers regarding pricing (e.g. Precision Haircut & Styling is $65, Tech Architecture Review is $250).
- Since this is a SaaS booking application, encourage them to lock in their schedule by using the booking tool.
`;

    const formattedHistory = (history || []).map((h: any) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }]
    }));

    const contents = [
      ...formattedHistory,
      { role: "user", parts: [{ text: message }] }
    ];

    // Attempt sequential models using officially supported non-deprecated models
    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
    let responseText = "";
    let success = false;
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`[AI Chat] Attempting generation with model: ${modelName}`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
        
        if (response && response.text) {
          responseText = response.text;
          success = true;
          console.log(`[AI Chat] Successfully generated with model: ${modelName}`);
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[AI Chat] Model ${modelName} failed or returned error:`, err?.message || err);
        // Continue to check the next model
      }
    }

    if (success) {
      return res.json({ text: responseText });
    }

    // All model requests failed (likely a temporary upstream 503 error)
    console.warn("[AI Chat] All model options exhausted or 503 limit hit. Invoking intelligent local rule-based response.", lastError);
    const localFallback = getLocalFallbackResponse(message);
    return res.json({ text: localFallback });

  } catch (error: any) {
    console.error("Critical error in AI Chat API routing:", error);
    // Even if something completely unexpected crashes the outer try, we return the fallback safely!
    try {
      const localFallback = getLocalFallbackResponse(req.body.message || "");
      return res.json({ text: localFallback });
    } catch (innerErr) {
      return res.status(500).json({ error: "An unexpected service error occurred." });
    }
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
