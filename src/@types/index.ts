export * from './store'
export * from './chatbot'
export interface ExtractData {
  id: number;
  projectId: number;
  blobName: string;
  documentLink: string;
  documentName: string;
  documentExtension: string;
  extractedData: any;
  extractedDate: string;
  createdAt: string;
  updatedAt: string;
  project?: ProjectType;
}

export interface ExtractModel {
  id: number;
  modelId: string;
  modelDescription: string;
  appVersion: string;
  extractorName: string;
  extractorDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: number;
  name: string;
}

export interface ProjectType {
  id: number;
  projectId: string;
  extractorId: number;
  projectName: string;
  projectLocation: string;
  createdAt: string;
  updatedAt: string;
  extractedAt: string;

  model: ExtractModel;
  data: ExtractData[];
  owner: Company;
}

export interface ProjectUploadType {
  id: number;
  checked: boolean;
  projectId: number;
  documentName: string;
  documentExtension: string;
  extractedData?: any;
  extractedDate?: string;
  data: any[];
  createdAt: string;
  updatedAt?: string;
}

export interface SupplirUploadType {
  id: number;
  checked: boolean;
  link: string;
  name: string;
  createdAt: string;
}
