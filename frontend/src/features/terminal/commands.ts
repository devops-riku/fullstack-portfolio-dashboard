// Command registry + parser for the RikuOS terminal CMS.
// Commands are wired to the existing feature APIs so the terminal is a real
// content manager, not a cosmetic shell.

import type { Command } from './types';
import {
  getProjects,
  createProject,
  deleteProject,
} from '../projects/api';
import {
  getSkills,
  createSkill,
  deleteSkill,
} from '../skills/api';
import {
  getExperiences,
  createExperience,
  deleteExperience,
} from '../experience/api';
import {
  getProfile,
  updateProfile,
  type Profile,
} from '../portfolio/profileApi';
import { login } from '../auth/api';

// Quote-aware tokenizer: splits on whitespace but keeps "quoted strings" whole.
export function tokenize(input: string): string[] {
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    out.push(m[1] ?? m[2] ?? m[3] ?? '');
  }
  return out;
}

// Turn a raw API error into a short human line.
function errText(e: unknown): string {
  const anyErr = e as { response?: { status?: number }; message?: string };
  if (anyErr?.response?.status === 401) return 'unauthorized — your session may have expired (/login).';
  if (anyErr?.response?.status) return `request failed (${anyErr.response.status}). Is the backend running?`;
  if (anyErr?.message?.includes('Network')) return 'cannot reach the backend (network error).';
  return anyErr?.message ?? 'unknown error';
}

const PROFILE_FIELDS: Record<string, keyof Profile> = {
  name: 'full_name',
  title: 'title',
  bio: 'bio',
  email: 'email',
  github: 'github_url',
  linkedin: 'linkedin_url',
  avatar: 'avatar_url',
};

