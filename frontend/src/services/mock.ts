import type { GraphData, SubjectStat, Topic, Cluster, Standard } from '../types/topic'

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

const ages = ['4-6', '6-8', '8-10', '10-12', '12-14', '14-16']

const descriptions: Record<string, string> = {
  'Forces and Motion': 'Understand how objects move and the forces that act upon them. Explore push, pull, gravity, friction, and how forces change speed and direction.',
  'Living Things': 'Explore the characteristics of living organisms, their habitats, life cycles, and how they depend on each other.',
  'Number Bonds': 'Learn the pairs of numbers that combine to make a given total. Build fluency in addition and subtraction facts.',
  'Addition and Subtraction': 'Master mental and written methods for adding and subtracting numbers, including regrouping and problem solving.',
  'Building Sentences': 'Learn to construct clear, grammatically correct sentences using subjects, verbs, and objects.',
  'Phonics': 'Connect sounds to letters and letter groups to decode and spell words accurately.',
  'Ancient Egypt': 'Explore the civilization of ancient Egypt: pharaohs, pyramids, hieroglyphics, daily life, and lasting legacy.',
  'Algorithms': 'Understand step-by-step procedures for solving problems. Learn to design, represent, and evaluate algorithms.',
  'Emotions': 'Recognise, name, and manage a range of emotions. Understand how feelings affect behaviour and relationships.',
  'Cooking Basics': 'Learn fundamental cooking skills: measuring, mixing, safe use of kitchen equipment, and following recipes.',
  'Note Taking': 'Develop effective strategies for recording and organizing information during learning.',
  'Critical Thinking': 'Analyse arguments, evaluate evidence, identify bias, and form well-reasoned conclusions.',
}

const evidenceMap: Record<string, string> = {
  'Forces and Motion': 'Can identify different types of forces and predict their effect on objects. Can design a fair test to investigate friction.',
  'Number Bonds': 'Recalls number bonds to 10 and 20 fluently. Uses bonds to solve missing number problems.',
  'Building Sentences': 'Writes sentences with correct capitalisation and punctuation. Varies sentence structure for effect.',
}

const assessmentMap: Record<string, string> = {
  'Forces and Motion': 'Ask the student to draw a diagram showing all the forces acting on a ball rolling down a hill. Can they label each force correctly?',
  'Number Bonds': 'Present missing number problems: 7 + ? = 10, ? + 3 = 8. Can the student solve these within 5 seconds each?',
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
        age: ages[i % ages.length],
      })
      if (i > 0) {
        edges.push({ source: `mt_${subject.slice(0, 3).toLowerCase()}_${i - 1}`, target: id, strength: 'hard' })
      }
      if (i > 1 && i % 3 === 0) {
        edges.push({ source: `mt_${subject.slice(0, 3).toLowerCase()}_${i - 2}`, target: id, strength: 'soft' })
      }
    })
  })

  // 跨学科边
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
    subject: s,
    count: (sampleTopics[s] || []).length * 12 + Math.floor(Math.random() * 50),
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
        ageRange: ages[i % ages.length],
        type: i % 3 === 0 ? 'core' : 'extension',
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
  // 返回同学科中 index 更小的主题
  return allTopics
    .filter((t) => t.subject === topic.subject && t.id < id)
    .slice(-3)
}

/** Mock 解锁链 */
export function generateMockUnlocks(id: string): Topic[] {
  const allTopics = generateMockTopics()
  const topic = allTopics.find((t) => t.id === id)
  if (!topic) return []
  return allTopics
    .filter((t) => t.subject === topic.subject && t.id > id)
    .slice(0, 3)
}

/** Mock 学习路径 */
export function generateMockPath(id: string): Topic[] {
  const allTopics = generateMockTopics()
  const topic = allTopics.find((t) => t.id === id)
  if (!topic) return []
  // 从同学科第一个到当前
  return allTopics
    .filter((t) => t.subject === topic.subject && t.id <= id)
    .slice(-5)
}

