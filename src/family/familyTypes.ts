export interface Family {
    id: number;
    name: string;
    code: string;
    profile_photo_path?: string | null;
    profile_photo_url?: string | null;
}

export interface CreateFamilyRequest {
    name: string;
}

export interface CreateFamilyResponse {
    success: "ok";
    family: Family;
}
export interface UpdateFamilyRequest {
    name: string;
}
export interface UpdateFamilyResponse {
    success: "ok";
    family: Family;
}
export interface UploadFamilyPhotoResponse {
    success: "ok";
    family: Family;
}
export interface FamilyMember {
    id: number;
    firstname: string;
    lastname: string;
    email: string | null;
    profile_photo_url?: string | null;
    profile_photo_path?: string | null;
}
export interface FamilyMembersResponse {
    success: "ok";
    members: FamilyMember[];
}
export interface SaveFamilyCodeResponse {
    success: "ok";
}