export const commands: Command[] = [
  {
    name: 'help',
    usage: '/help',
    description: 'List all available commands',
    run: (ctx) => {
      ctx.print('RikuOS — portfolio command interface', 'system');
      ctx.print('Type a command. Write actions need /login first.', 'info');
      ctx.print('', 'output');
      const width = Math.max(...commands.map((c) => c.usage.length));
      for (const c of commands) {
        const lock = c.auth ? ' (auth)' : '';
        ctx.print(`  ${c.usage.padEnd(width + 2)} ${c.description}${lock}`, 'output');
      }
    },
  },
  {
    name: 'whoami',
    usage: '/whoami',
    description: 'Show the current profile',
    run: async (ctx) => {
      try {
        const p = await getProfile();
        ctx.print(`${p.full_name || 'Anonymous'} — ${p.title || 'no title set'}`, 'success');
        if (p.email) ctx.print(`email   ${p.email}`, 'output');
        if (p.github_url && p.github_url !== '#') ctx.print(`github  ${p.github_url}`, 'output');
        if (p.bio) ctx.print(`bio     ${p.bio}`, 'output');
      } catch (e) {
        ctx.print(errText(e), 'error');
      }
    },
  },
  {
    name: 'profile',
    usage: '/profile set <field> <value>',
    description: 'Edit profile: name|title|bio|email|github|linkedin|avatar',
    auth: true,
    run: async (ctx) => {
      const [sub, field, ...rest] = ctx.args;
      if (sub !== 'set' || !field) {
        ctx.print('usage: /profile set <field> <value>', 'error');
        ctx.print(`fields: ${Object.keys(PROFILE_FIELDS).join(', ')}`, 'info');
        return;
      }
      const key = PROFILE_FIELDS[field.toLowerCase()];
      if (!key) {
        ctx.print(`unknown field "${field}". try: ${Object.keys(PROFILE_FIELDS).join(', ')}`, 'error');
        return;
      }
      const value = rest.join(' ');
      try {
        await updateProfile({ [key]: value } as Partial<Profile>);
        ctx.print(`profile.${field} updated → "${value}"`, 'success');
        ctx.notifyMutated();
      } catch (e) {
        ctx.print(errText(e), 'error');
      }
    },
  },
  {
    name: 'projects',
    usage: '/projects',
    description: 'List all projects',
    run: async (ctx) => {
      try {
        const items = await getProjects();
        if (items.length === 0) return ctx.print('no projects yet. add one with /project add', 'info');
        for (const p of items) {
          ctx.print(`[${p.id}] ${p.title}`, 'success');
          if (p.description) ctx.print(`     ${p.description}`, 'output');
        }
        ctx.print(`${items.length} project(s).`, 'info');
      } catch (e) {
        ctx.print(errText(e), 'error');
      }
    },
  },
  {
    name: 'project',
    usage: '/project add | /project rm <id>',
    description: 'Add (guided) or remove a project',
    auth: true,
    run: (ctx) => {
      const [sub, id] = ctx.args;
      if (sub === 'add') {
        ctx.startWizard({
          title: 'new project',
          steps: [
            { key: 'title', label: 'Title' },
            { key: 'description', label: 'Description' },
            { key: 'github_link', label: 'GitHub / demo link', optional: true },
            { key: 'tags', label: 'Tags', optional: true, hint: '(comma separated)' },
          ],
          onComplete: async (v, c) => {
            try {
              const tags = v.tags ? v.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
              const created = await createProject({
                title: v.title,
                description: v.description,
                image_url: '',
                github_link: v.github_link || '',
                highlights: [],
                tags,
              });
              c.print(`project "${created.title}" published (id ${created.id}).`, 'success');
              c.notifyMutated();
            } catch (e) {
              c.print(errText(e), 'error');
            }
          },
        });
        return;
      }
      if (sub === 'rm') {
        const n = Number(id);
        if (!Number.isInteger(n)) return ctx.print('usage: /project rm <id>', 'error');
        deleteProject(n)
          .then(() => {
            ctx.print(`project ${n} deleted.`, 'success');
            ctx.notifyMutated();
          })
          .catch((e) => ctx.print(errText(e), 'error'));
        return;
      }
      ctx.print('usage: /project add  |  /project rm <id>', 'error');
    },
  },
  {
    name: 'skills',
    usage: '/skills',
    description: 'List all skills',
    run: async (ctx) => {
      try {
        const items = await getSkills();
        if (items.length === 0) return ctx.print('no skills yet. add one with /skill add <name> <category>', 'info');
        for (const s of items) ctx.print(`[${s.id}] ${s.name}  ·  ${s.category || 'uncategorized'}`, 'success');
        ctx.print(`${items.length} skill(s).`, 'info');
      } catch (e) {
        ctx.print(errText(e), 'error');
      }
    },
  },
  {
    name: 'skill',
    usage: '/skill add <name> <category> [icon] | /skill rm <id>',
    description: 'Add or remove a skill',
    auth: true,
    run: async (ctx) => {
      const [sub, ...rest] = ctx.args;
      if (sub === 'add') {
        const [name, category, icon] = rest;
        if (!name) return ctx.print('usage: /skill add <name> <category> [icon]', 'error');
        try {
          const created = await createSkill({
            name,
            category: category || 'other',
            icon_name: icon || 'ph:cube-bold',
          });
          ctx.print(`skill "${created.name}" added (id ${created.id}).`, 'success');
          ctx.notifyMutated();
        } catch (e) {
          ctx.print(errText(e), 'error');
        }
        return;
      }
      if (sub === 'rm') {
        const n = Number(rest[0]);
        if (!Number.isInteger(n)) return ctx.print('usage: /skill rm <id>', 'error');
        try {
          await deleteSkill(n);
          ctx.print(`skill ${n} deleted.`, 'success');
          ctx.notifyMutated();
        } catch (e) {
          ctx.print(errText(e), 'error');
        }
        return;
      }
      ctx.print('usage: /skill add <name> <category> [icon]  |  /skill rm <id>', 'error');
    },
  },
  {
    name: 'experience',
    usage: '/experience',
    description: 'List work experience',
    run: async (ctx) => {
      try {
        const items = await getExperiences();
        if (items.length === 0) return ctx.print('no experience yet. add one with /exp add', 'info');
        for (const x of items) ctx.print(`[${x.id}] ${x.role} @ ${x.company}  ·  ${x.period}`, 'success');
        ctx.print(`${items.length} entr(ies).`, 'info');
      } catch (e) {
        ctx.print(errText(e), 'error');
      }
    },
  },
  {
    name: 'exp',
    usage: '/exp add | /exp rm <id>',
    description: 'Add (guided) or remove an experience entry',
    auth: true,
    run: (ctx) => {
      const [sub, id] = ctx.args;
      if (sub === 'add') {
        ctx.startWizard({
          title: 'new experience',
          steps: [
            { key: 'role', label: 'Role' },
            { key: 'company', label: 'Company' },
            { key: 'period', label: 'Period', hint: '(e.g. 2023 — Now)' },
            { key: 'description', label: 'Description' },
          ],
          onComplete: async (v, c) => {
            try {
              const created = await createExperience({
                role: v.role,
                company: v.company,
                period: v.period,
                description: v.description,
              });
              c.print(`experience "${created.role} @ ${created.company}" added.`, 'success');
              c.notifyMutated();
            } catch (e) {
              c.print(errText(e), 'error');
            }
          },
        });
        return;
      }
      if (sub === 'rm') {
        const n = Number(id);
        if (!Number.isInteger(n)) return ctx.print('usage: /exp rm <id>', 'error');
        deleteExperience(n)
          .then(() => {
            ctx.print(`experience ${n} deleted.`, 'success');
            ctx.notifyMutated();
          })
          .catch((e) => ctx.print(errText(e), 'error'));
        return;
      }
      ctx.print('usage: /exp add  |  /exp rm <id>', 'error');
    },
  },
  {
    name: 'goto',
    usage: '/goto <section>',
    description: 'Jump to stack | projects | experience | contact',
    run: (ctx) => {
      const target = (ctx.args[0] || '').toLowerCase();
      const valid = ['stack', 'projects', 'experience', 'contact'];
      if (!valid.includes(target)) return ctx.print(`usage: /goto ${valid.join('|')}`, 'error');
      ctx.scrollToSection(target);
      ctx.print(`→ ${target}`, 'info');
    },
  },
  {
    name: 'theme',
    usage: '/theme dark|light',
    description: 'Switch the color theme',
    run: (ctx) => {
      const t = (ctx.args[0] || '').toLowerCase();
      if (t !== 'dark' && t !== 'light') return ctx.print('usage: /theme dark|light', 'error');
      ctx.setTheme(t);
      ctx.print(`theme → ${t}`, 'success');
    },
  },
  {
    name: 'login',
    usage: '/login <email> <password>',
    description: 'Authenticate for write commands',
    run: async (ctx) => {
      const [email, password] = ctx.args;
      if (!email || !password) return ctx.print('usage: /login <email> <password>', 'error');
      try {
        const params = new URLSearchParams();
        params.append('username', email);
        params.append('password', password);
        const { access_token } = await login(params);
        localStorage.setItem('token', access_token);
        ctx.print(`authenticated as ${email}.`, 'success');
        ctx.notifyMutated();
      } catch (e) {
        ctx.print(errText(e), 'error');
      }
    },
  },
  {
    name: 'logout',
    usage: '/logout',
    description: 'End the current session',
    run: (ctx) => {
      localStorage.removeItem('token');
      ctx.print('session ended.', 'success');
      ctx.notifyMutated();
    },
  },
  {
    name: 'dashboard',
    usage: '/dashboard',
    description: 'Open the visual dashboard',
    run: (ctx) => {
      ctx.navigate('/dashboard');
      ctx.print('→ /dashboard', 'info');
    },
  },
  {
    name: 'clear',
    usage: '/clear',
    description: 'Clear the console',
    run: (ctx) => ctx.clear(),
  },
];

export const commandMap: Record<string, Command> = Object.fromEntries(
  commands.map((c) => [c.name, c]),
);

export function commandNames(): string[] {
  return commands.map((c) => c.name);
}
