import fs from 'fs';
import path from 'path';
import { SectionMeta, SectionRevision } from '@/lib/cms/types';
import { cmsSchemaRegistry } from '@/lib/cms/registry';

const storageRoot = path.join(process.cwd(), 'storage');
const cmsRoot = path.join(storageRoot, 'cms');
const metaPath = path.join(cmsRoot, 'sections-meta.json');
const draftsPath = path.join(cmsRoot, 'drafts.json');
const revisionsPath = path.join(cmsRoot, 'revisions.json');
const activityPath = path.join(cmsRoot, 'activity-log.json');
const mediaPath = path.join(cmsRoot, 'media-assets.json');

function ensureStorage() {
  if (!fs.existsSync(storageRoot)) fs.mkdirSync(storageRoot);
  if (!fs.existsSync(cmsRoot)) fs.mkdirSync(cmsRoot);
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  ensureStorage();
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  } catch {
    return fallback;
  }
}

function writeJsonFile<T>(filePath: string, value: T) {
  ensureStorage();
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf-8');
}

export function getSectionMeta(): SectionMeta[] {
  const fallback: SectionMeta[] = cmsSchemaRegistry.map((section, idx) => ({
    section: section.id,
    enabled: true,
    order: idx + 1,
    status: 'published',
    updatedAt: new Date().toISOString(),
    updatedBy: 'system',
  }));
  return readJsonFile(metaPath, fallback);
}

export function saveSectionMeta(meta: SectionMeta[]) {
  writeJsonFile(metaPath, meta);
}

export function getDrafts(): Record<string, string> {
  return readJsonFile<Record<string, string>>(draftsPath, {});
}

export function saveDrafts(drafts: Record<string, string>) {
  writeJsonFile(draftsPath, drafts);
}

export function getRevisions(): SectionRevision[] {
  return readJsonFile<SectionRevision[]>(revisionsPath, []);
}

export function saveRevisions(revisions: SectionRevision[]) {
  writeJsonFile(revisionsPath, revisions);
}

export function appendActivityLog(entry: Record<string, unknown>) {
  const logs = readJsonFile<Record<string, unknown>[]>(activityPath, []);
  logs.unshift({ ...entry, timestamp: new Date().toISOString() });
  writeJsonFile(activityPath, logs.slice(0, 500));
}

export function getActivityLog() {
  return readJsonFile<Record<string, unknown>[]>(activityPath, []);
}

export function getMediaAssets() {
  return readJsonFile<Record<string, unknown>[]>(mediaPath, []);
}

export function saveMediaAssets(entries: Record<string, unknown>[]) {
  writeJsonFile(mediaPath, entries);
}
