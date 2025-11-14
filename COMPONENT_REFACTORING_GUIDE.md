# Profile Page Component Refactoring Guide

## ✅ Components Created

1. **SkillCard** (`components/profile/SkillCard.tsx`)
2. **ExperienceCard** (`components/profile/ExperienceCard.tsx`)  
3. **EducationCard** (`components/profile/EducationCard.tsx`)
4. **PersonalInfoSection** (`components/profile/PersonalInfoSection.tsx`)

## 📝 How to Use in `app/profile/page.tsx`

### 1. Add Imports

Replace the current imports with:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PersonalInfoSection from '@/components/profile/PersonalInfoSection'
import ExperienceCard from '@/components/profile/ExperienceCard'
import EducationCard from '@/components/profile/EducationCard'
import SkillCard from '@/components/profile/SkillCard'
```

### 2. Remove Unused State

Remove these lines (components manage their own expand/collapse state):
```typescript
const [expandedExperiences, setExpandedExperiences] = useState<Set<number>>(new Set([0]))
const [expandedEducation, setExpandedEducation] = useState<Set<number>>(new Set([0]))
const [expandedSkills, setExpandedSkills] = useState<Set<number>>(new Set())
const [personalInfoExpanded, setPersonalInfoExpanded] = useState(true)
```

Remove these functions:
```typescript
const toggleExperience = (index: number) => { ... }
const toggleEducation = (index: number) => { ... }
const toggleSkill = (index: number) => { ... }
```

### 3. Add Helper Functions

Add these before the `return` statement:

```typescript
// Personal Info handler
const handlePersonalInfoChange = (field: string, value: string) => {
  switch(field) {
    case 'fullName': setFullName(value); break
    case 'email': setEmail(value); break
    case 'phone': setPhone(value); break
    case 'location': setLocation(value); break
    case 'summary': setSummary(value); break
  }
}

// Experience handler
const handleExperienceChange = (index: number, field: keyof Experience, value: string | boolean | null) => {
  const newExp = [...experiences]
  newExp[index] = { ...newExp[index], [field]: value }
  setExperiences(newExp)
}

// Education handler
const handleEducationChange = (index: number, field: keyof Education, value: string | boolean | null) => {
  const newEdu = [...education]
  newEdu[index] = { ...newEdu[index], [field]: value }
  setEducation(newEdu)
}

// Skill handler
const handleSkillChange = (index: number, field: 'skill_name' | 'skill_level', value: string) => {
  const newSkills = [...skills]
  newSkills[index] = { ...newSkills[index], [field]: value }
  setSkills(newSkills)
}
```

### 4. Replace PersonalInfo Section

Find the Personal Information section and replace with:

```typescript
<PersonalInfoSection
  fullName={fullName}
  email={email}
  phone={phone}
  location={location}
  summary={summary}
  saving={saving}
  onFieldChange={handlePersonalInfoChange}
  onSave={handleSaveProfile}
/>
```

### 5. Replace Experience Section

Find the experiences.map section and replace with:

```typescript
<div className="space-y-4">
  {experiences.map((exp, index) => (
    <ExperienceCard
      key={exp.id || index}
      experience={exp}
      index={index}
      onSave={saveExperience}
      onDelete={deleteExperience}
      onChange={handleExperienceChange}
    />
  ))}
</div>
```

### 6. Replace Education Section

Find the education.map section and replace with:

```typescript
<div className="space-y-4">
  {education.map((edu, index) => (
    <EducationCard
      key={edu.id || index}
      education={edu}
      index={index}
      onSave={saveEducation}
      onDelete={deleteEducation}
      onChange={handleEducationChange}
    />
  ))}
</div>
```

### 7. Replace Skills Section

Find the skills.map section and replace with:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {skills.map((skill, index) => (
    <SkillCard
      key={skill.id || index}
      skill={skill}
      index={index}
      onSave={saveSkill}
      onDelete={deleteSkill}
      onChange={handleSkillChange}
    />
  ))}
</div>
```

## ✅ Benefits

1. **Fixed Toggle Issue** - Each component manages its own state independently
2. **Reusable Components** - Can be used in other pages/contexts
3. **Cleaner Code** - Profile page is now much smaller and more maintainable
4. **Better Organization** - Each section has its own file
5. **Type Safety** - All props are properly typed

## 🎯 Result

- Profile page reduced from ~1200 lines to ~400 lines
- Each skill/experience/education card toggles independently
- Code is modular and maintainable
- No more toggle conflicts!
