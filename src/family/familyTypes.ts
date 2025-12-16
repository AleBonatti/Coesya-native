export interface Family {
    id: number;
    name: string;
}

export interface CreateFamilyRequest {
    name: string;
}

export interface CreateFamilyResponse {
    success: "ok";
    family: Family;
}
