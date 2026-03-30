import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { InterviewSession, GapItem, QuestionItem, RoadmapDay } from "@/lib/store";

interface InterviewPrepPageProps {
  sessions: InterviewSession[];
  onAddSession: (session: InterviewSession) => void;
  userId: string;
}

function generateMockData(jobTitle: string, company: string): {
  gapAnalysis: GapItem[];
  readinessScore: number;
  questionBank: QuestionItem[];
  roadmap: RoadmapDay[];
} {
  return {
    gapAnalysis: [
      { skill: "React", have: "Intermediate", need: "Advanced", gapLevel: "Medium" },
      { skill: "System Design", have: "Basic", need: "Advanced", gapLevel: "High" },
      { skill: "TypeScript", have: "Advanced", need: "Advanced", gapLevel: "Low" },
      { skill: "CI/CD", have: "Basic", need: "Intermediate", gapLevel: "Medium" },
      { skill: "Testing", have: "Intermediate", need: "Advanced", gapLevel: "Medium" },
    ],
    readinessScore: Math.floor(Math.random() * 40) + 50,
    questionBank: [
      { question: `Tell me about a challenging project at your previous role.`, type: "behavioral", difficulty: "medium", tip: "Use the STAR method" },
      { question: `How would you design a scalable API for ${company}?`, type: "technical", difficulty: "hard", tip: "Start with requirements" },
      { question: `What would you do if a teammate disagreed with your approach?`, type: "situational", difficulty: "easy", tip: "Show empathy and collaboration" },
      { question: `Explain the difference between REST and GraphQL.`, type: "technical", difficulty: "medium", tip: "Cover trade-offs" },
      { question: `Why do you want to work at ${company}?`, type: "behavioral", difficulty: "easy", tip: "Be specific about company values" },
      { question: `How would you handle a production outage?`, type: "situational", difficulty: "hard", tip: "Show prioritization skills" },
    ],
    roadmap: [
      { day: 1, focusArea: "Company Research", tasks: [`Research ${company}'s products`, "Study their tech stack", "Read recent engineering blog posts"] },
      { day: 2, focusArea: "Technical Review", tasks: ["Review core concepts", `Practice ${jobTitle}-specific problems`, "Review system design patterns"] },
      { day: 3, focusArea: "Behavioral Prep", tasks: ["Prepare STAR stories", "Practice common behavioral questions", "Record yourself answering"] },
      { day: 4, focusArea: "Mock Interviews", tasks: ["Do 2 mock interviews", "Review feedback", "Refine weak areas"] },
      { day: 5, focusArea: "Final Review", tasks: ["Review all notes", "Prepare questions to ask", "Rest and stay confident"] },
    ],
  };
}

