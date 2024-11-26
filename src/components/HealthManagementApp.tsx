'use client'

import React, { useState } from 'react'
import {
  Target,
  User,
  Plus,
  X,
  Edit,
  Clock,
  ListChecks,
  Save
} from 'lucide-react'
import type {
  HealthGoal,
  SavedPlan,
  Reminder,
  PlanItem,
  DailyPlan
} from '../types/health'

// 预设目标扩展
const DEFAULT_HEALTH_GOALS = [
  { id: 'weight_loss', name: '减肥', icon: '⚖️' },
  { id: 'muscle_gain', name: '增肌', icon: '💪' },
  { id: 'sleep_improve', name: '改善睡眠', icon: '😴' },
  { id: 'nutrition', name: '营养均衡', icon: '🥗' },
  { id: 'mental_health', name: '心理健康', icon: '🧘' },
  { id: 'endurance', name: '耐力训练', icon: '🏃' },
  { id: 'flexibility', name: '柔韧性', icon: '🤸' },
  { id: 'stress_relief', name: '减压', icon: '🎵' },
  { id: 'hydration', name: '补水', icon: '💧' },
  { id: 'meditation', name: '冥想', icon: '🌟' }
]

// 添加缺失的类型定义
type Reminder = {
  id: string
  planId?: string // 添加可选的planId
  goalName?: string // 添加可选的goalName
  time: string
  content: string
  color: string
}

