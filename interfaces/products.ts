export interface IProduct {
    id: string;
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: ISize[];
    slug: string;
    tags: string[];
    title: string;
    type: IType;
    gender: IGender

    createdAt: string;
    updatedAt: string;
}

export interface IProducts {
    products: IUseProducts[];
}

export interface IUseProducts {
    title:   string;
    images:  string[];
    price:   number;
    inStock: number;
    slug:    string;
    id:      number;
}


export type IGender = 'men'|'women'|'kid'|'unisex'
export type ISize = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL' | '';
export type IType = 'shirts'|'pants'|'hoodies'|'hats';