export default function InterviewPrepPage({ sessions, onAddSession, userId }: InterviewPrepPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jd, setJd] = useState("");
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [diffFilter, setDiffFilter] = useState<string>("all");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate AI call delay
    await new Promise((r) => setTimeout(r, 2000));

    const data = generateMockData(jobTitle, company);
    const session: InterviewSession = {
      id: crypto.randomUUID(),
      userId,
      jobTitle,
      company,
      jdText: jd,
      resumeText: resume,
      ...data,
      createdAt: new Date().toISOString(),
    };

    onAddSession(session);
    setActiveSession(session);
    setShowForm(false);
    setLoading(false);
    toast({ title: "Prep session ready!", description: `Analysis complete for ${company}` });
  };

  const gapColor: Record<string, string> = {
    Low: "text-success",
    Medium: "text-warning",
    High: "text-destructive",
  };

  const filteredQuestions = activeSession?.questionBank.filter((q) => {
    if (typeFilter !== "all" && q.type !== typeFilter) return false;
    if (diffFilter !== "all" && q.difficulty !== diffFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Interview Prep</h1>
          <p className="text-sm text-muted-foreground">AI-powered preparation for your dream role</p>
        </div>
        <Button onClick={() => { setShowForm(true); setActiveSession(null); }} className="gradient-primary text-primary-foreground">
          <BookOpen className="w-4 h-4 mr-2" /> New Prep Session
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Job Title</Label>
                <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required className="mt-1 bg-secondary/50" placeholder="e.g. Senior Frontend Developer" />
              </div>
              <div>
                <Label>Company Name</Label>
                <Input value={company} onChange={(e) => setCompany(e.target.value)} required className="mt-1 bg-secondary/50" placeholder="e.g. Google" />
              </div>
            </div>
            <div>
              <Label>Job Description</Label>
              <Textarea value={jd} onChange={(e) => setJd(e.target.value)} rows={4} className="mt-1 bg-secondary/50" placeholder="Paste the job description..." />
            </div>
            <div>
              <Label>Your Resume</Label>
              <Textarea value={resume} onChange={(e) => setResume(e.target.value)} rows={4} className="mt-1 bg-secondary/50" placeholder="Paste your resume content..." />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={loading} className="gradient-primary text-primary-foreground">
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? "Analyzing..." : "Generate Prep Plan"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </motion.div>
      )}

      {loading && (
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-card">
          <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin mb-4" />
          <p className="text-foreground font-medium">Analyzing your profile...</p>
          <p className="text-sm text-muted-foreground">This usually takes a few seconds</p>
        </div>
      )}

      {activeSession && !loading && (
        <Tabs defaultValue="gap" className="space-y-4">
          <TabsList className="bg-secondary">
            <TabsTrigger value="gap">Gap Analysis</TabsTrigger>
            <TabsTrigger value="readiness">Readiness</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="roadmap">Study Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="gap">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
              <h3 className="text-lg font-semibold mb-4">Skill Gap Analysis</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 text-muted-foreground font-medium">Skill</th>
                      <th className="text-left py-3 text-muted-foreground font-medium">You Have</th>
                      <th className="text-left py-3 text-muted-foreground font-medium">They Need</th>
                      <th className="text-left py-3 text-muted-foreground font-medium">Gap Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeSession.gapAnalysis.map((g) => (
                      <tr key={g.skill} className="border-b border-border/50">
                        <td className="py-3 font-medium text-foreground">{g.skill}</td>
                        <td className="py-3 text-muted-foreground">{g.have}</td>
                        <td className="py-3 text-muted-foreground">{g.need}</td>
                        <td className={`py-3 font-medium ${gapColor[g.gapLevel]}`}>{g.gapLevel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="readiness">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card flex flex-col items-center">
              <div className="relative w-40 h-40 mb-4">
                <svg width="160" height="160" className="transform -rotate-90">
                  <circle cx="80" cy="80" r="68" stroke="hsl(var(--border))" strokeWidth="8" fill="none" />
                  <circle
                    cx="80" cy="80" r="68"
                    stroke={activeSession.readinessScore >= 70 ? "hsl(var(--success))" : "hsl(var(--warning))"}
                    strokeWidth="8" fill="none" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 68}
                    strokeDashoffset={2 * Math.PI * 68 * (1 - activeSession.readinessScore / 100)}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-foreground">{activeSession.readinessScore}</span>
                  <span className="text-xs text-muted-foreground">Readiness</span>
                </div>
              </div>
              <p className="text-center text-muted-foreground max-w-md">
                You're {activeSession.readinessScore >= 70 ? "well prepared" : "getting there"}! Focus on the high-gap areas in your study plan.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="questions">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
              <div className="flex flex-wrap gap-2">
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-sm text-foreground">
                  <option value="all">All Types</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="technical">Technical</option>
                  <option value="situational">Situational</option>
                </select>
                <select value={diffFilter} onChange={(e) => setDiffFilter(e.target.value)} className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-sm text-foreground">
                  <option value="all">All Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="space-y-3">
                {filteredQuestions?.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-secondary/30 border border-border">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">{q.question}</p>
                      <div className="flex gap-1 shrink-0">
                        <Badge variant="outline" className="text-xs">{q.type}</Badge>
                        <Badge variant="outline" className={`text-xs ${q.difficulty === "hard" ? "border-destructive text-destructive" : q.difficulty === "medium" ? "border-warning text-warning" : "border-success text-success"}`}>
                          {q.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">💡 {q.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="roadmap">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
              <Accordion type="single" collapsible className="space-y-2">
                {activeSession.roadmap.map((day) => (
                  <AccordionItem key={day.day} value={`day-${day.day}`} className="border border-border rounded-xl px-4">
                    <AccordionTrigger className="text-sm font-medium">
                      Day {day.day}: {day.focusArea}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-1.5">
                        {day.tasks.map((task, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Past Sessions */}
      {sessions.length > 0 && !activeSession && !showForm && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Past Sessions</h2>
          <div className="space-y-2">
            {[...sessions].reverse().map((s) => (
              <div
                key={s.id}
                onClick={() => setActiveSession(s)}
                className="rounded-xl bg-card border border-border p-4 flex items-center justify-between hover:border-primary/30 transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-medium text-foreground text-sm">{s.company} — {s.jobTitle}</p>
                  <p className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleDateString()}</p>
                </div>
                <Badge className={s.readinessScore >= 70 ? "bg-success/20 text-success" : "bg-warning/20 text-warning"}>
                  {s.readinessScore}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {sessions.length === 0 && !showForm && !activeSession && (
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-card">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-1">No prep sessions yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Start your first AI-powered prep session</p>
          <Button onClick={() => setShowForm(true)} className="gradient-primary text-primary-foreground">
            <BookOpen className="w-4 h-4 mr-2" /> Start Prepping
          </Button>
        </div>
      )}
    </div>
  );
}
