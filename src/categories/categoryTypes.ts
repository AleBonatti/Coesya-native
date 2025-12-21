export interface Category {
    id: number;
    title: string;
    ico: string | null;
    active: 0 | 1;
    created_at: string;
    updated_at: string | null;
}

export interface CategoriesResponse {
    success: "ok";
    items: Category[];
}
