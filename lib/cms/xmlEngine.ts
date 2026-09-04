import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';
import { cmsSchemaRegistry, getSchemaBySection } from '@/lib/cms/registry';
import { CmsFieldSchema, CmsSectionSchema, SectionRevision } from '@/lib/cms/types';
import {
  appendActivityLog,
  getDrafts,
  getRevisions,
  getSectionMeta,
  saveDrafts,
  saveRevisions,
  saveSectionMeta,
} from '@/lib/cms/storage';

const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: false });

function xmlPathFile(schema: CmsSectionSchema) {
  return path.join(process.cwd(), 'data', schema.xmlFile);
}

function isAttrPath(pathName: string) {
  return pathName.startsWith('$.');
}

function getNodeValue(source: any, schemaField: CmsFieldSchema): any {
  if (schemaField.type === 'list') {
    const arr = source?.[schemaField.xmlPath];
    return arr ? (Array.isArray(arr) ? arr : [arr]) : [];
  }
  if (isAttrPath(schemaField.xmlPath)) {
    return source?.$?.[schemaField.xmlPath.replace('$.', '')] ?? '';
  }
  return source?.[schemaField.xmlPath] ?? '';
}

function setNodeValue(target: any, schemaField: CmsFieldSchema, value: any) {
  if (schemaField.type === 'list') {
    target[schemaField.xmlPath] = value;
    return;
  }
  if (isAttrPath(schemaField.xmlPath)) {
    target.$ = target.$ || {};
    target.$[schemaField.xmlPath.replace('$.', '')] = String(value ?? '');
    return;
  }
  target[schemaField.xmlPath] = String(value ?? '');
}

function normalizeValue(field: CmsFieldSchema, value: any) {
  if (field.type === 'number') {
    const n = Number(value);
    return Number.isFinite(n) ? String(n) : '0';
  }
  if (field.type === 'boolean') return value ? 'true' : 'false';
  return value ?? '';
}

export async function loadSectionModel(section: string) {
  const schema = getSchemaBySection(section);
  if (!schema) throw new Error(`Unknown section "${section}"`);
  const filePath = xmlPathFile(schema);
  const xml = fs.readFileSync(filePath, 'utf-8');
  const parsed = await parser.parseStringPromise(xml);
  const root = parsed[schema.rootNode];
  const model: Record<string, any> = {};

  for (const field of schema.fields) {
    const rawValue = getNodeValue(root, field);
    if (field.type === 'list' && field.repeatableItemShape) {
      model[field.key] = (rawValue || []).map((entry: any) => {
        const item: Record<string, any> = {};
        for (const itemField of field.repeatableItemShape || []) {
          if (itemField.type === 'list' && itemField.repeatableItemShape) {
            const nested = getNodeValue(entry, itemField);
            item[itemField.key] = (nested || []).map((nestedEntry: any) => {
              const nestedItem: Record<string, any> = {};
              for (const nestedField of itemField.repeatableItemShape || []) {
                nestedItem[nestedField.key] = getNodeValue(nestedEntry, nestedField);
              }
              return nestedItem;
            });
          } else {
            item[itemField.key] = getNodeValue(entry, itemField);
          }
        }
        return item;
      });
    } else {
      model[field.key] = rawValue;
    }
  }

  return { schema, model, xml };
}

function buildRootObject(schema: CmsSectionSchema, model: Record<string, any>) {
  const root: Record<string, any> = {};
  for (const field of schema.fields) {
    if (field.type === 'list' && field.repeatableItemShape) {
      const rows = Array.isArray(model[field.key]) ? model[field.key] : [];
      root[field.xmlPath] = rows.map((entry: Record<string, any>) => {
        const builtEntry: Record<string, any> = {};
        for (const itemField of field.repeatableItemShape || []) {
          if (itemField.type === 'list' && itemField.repeatableItemShape) {
            const nestedRows = Array.isArray(entry[itemField.key]) ? entry[itemField.key] : [];
            builtEntry[itemField.xmlPath] = nestedRows.map((nestedRow: Record<string, any>) => {
              const builtNested: Record<string, any> = {};
              for (const nestedField of itemField.repeatableItemShape || []) {
                setNodeValue(
                  builtNested,
                  nestedField,
                  normalizeValue(nestedField, nestedRow[nestedField.key])
                );
              }
              return builtNested;
            });
          } else {
            setNodeValue(builtEntry, itemField, normalizeValue(itemField, entry[itemField.key]));
          }
        }
        return builtEntry;
      });
    } else {
      setNodeValue(root, field, normalizeValue(field, model[field.key]));
    }
  }
  return root;
}

export async function validateSectionModel(section: string, model: Record<string, any>) {
  const schema = getSchemaBySection(section);
  if (!schema) throw new Error(`Unknown section "${section}"`);

  for (const field of schema.fields) {
    if (field.required && !String(model[field.key] ?? '').trim()) {
      throw new Error(`${field.label} is required.`);
    }
    if (field.type === 'list' && field.repeatableItemShape) {
      const entries = Array.isArray(model[field.key]) ? model[field.key] : [];
      for (const entry of entries) {
        for (const child of field.repeatableItemShape || []) {
          if (child.required && child.type !== 'list' && !String(entry[child.key] ?? '').trim()) {
            throw new Error(`${field.label}: ${child.label} is required.`);
          }
          if (child.type === 'list' && child.repeatableItemShape) {
            const nested = Array.isArray(entry[child.key]) ? entry[child.key] : [];
            for (const nestedRow of nested) {
              for (const nestedField of child.repeatableItemShape || []) {
                if (
                  nestedField.required &&
                  !String(nestedRow[nestedField.key] ?? '').trim()
                ) {
                  throw new Error(`${field.label}: ${nestedField.label} is required.`);
                }
              }
            }
          }
        }
      }
    }
  }
}

