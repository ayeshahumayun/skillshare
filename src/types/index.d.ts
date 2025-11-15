// frontend/src/types/index.d.ts
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Add any custom attributes here
    'data-testid'?: string;
  }
}

interface User {
  id: string;
  name: string;
  email: string;
  skillsToTeach: string[];
  skillsToLearn: string[];
}

interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  skill: string;
}

interface Skill {
  id: string;
  name: string;
  description?: string;
}