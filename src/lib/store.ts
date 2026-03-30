// Local store for PrepIQ demo data (localStorage-based)
import { useState, useEffect, useCallback } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CareerProfile {
  userId: string;
  fullName: string;
  email: string;
  targetRoles: string[];
  dreamCompanies: string[];
  degree: string;
  institution: string;
  graduationYear: string;
  coursework: string;
  certifications: string[];
  workHistory: WorkEntry[];
  technicalSkills: SkillEntry[];
  softSkills: string[];
  interviewFears: string[];
  fearNotes: string;
  onboardingComplete: boolean;
}

export interface WorkEntry {
  id: string;
  jobTitle: string;
  company: string;
  from: string;
  to: string;
  responsibilities: string;
}

export interface SkillEntry {
  name: string;
  proficiency: "Beginner" | "Intermediate" | "Expert";
}

export interface InterviewSession {
  id: string;
  userId: string;
  jobTitle: string;
  company: string;
  jdText: string;
  resumeText: string;
  gapAnalysis: GapItem[];
  readinessScore: number;
  questionBank: QuestionItem[];
  roadmap: RoadmapDay[];
  createdAt: string;
}

export interface GapItem {
  skill: string;
  have: string;
  need: string;
  gapLevel: "Low" | "Medium" | "High";
}

export interface QuestionItem {
  question: string;
  type: "behavioral" | "technical" | "situational";
  difficulty: "easy" | "medium" | "hard";
  tip: string;
}

export interface RoadmapDay {
  day: number;
  focusArea: string;
  tasks: string[];
}

export interface MockAttempt {
  id: string;
  sessionId: string;
  userId: string;
  question: string;
  userAnswer: string;
  aiScore: number;
  aiFeedback: {
    strengths: string[];
    missing: string[];
    modelAnswer: string;
    oneLineVerdict: string;
  };
  createdAt: string;
}

export interface JobApplication {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  jobUrl: string;
  dateApplied: string;
  status: "Applied" | "Screening" | "Interview" | "Offer" | "Rejected" | "Ghosted";
  salaryRange: string;
  location: string;
  notes: string;
  resumeUsed: string;
  contactPerson: string;
  nextAction: string;
  nextActionDate: string;
  linkedPrepSessionId: string | null;
  createdAt: string;
  updatedAt: string;
}

function getStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`prepiq_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStore<T>(key: string, value: T) {
  localStorage.setItem(`prepiq_${key}`, JSON.stringify(value));
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => getStore("user", null));

  const login = useCallback((email: string, _password: string) => {
    const users: User[] = getStore("users", []);
    const found = users.find((u) => u.email === email);
    if (found) {
      setUser(found);
      setStore("user", found);
      return { success: true, user: found };
    }
    return { success: false, error: "Invalid credentials" };
  }, []);

  const signup = useCallback((name: string, email: string, _password: string) => {
    const users: User[] = getStore("users", []);
    if (users.find((u) => u.email === email)) {
      return { success: false, error: "Email already exists" };
    }
    const newUser: User = { id: crypto.randomUUID(), name, email };
    users.push(newUser);
    setStore("users", users);
    setStore("user", newUser);
    setUser(newUser);
    return { success: true, user: newUser };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("prepiq_user");
  }, []);

  return { user, login, signup, logout };
}

export function useCareerProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<CareerProfile | null>(null);

  useEffect(() => {
    if (!userId) return;
    const profiles: CareerProfile[] = getStore("profiles", []);
    setProfile(profiles.find((p) => p.userId === userId) || null);
  }, [userId]);

  const saveProfile = useCallback(
    (data: CareerProfile) => {
      const profiles: CareerProfile[] = getStore("profiles", []);
      const idx = profiles.findIndex((p) => p.userId === data.userId);
      if (idx >= 0) profiles[idx] = data;
      else profiles.push(data);
      setStore("profiles", profiles);
      setProfile(data);
    },
    []
  );

  return { profile, saveProfile };
}

export function useInterviewSessions(userId: string | undefined) {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);

  useEffect(() => {
    if (!userId) return;
    const all: InterviewSession[] = getStore("sessions", []);
    setSessions(all.filter((s) => s.userId === userId));
  }, [userId]);

  const addSession = useCallback(
    (session: InterviewSession) => {
      const all: InterviewSession[] = getStore("sessions", []);
      all.push(session);
      setStore("sessions", all);
      setSessions((prev) => [...prev, session]);
    },
    []
  );

  return { sessions, addSession };
}

export function useMockAttempts(userId: string | undefined) {
  const [attempts, setAttempts] = useState<MockAttempt[]>([]);

  useEffect(() => {
    if (!userId) return;
    const all: MockAttempt[] = getStore("mocks", []);
    setAttempts(all.filter((a) => a.userId === userId));
  }, [userId]);

  const addAttempt = useCallback(
    (attempt: MockAttempt) => {
      const all: MockAttempt[] = getStore("mocks", []);
      all.push(attempt);
      setStore("mocks", all);
      setAttempts((prev) => [...prev, attempt]);
    },
    []
  );

  return { attempts, addAttempt };
}

export function useJobApplications(userId: string | undefined) {
  const [jobs, setJobs] = useState<JobApplication[]>([]);

  useEffect(() => {
    if (!userId) return;
    const all: JobApplication[] = getStore("jobs", []);
    setJobs(all.filter((j) => j.userId === userId));
  }, [userId]);

  const addJob = useCallback(
    (job: JobApplication) => {
      const all: JobApplication[] = getStore("jobs", []);
      all.push(job);
      setStore("jobs", all);
      setJobs((prev) => [...prev, job]);
    },
    []
  );

  const updateJob = useCallback(
    (id: string, updates: Partial<JobApplication>) => {
      const all: JobApplication[] = getStore("jobs", []);
      const idx = all.findIndex((j) => j.id === id);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
        setStore("jobs", all);
        setJobs((prev) =>
          prev.map((j) => (j.id === id ? { ...j, ...updates, updatedAt: new Date().toISOString() } : j))
        );
      }
    },
    []
  );

  return { jobs, addJob, updateJob };
}
