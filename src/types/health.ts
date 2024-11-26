export interface HealthGoal {
  id: string
  name: string
  icon: string
}

export interface PlanItem {
  id: string
  title: string
  content: string
  time: string
}

export interface DailyPlan {
  items: PlanItem[]
}

export interface Reminder {
  id: string
  planId: string
  goalName: string
  time: string
  content: string
  color: 'green' | 'blue' | 'orange'
}

export interface SavedPlan {
  id: string
  goal: string
  date: string
  items: PlanItem[]
}
