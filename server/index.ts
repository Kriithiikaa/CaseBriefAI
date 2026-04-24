import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = 3001;

app.use(cors({ origin: "*" }));
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a professional social work case analyst. Given raw intake notes, extract and structure the information into a JSON object with exactly these fields:

{
  "case_summary": "2-3 sentence summary of the case",
  "client_info": {
    "name": "client name or null",
    "age": "age or null",
    "case_type": "type of case",
    "visit_type": "e.g. Initial Intake, Home Visit, Office Visit",
    "assigned_caseworker": "caseworker name or null",
    "visit_date": "date or null"
  },
  "risk_assessment": {
    "risk_level": "Low | Medium | High | Critical",
    "risk_reasoning": "one sentence explaining the risk level",
    "flags": ["list of specific risk flags found in the notes"]
  },
  "key_facts": ["list of 4-8 key facts extracted from the notes"],
  "missing_information": ["list of important missing details needed for a complete case file"],
  "caseworker_note": "formal professional case note written in third person, present tense, suitable for official records",
  "recommended_next_steps": ["list of 3-6 concrete action items"],
  "documentation_checklist": [
    { "requirement": "requirement name", "status": "Complete | Missing | Pending", "notes": "brief explanation" }
  ],
  "confidence_notes": ["any caveats about information that was unclear or inferred"]
}

Return ONLY valid JSON, no markdown, no explanation.`;

app.post("/api/analyze-case", async (req, res) => {
  const { caseType, rawNotes, urgencyLevel } = req.body;

  if (!rawNotes || rawNotes.trim().split(/\s+/).length < 50) {
    return res.status(400).json({ error: "Notes must be at least 50 words." });
  }

  const userMessage = `Case Type: ${caseType}\nUrgency Level: ${urgencyLevel}\n\nIntake Notes:\n${rawNotes}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    });

    const result = JSON.parse(completion.choices[0].message.content ?? "{}");
    res.json(result);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message ?? "Failed to generate case brief" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
