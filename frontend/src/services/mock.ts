import type { GraphData, SubjectStat, Topic, Cluster } from '../types/topic'

const subjectColors: Record<string, string> = {
  Science: '#4CAF50',
  Mathematics: '#2196F3',
  English: '#FF9800',
  History: '#9C27B0',
  'Personal & Social Development': '#E91E63',
  'Life Skills': '#00BCD4',
  Computing: '#607D8B',
  'Learning to Learn': '#795548',
}

const subjects = Object.keys(subjectColors)

const sampleTopics: Record<string, string[]> = {
  Science: ['Forces and Motion', 'Living Things', 'Materials', 'Earth and Space', 'Light and Sound', 'Electricity', 'Ecosystems', 'Chemical Reactions'],
  Mathematics: ['Number Bonds', 'Addition and Subtraction', 'Multiplication', 'Fractions', 'Geometry', 'Algebra Basics', 'Statistics', 'Probability'],
  English: ['Building Sentences', 'Phonics', 'Reading Comprehension', 'Creative Writing', 'Grammar Rules', 'Vocabulary', 'Poetry', 'Persuasive Writing'],
  History: ['Ancient Egypt', 'Roman Empire', 'Medieval Period', 'World War I', 'World War II', 'Industrial Revolution', 'Cold War', 'Modern History'],
  'Personal & Social Development': ['Emotions', 'Teamwork', 'Conflict Resolution', 'Self-Awareness', 'Empathy', 'Communication'],
  'Life Skills': ['Cooking Basics', 'Time Management', 'Budgeting', 'First Aid', 'Digital Literacy'],
  Computing: ['Algorithms', 'Programming Basics', 'Data Structures', 'Web Development', 'Databases', 'Networking'],
  'Learning to Learn': ['Note Taking', 'Study Techniques', 'Critical Thinking', 'Problem Solving', 'Memory Strategies'],
}

const descriptions: Record<string, string> = {
  'Forces and Motion': 'Understand how objects move and the forces that act upon them. Explore push, pull, gravity, friction, and how forces change speed and direction.',
  'Living Things': 'Explore the characteristics of living organisms, their habitats, life cycles, and how they depend on each other.',
  'Number Bonds': 'Learn the pairs of numbers that combine to make a given total. Build fluency in addition and subtraction facts.',
  'Building Sentences': 'Learn to construct clear, grammatically correct sentences using subjects, verbs, and objects.',
  'Ancient Egypt': 'Explore the civilization of ancient Egypt: pharaohs, pyramids, hieroglyphics, daily life, and lasting legacy.',
  'Algorithms': 'Understand step-by-step procedures for solving problems. Learn to design, represent, and evaluate algorithms.',
  'Emotions': 'Recognise, name, and manage a range of emotions. Understand how feelings affect behaviour and relationships.',
  'Critical Thinking': 'Analyse arguments, evaluate evidence, identify bias, and form well-reasoned conclusions.',
}

const evidenceMap: Record<string, string[]> = {
  'Forces and Motion': ['Identify different types of forces', 'Predict effect of forces on objects', 'Design a fair test to investigate friction'],
  'Number Bonds': ['Recall number bonds to 10 and 20 fluently', 'Use bonds to solve missing number problems'],
  'Building Sentences': ['Write sentences with correct capitalisation and punctuation', 'Vary sentence structure for effect'],
}

const assessmentMap: Record<string, string> = {
  'Forces and Motion': 'Ask the student to draw a diagram showing all the forces acting on a ball rolling down a hill.',
  'Number Bonds': 'Present missing number problems: 7 + ? = 10, ? + 3 = 8.',
  'Building Sentences': 'Give the student two simple sentences and ask them to combine into one compound sentence.',
}

/** 生成 mock 图数据（80 节点 + 边） */
export function generateMockGraph(): GraphData {
  const nodes: GraphData['nodes'] = []
  const edges: GraphData['edges'] = []

  subjects.forEach((subject) => {
    const topics = sampleTopics[subject] || []
    topics.forEach((topic, i) => {
      const id = `mt_${subject.slice(0, 3).toLowerCase()}_${i}`
      nodes.push({
        id,
        label: topic,
        subject,
        ageStart: 4 + i * 2,
        ageEnd: 6 + i * 2,
        domain: subject,
        type: 'CONCEPTUAL',
      })
      if (i > 0) {
        edges.push({ source: `mt_${subject.slice(0, 3).toLowerCase()}_${i - 1}`, target: id, strength: 'hard' })
      }
      if (i > 1 && i % 3 === 0) {
        edges.push({ source: `mt_${subject.slice(0, 3).toLowerCase()}_${i - 2}`, target: id, strength: 'soft' })
      }
    })
  })

  const crossLinks = [
    ['mt_mat_0', 'mt_sci_2'],
    ['mt_eng_0', 'mt_his_0'],
    ['mt_com_0', 'mt_mat_5'],
    ['mt_ltl_0', 'mt_eng_0'],
    ['mt_psd_0', 'mt_lif_0'],
  ]
  crossLinks.forEach(([s, t]) => {
    if (nodes.find((n) => n.id === s) && nodes.find((n) => n.id === t)) {
      edges.push({ source: s, target: t, strength: 'soft' })
    }
  })

  return { nodes, edges }
}