const HealthManagementApp = () => {
  const [healthGoals, setHealthGoals] =
    useState<HealthGoal[]>(DEFAULT_HEALTH_GOALS)
  const [selectedGoal, setSelectedGoal] = useState<HealthGoal | null>(null)
  const [isGoalEditMode, setIsGoalEditMode] = useState(false)
  const [newGoalName, setNewGoalName] = useState('')
  const [newGoalIcon, setNewGoalIcon] = useState('')

  // 修改每日计划状态
  const [dailyPlan, setDailyPlan] = useState<DailyPlan>({
    items: []
  })

  // 新增计划项状态
  const [newPlanItem, setNewPlanItem] = useState<Partial<PlanItem>>({
    title: '',
    content: '',
    time: ''
  })

  // 保存的计划历史
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([])

  // 提醒状态
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: 1, time: '07:00', content: '早晨锻炼提醒', color: 'green' },
    { id: 2, time: '12:00', content: '午餐健康饮食提醒', color: 'blue' },
    { id: 3, time: '22:00', content: '准备睡眠提醒', color: 'orange' }
  ])
  const [newReminder, setNewReminder] = useState({ time: '', content: '' })

  // 添加计划项
  const addPlanItem = () => {
    if (newPlanItem.title && newPlanItem.content && newPlanItem.time) {
      const newItem: PlanItem = {
        id: String(Date.now()),
        title: newPlanItem.title,
        content: newPlanItem.content,
        time: newPlanItem.time
      }

      setDailyPlan((prev) => ({
        items: [...prev.items, newItem]
      }))

      setNewPlanItem({
        title: '',
        content: '',
        time: ''
      })
    }
  }

  // 删除计划项
  const removePlanItem = (itemId: string) => {
    setDailyPlan((prev) => ({
      items: prev.items.filter((item) => item.id !== itemId)
    }))
  }

  // 保存今日计划
  const saveDailyPlan = () => {
    if (selectedGoal && dailyPlan.items.length > 0) {
      const today = new Date()
      const dateStr = today.toISOString().split('T')[0]

      const newPlan: SavedPlan = {
        id: String(Date.now()),
        goal: selectedGoal.name,
        date: dateStr,
        items: [...dailyPlan.items]
      }

      setSavedPlans((prev) => [newPlan, ...prev])

      // 为每个计划项创建提醒
      const newReminders: Reminder[] = dailyPlan.items.map((item) => ({
        id: `${Date.now()}-${item.id}`,
        planId: newPlan.id,
        goalName: selectedGoal.name,
        time: item.time,
        content: `${item.title}: ${item.content}`,
        color: 'blue'
      }))

      setReminders((prev) => [...newReminders, ...prev])
      setDailyPlan({ items: [] })
    }
  }

  // 添加预设目标
  const addPresetGoal = () => {
    if (newGoalName.trim() && newGoalIcon.trim()) {
      const newGoal = {
        id: `preset-${String(Date.now())}`,
        name: newGoalName,
        icon: newGoalIcon
      }
      setHealthGoals([...healthGoals, newGoal])
      setNewGoalName('')
      setNewGoalIcon('')
    }
  }

  // 删除预设目标
  const removePresetGoal = (goalId: string) => {
    setHealthGoals(healthGoals.filter((goal) => goal.id !== goalId))
    if (selectedGoal?.id === goalId) {
      setSelectedGoal(null)
    }
  }

  // 删除提醒
  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id))
  }

  // 删除保存的计划
  const deleteSavedPlan = (planId: string) => {
    setSavedPlans(savedPlans.filter((plan) => plan.id !== planId))
  }

  // 添加提醒功能
  const addReminder = () => {
    if (newReminder.time && newReminder.content) {
      const reminder: Reminder = {
        id: String(Date.now()),
        time: newReminder.time,
        content: newReminder.content,
        color: 'blue',
        planId: undefined,
        goalName: undefined
      }
      setReminders((prev) => [...prev, reminder])
      setNewReminder({ time: '', content: '' })
    }
  }

  return (
    <div className='flex gap-6 w-full py-8'>
      {/* 左侧栏 - 设置和目标管理 */}
      <div className='w-1/3 space-y-6'>
        {/* 用户信息 */}
        <div className='bg-white p-4 rounded-lg shadow-md'>
          <div className='flex items-center space-x-4'>
            <User className='w-12 h-12 text-blue-600' />
            <div>
              <h2 className='text-2xl font-bold text-gray-800'>健康管理中心</h2>
              <p className='text-sm text-gray-500'>个性化健康追踪</p>
            </div>
          </div>
        </div>

        {/* 健康目标管理区域 */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-xl font-semibold flex items-center'>
              <Target className='w-6 h-6 mr-3 text-blue-600' />
              健康目标设置
            </h3>
            <button
              onClick={() => setIsGoalEditMode(!isGoalEditMode)}
              className={`p-2 rounded-md ${
                isGoalEditMode
                  ? 'bg-green-100 text-green-600'
                  : 'bg-blue-100 text-blue-600'
              }`}
            >
              <Edit className='w-6 h-6' />
            </button>
          </div>

          {/* 目标添加区域 */}
          {isGoalEditMode && (
            <div className='mb-4 space-y-2'>
              <input
                type='text'
                placeholder='目标名称'
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                className='w-full p-2 border rounded-md'
              />
              <div className='flex space-x-2'>
                <input
                  type='text'
                  placeholder='图标(emoji)'
                  value={newGoalIcon}
                  onChange={(e) => setNewGoalIcon(e.target.value)}
                  className='w-20 p-2 border rounded-md'
                />
                <button
                  onClick={addPresetGoal}
                  className='bg-green-500 text-white p-2 rounded-md hover:bg-green-600 flex-grow'
                >
                  <Plus className='w-5 h-5 mx-auto' />
                </button>
              </div>
            </div>
          )}

          {/* 目标网格 */}
          <div className='grid grid-cols-2 gap-3'>
            {healthGoals.map((goal) => (
              <div key={goal.id} className='relative'>
                <button
                  onClick={() => setSelectedGoal(goal)}
                  className={`w-full p-3 rounded-lg border-2 text-center relative ${
                    selectedGoal?.id === goal.id
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className='text-2xl mb-2'>{goal.icon}</div>
                  <div className='text-sm'>{goal.name}</div>
                </button>

                {isGoalEditMode && (
                  <button
                    onClick={() => removePresetGoal(goal.id)}
                    className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center'
                  >
                    <X className='w-4 h-4' />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右侧栏 - 计划和提醒 */}
      <div className='flex-1 space-y-6'>
        {/* 每日健康计划 */}
        {selectedGoal ? (
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-xl font-semibold mb-4 flex items-center'>
              <ListChecks className='w-6 h-6 mr-3 text-green-600' />
              {selectedGoal.name}日计划
            </h3>

            {/* 添加计划项表单 */}
            <div className='mb-4 space-y-3 p-4 bg-gray-50 rounded-lg'>
              <div className='grid grid-cols-2 gap-4'>
                <input
                  type='text'
                  placeholder='计划项标题'
                  value={newPlanItem.title}
                  onChange={(e) =>
                    setNewPlanItem((prev) => ({
                      ...prev,
                      title: e.target.value
                    }))
                  }
                  className='w-full p-2 border rounded-md'
                />
                <input
                  type='time'
                  value={newPlanItem.time}
                  onChange={(e) =>
                    setNewPlanItem((prev) => ({
                      ...prev,
                      time: e.target.value
                    }))
                  }
                  className='w-full p-2 border rounded-md'
                />
              </div>
              <div className='flex space-x-2'>
                <input
                  type='text'
                  placeholder='计划内容'
                  value={newPlanItem.content}
                  onChange={(e) =>
                    setNewPlanItem((prev) => ({
                      ...prev,
                      content: e.target.value
                    }))
                  }
                  className='flex-grow p-2 border rounded-md'
                />
                <button
                  onClick={addPlanItem}
                  className='bg-green-500 text-white px-4 rounded-md hover:bg-green-600'
                >
                  <Plus className='w-5 h-5' />
                </button>
              </div>
            </div>

            {/* 计划项列表 */}
            <div className='space-y-2'>
              {dailyPlan.items.map((item) => (
                <div
                  key={item.id}
                  className='flex justify-between items-center p-3 bg-gray-50 rounded-md'
                >
                  <div className='flex-1 grid grid-cols-3 gap-4'>
                    <span className='font-medium'>{item.title}</span>
                    <span>{item.content}</span>
                    <span className='text-gray-500'>{item.time}</span>
                  </div>
                  <button
                    onClick={() => removePlanItem(item.id)}
                    className='text-red-500 hover:text-red-700 ml-2'
                  >
                    <X className='w-5 h-5' />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={saveDailyPlan}
              disabled={dailyPlan.items.length === 0}
              className='mt-4 w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <Save className='w-5 h-5 mr-2' />
              保存今日计划
            </button>
          </div>
        ) : (
          <div className='bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 text-center text-gray-500'>
            请从左侧选择一个健康目标
          </div>
        )}

        {/* 每日提醒管理 */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h3 className='text-xl font-semibold mb-4 flex items-center'>
            <Clock className='w-6 h-6 mr-3 text-orange-600' />
            计划提醒
          </h3>

          {/* 按计划分组显示提醒 */}
          <div className='space-y-4'>
            {savedPlans.map((plan) => {
              const planReminders = reminders.filter(
                (r) => r.planId === plan.id
              )
              if (planReminders.length === 0) return null

              return (
                <div key={plan.id} className='border rounded-lg p-4'>
                  <div className='flex items-center justify-between mb-2'>
                    <h4 className='font-medium text-lg text-gray-700'>
                      {plan.goal} - {plan.date}
                    </h4>
                  </div>
                  <div className='space-y-2'>
                    {planReminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className='flex justify-between items-center p-3 bg-blue-50 rounded-md'
                      >
                        <div className='flex items-center'>
                          <div className='w-3 h-3 rounded-full mr-3 bg-blue-500'></div>
                          <span className='font-medium mr-4'>
                            {reminder.time}
                          </span>
                          <span>{reminder.content}</span>
                        </div>
                        <button
                          onClick={() => deleteReminder(reminder.id)}
                          className='text-red-500 hover:text-red-700'
                        >
                          <X className='w-5 h-5' />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 保存的计划历史 */}
        {savedPlans.length > 0 && (
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-xl font-semibold mb-4 flex items-center'>
              <ListChecks className='w-6 h-6 mr-3 text-purple-600' />
              计划历史
            </h3>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      日期
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      目标
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      运动计划
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {savedPlans.map((plan) => (
                    <tr key={plan.id} className='hover:bg-gray-50'>
                      <td className='px-4 py-3 text-sm text-gray-500'>
                        {plan.date}
                      </td>
                      <td className='px-4 py-3 text-sm font-medium text-gray-900'>
                        {plan.goal}
                      </td>
                      <td className='px-4 py-3 text-sm text-gray-500'>
                        {plan.items.length > 0 ? plan.items[0].title : ''}
                      </td>
                      <td className='px-4 py-3 text-sm text-gray-500'>
                        <button
                          onClick={() => deleteSavedPlan(plan.id)}
                          className='text-red-600 hover:text-red-900'
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HealthManagementApp