function appendRevision(section: string, xml: string, user: string, type: SectionRevision['type']) {
  const revisions = getRevisions();
  revisions.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    section,
    xml,
    createdAt: new Date().toISOString(),
    createdBy: user,
    type,
  });
  saveRevisions(revisions.slice(0, 1000));
}

export async function serializeSectionModel(section: string, model: Record<string, any>) {
  await validateSectionModel(section, model);
  const schema = getSchemaBySection(section);
  if (!schema) throw new Error(`Unknown section "${section}"`);
  const root = buildRootObject(schema, model);
  const builder = new xml2js.Builder({
    xmldec: { version: '1.0', encoding: 'UTF-8' },
    renderOpts: { pretty: true, indent: '  ', newline: '\n' },
  });
  const payload = { [schema.rootNode]: root };
  return builder.buildObject(payload);
}

export async function saveDraft(section: string, model: Record<string, any>, user: string) {
  const xml = await serializeSectionModel(section, model);
  const drafts = getDrafts();
  drafts[section] = xml;
  saveDrafts(drafts);
  appendRevision(section, xml, user, 'autosave');
  appendActivityLog({ action: 'draft_saved', section, user });

  const meta = getSectionMeta();
  const row = meta.find((item) => item.section === section);
  if (row) {
    row.status = 'draft';
    row.updatedAt = new Date().toISOString();
    row.updatedBy = user;
    saveSectionMeta(meta);
  }

  return xml;
}

export function publishSection(section: string, user: string) {
  const schema = getSchemaBySection(section);
  if (!schema) throw new Error(`Unknown section "${section}"`);
  const drafts = getDrafts();
  const xml = drafts[section] || fs.readFileSync(xmlPathFile(schema), 'utf-8');
  fs.writeFileSync(xmlPathFile(schema), xml, 'utf-8');
  delete drafts[section];
  saveDrafts(drafts);
  appendRevision(section, xml, user, 'publish');
  appendActivityLog({ action: 'published', section, user });

  const meta = getSectionMeta();
  const row = meta.find((item) => item.section === section);
  if (row) {
    row.status = 'published';
    row.updatedAt = new Date().toISOString();
    row.updatedBy = user;
    saveSectionMeta(meta);
  }
  return xml;
}

export function duplicateSection(section: string, user: string) {
  const meta = getSectionMeta();
  const source = meta.find((item) => item.section === section);
  if (!source) throw new Error('Section not found.');
  const cloneId = `${section}-copy-${Date.now()}`;
  meta.push({
    ...source,
    section: cloneId,
    status: 'draft',
    order: Math.max(...meta.map((s) => s.order), 0) + 1,
    updatedAt: new Date().toISOString(),
    updatedBy: user,
  });
  saveSectionMeta(meta);
  appendActivityLog({ action: 'duplicated', section, cloneId, user });
  return cloneId;
}

export function deleteSection(section: string, user: string) {
  const meta = getSectionMeta();
  const filtered = meta.filter((row) => row.section !== section);
  saveSectionMeta(filtered);
  const drafts = getDrafts();
  delete drafts[section];
  saveDrafts(drafts);
  appendActivityLog({ action: 'deleted', section, user });
}

export function updateSectionOrder(sections: string[], user: string) {
  const meta = getSectionMeta();
  const map = new Map(meta.map((item) => [item.section, item]));
  const next = sections
    .filter((id) => map.has(id))
    .map((id, idx) => ({ ...(map.get(id) as any), order: idx + 1 }));
  for (const leftover of meta) {
    if (!sections.includes(leftover.section)) next.push(leftover);
  }
  saveSectionMeta(next);
  appendActivityLog({ action: 'order_updated', user, sections });
  return next;
}

export function listCmsSections() {
  const meta = getSectionMeta();
  return cmsSchemaRegistry.map((schema) => {
    const metaItem = meta.find((item) => item.section === schema.id);
    return {
      id: schema.id,
      label: schema.label,
      description: schema.description,
      fields: schema.fields.length,
      enabled: metaItem?.enabled ?? true,
      order: metaItem?.order ?? 999,
      status: metaItem?.status ?? 'published',
      updatedAt: metaItem?.updatedAt ?? null,
      updatedBy: metaItem?.updatedBy ?? null,
    };
  });
}

export function listRevisions(section: string) {
  return getRevisions().filter((item) => item.section === section).slice(0, 50);
}

export function restoreRevision(section: string, revisionId: string, user: string) {
  const revision = getRevisions().find((item) => item.section === section && item.id === revisionId);
  if (!revision) throw new Error('Revision not found.');
  const drafts = getDrafts();
  drafts[section] = revision.xml;
  saveDrafts(drafts);
  appendRevision(section, revision.xml, user, 'restore');
  appendActivityLog({ action: 'revision_restored', section, revisionId, user });
}