/** Mock 学科统计 */
export function generateMockSubjects(): SubjectStat[] {
  return subjects.map((s) => ({
    name: s,
    count: (sampleTopics[s] || []).length * 12 + Math.floor(Math.random() * 50),
    domains: [`${s} Fundamentals`, `${s} Advanced`],
  }))
}

/** Mock 主题列表 */
export function generateMockTopics(): Topic[] {
  const result: Topic[] = []
  subjects.forEach((subject) => {
    ;(sampleTopics[subject] || []).forEach((name, i) => {
      const id = `mt_${subject.slice(0, 3).toLowerCase()}_${i}`
      result.push({
        id,
        name,
        subject,
        domain: subject,
        ageRangeStart: 4 + i * 2,
        ageRangeEnd: 6 + i * 2,
        type: i % 3 === 0 ? 'CONCEPTUAL' : 'PROCEDURAL',
        description: descriptions[name] || `${name} is a key topic in ${subject} for this age group.`,
        evidence: evidenceMap[name],
        assessmentPrompt: assessmentMap[name],
      })
    })
  })
  return result
}

/** Mock 单个主题详情 */
export function generateMockTopic(id: string): Topic | null {
  const allTopics = generateMockTopics()
  return allTopics.find((t) => t.id === id) || null
}

/** Mock 前置依赖 */
export function generateMockPrereqs(id: string): Topic[] {
  const allTopics = generateMockTopics()
  const topic = allTopics.find((t) => t.id === id)
  if (!topic) return []
  return allTopics.filter((t) => t.subject === topic.subject && t.id < id).slice(-3)
}

/** Mock 解锁链 */
export function generateMockUnlocks(id: string): Topic[] {
  const allTopics = generateMockTopics()
  const topic = allTopics.find((t) => t.id === id)
  if (!topic) return []
  return allTopics.filter((t) => t.subject === topic.subject && t.id > id).slice(0, 3)
}

/** Mock 学习路径 */
export function generateMockPath(id: string): Topic[] {
  const allTopics = generateMockTopics()
  const topic = allTopics.find((t) => t.id === id)
  if (!topic) return []
  return allTopics.filter((t) => t.subject === topic.subject && t.id <= id).slice(-5)
}

/** Mock 领域摘要 */
export function generateMockClusters(): Cluster[] {
  return [
    { subject: 'Science', domain: 'Physics Fundamentals', ageRangeStart: 8, summary: 'Core physics concepts including forces, motion, energy, and waves.' },
    { subject: 'Science', domain: 'Physics Fundamentals', ageRangeStart: 10, summary: 'Advanced physics: electricity, magnetism, and Newton\'s laws.' },
    { subject: 'Science', domain: 'Life Sciences', ageRangeStart: 4, summary: 'Understanding living organisms and the natural world around us.' },
    { subject: 'Mathematics', domain: 'Number Sense', ageRangeStart: 4, summary: 'Building strong foundations in number relationships and basic arithmetic.' },
    { subject: 'Mathematics', domain: 'Number Sense', ageRangeStart: 6, summary: 'Extending number sense to larger numbers, place value, and mental strategies.' },
    { subject: 'Mathematics', domain: 'Geometry & Data', ageRangeStart: 8, summary: 'Shapes, measurement, statistics, and probability.' },
    { subject: 'English', domain: 'Language Foundations', ageRangeStart: 4, summary: 'Phonics, grammar, vocabulary — building blocks of English proficiency.' },
    { subject: 'English', domain: 'Reading & Writing', ageRangeStart: 7, summary: 'Developing fluency in reading comprehension and creative writing skills.' },
    { subject: 'History', domain: 'Ancient Civilisations', ageRangeStart: 8, summary: 'Exploring ancient Egypt, Rome, and medieval societies.' },
    { subject: 'Computing', domain: 'Computer Science', ageRangeStart: 8, summary: 'Algorithms, data structures, and programming fundamentals.' },
    { subject: 'Personal & Social Development', domain: 'Social-Emotional Learning', ageRangeStart: 4, summary: 'Understanding emotions, building empathy, and developing healthy relationships.' },
    { subject: 'Learning to Learn', domain: 'Metacognition', ageRangeStart: 8, summary: 'Learning how to learn effectively — study skills and self-regulation.' },
  ]
}

/** Mock 课程标准 */
export function generateMockStandards(): { id: string; name: string; topics?: string[] }[] {
  return [
    { id: 'std_uk_nc', name: 'UK National Curriculum', topics: ['Number Bonds', 'Forces and Motion', 'Building Sentences'] },
    { id: 'std_us_cc', name: 'US Common Core', topics: ['Reading Comprehension', 'Fractions', 'Algebra Basics'] },
    { id: 'std_ib_pyp', name: 'IB Primary Years Programme', topics: ['Living Things', 'Emotions', 'Teamwork'] },
    { id: 'std_au_ac', name: 'Australian Curriculum', topics: ['Materials', 'Multiplication', 'Grammar Rules'] },
    { id: 'std_sg_moe', name: 'Singapore MOE', topics: ['Number Bonds', 'Fractions', 'Geometry'] },
    { id: 'std_ie_ncc', name: 'Ireland National Curriculum', topics: ['Phonics', 'Addition and Subtraction'] },
    { id: 'std_nz_nzc', name: 'New Zealand Curriculum', topics: ['Study Techniques', 'Self-Awareness', 'Digital Literacy'] },
  ]
}
