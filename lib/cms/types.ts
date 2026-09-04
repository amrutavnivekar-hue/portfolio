export type CmsFieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'url'
  | 'number'
  | 'boolean'
  | 'media'
  | 'list';

export interface CmsFieldSchema {
  key: string;
  label: string;
  type: CmsFieldType;
  required?: boolean;
  placeholder?: string;
  xmlPath: string;
  repeatableItemShape?: CmsFieldSchema[];
}

export interface CmsSectionSchema {
  id: string;
  label: string;
  description: string;
  xmlFile: string;
  rootNode: string;
  listNode?: string;
  previewTitleField?: string;
  fields: CmsFieldSchema[];
}

export type CmsRole = 'viewer' | 'editor' | 'admin' | 'superadmin';

export interface CmsUser {
  username: string;
  password: string;
  role: CmsRole;
}

export interface SectionMeta {
  section: string;
  enabled: boolean;
  order: number;
  status: 'draft' | 'published';
  updatedAt: string;
  updatedBy: string;
}

export interface SectionRevision {
  id: string;
  section: string;
  xml: string;
  createdAt: string;
  createdBy: string;
  type: 'autosave' | 'publish' | 'restore';
}