/** Mock 领域摘要 */
export function generateMockClusters(): Cluster[] {
  const clusterData: Cluster[] = [
    { id: 'cl_sci_1', name: 'Physics Fundamentals', description: 'Core physics concepts including forces, motion, energy, and waves. Builds foundation for advanced science study.', subject: 'Science', ageGroups: ['8-10', '10-12', '12-14'], topics: ['Forces and Motion', 'Light and Sound', 'Electricity'] },
    { id: 'cl_sci_2', name: 'Life Sciences', description: 'Understanding living organisms, ecosystems, and the natural world around us.', subject: 'Science', ageGroups: ['4-6', '6-8', '8-10'], topics: ['Living Things', 'Ecosystems'] },
    { id: 'cl_sci_3', name: 'Earth & Materials', description: 'Exploring our planet, its materials, and the chemical processes that shape the world.', subject: 'Science', ageGroups: ['6-8', '8-10', '10-12'], topics: ['Materials', 'Earth and Space', 'Chemical Reactions'] },
    { id: 'cl_mat_1', name: 'Number Sense', description: 'Building strong foundations in number relationships, bonds, and basic arithmetic operations.', subject: 'Mathematics', ageGroups: ['4-6', '6-8'], topics: ['Number Bonds', 'Addition and Subtraction'] },
    { id: 'cl_mat_2', name: 'Geometry & Data', description: 'Shapes, measurement, statistics, and probability — understanding the world through mathematical structures.', subject: 'Mathematics', ageGroups: ['8-10', '10-12', '12-14'], topics: ['Geometry', 'Statistics', 'Probability'] },
    { id: 'cl_eng_1', name: 'Reading & Writing', description: 'Developing fluency in reading comprehension and creative/analytical writing skills.', subject: 'English', ageGroups: ['6-8', '8-10', '10-12'], topics: ['Reading Comprehension', 'Creative Writing', 'Persuasive Writing'] },
    { id: 'cl_eng_2', name: 'Language Foundations', description: 'Phonics, grammar, vocabulary — the building blocks of English language proficiency.', subject: 'English', ageGroups: ['4-6', '6-8'], topics: ['Phonics', 'Building Sentences', 'Grammar Rules', 'Vocabulary'] },
    { id: 'cl_his_1', name: 'Ancient Civilisations', description: 'Exploring ancient Egypt, Rome, and medieval societies — how they shaped the modern world.', subject: 'History', ageGroups: ['8-10', '10-12'], topics: ['Ancient Egypt', 'Roman Empire', 'Medieval Period'] },
    { id: 'cl_his_2', name: 'Modern Conflicts', description: 'Understanding the major conflicts and political changes of the 20th century.', subject: 'History', ageGroups: ['12-14', '14-16'], topics: ['World War I', 'World War II', 'Cold War'] },
    { id: 'cl_com_1', name: 'Computer Science', description: 'Algorithms, data structures, and programming — computational thinking for the digital age.', subject: 'Computing', ageGroups: ['8-10', '10-12', '12-14'], topics: ['Algorithms', 'Programming Basics', 'Data Structures'] },
    { id: 'cl_psd_1', name: 'Social-Emotional Learning', description: 'Understanding emotions, building empathy, and developing healthy relationships with others.', subject: 'Personal & Social Development', ageGroups: ['4-6', '6-8', '8-10'], topics: ['Emotions', 'Empathy', 'Teamwork', 'Communication'] },
    { id: 'cl_ltl_1', name: 'Metacognition', description: 'Learning how to learn effectively — study skills, critical thinking, and self-regulation strategies.', subject: 'Learning to Learn', ageGroups: ['8-10', '10-12', '12-14'], topics: ['Note Taking', 'Study Techniques', 'Critical Thinking', 'Memory Strategies'] },
  ]
  return clusterData
}

/** Mock 课程标准 */
export function generateMockStandards(): Standard[] {
  return [
    { id: 'std_uk_nc', name: 'UK National Curriculum', description: 'The statutory framework for schools in England, covering Key Stages 1-4.', topics: ['Number Bonds', 'Forces and Motion', 'Building Sentences', 'Ancient Egypt'] },
    { id: 'std_us_cc', name: 'US Common Core', description: 'State-led standards for English Language Arts and Mathematics in K-12 education.', topics: ['Reading Comprehension', 'Fractions', 'Algebra Basics', 'Statistics'] },
    { id: 'std_ib_pyp', name: 'IB Primary Years Programme', description: 'International Baccalaureate framework for ages 3-12, emphasising inquiry-based learning.', topics: ['Living Things', 'Emotions', 'Teamwork', 'Critical Thinking'] },
    { id: 'std_au_ac', name: 'Australian Curriculum', description: 'National curriculum for Foundation to Year 10 across all learning areas.', topics: ['Materials', 'Multiplication', 'Grammar Rules', 'Geography'] },
    { id: 'std_sg_moe', name: 'Singapore MOE', description: 'Ministry of Education framework known for strong mathematics and science standards.', topics: ['Number Bonds', 'Fractions', 'Geometry', 'Forces and Motion', 'Electricity'] },
    { id: 'std_ie_ncc', name: 'Ireland National Curriculum', description: 'Primary School Curriculum covering 8 curriculum areas with child-centred approach.', topics: ['Phonics', 'Addition and Subtraction', 'Living Things', 'Emotions'] },
    { id: 'std_nz_nzc', name: 'New Zealand Curriculum', description: 'National curriculum emphasising key competencies and values alongside learning areas.', topics: ['Study Techniques', 'Self-Awareness', 'Cooking Basics', 'Digital Literacy'] },
  ]
}
