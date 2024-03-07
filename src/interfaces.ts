interface LinkI {
    text: string
    path: string
}

interface SnackI {
    text: string
}

interface LoginResponseI {
    access_token?: string
    refresh_token?: string
    detail?: string
}

interface ShortUserI {
    username?: string
    password?: string
    photo?: string
}

interface ProductI {
    id: number,
    title: string,
    description: string,
    card_price: string,
    card_has_sale: boolean,
    card_sale_price: string,
    order_id: number,
    options: Array<{
        id?: number,
        title: string,
        value: string,
        is_pk?: boolean,
        product_id?: number
    }>,
    parameters: Array<
        {
            id: number,
            title: string,
            price: string,
            has_sale: boolean,
            sale_price: string,
            order_id?: number,
            product_id?: number,
            data?: string[],
            give_type: string,
            description: string | null,
            sale_percent?: string
        }
    >,
    subcategory_id: number,
    product_photos: Array<
        {
            id: number,
            photo: string,
            main: boolean,
            product_id: number
        }
    >,
    sale_percent: number
    
}

interface UserI {
    id: number | null
    balance: string
    email: string
    is_active: boolean
    is_admin: boolean
    is_anonymous: boolean
    photo: string
    reg_datetime: string
    shop_cart: CartItemI[]
    username: string
}

interface SubcategoryI {
    id: number,
    created_datetime: string,
    title: string,
    order_id: number,
    products: ProductI[],
    category_id: number,
    product_count: number
}

interface CategoryI {
    id: number,
    created_datetime: string,
    title: string,
    photo: string,
    order_id: number,
    subcategories: SubcategoryI[],
    subcategories_count: number
  }

interface CartItemI {
    product: {
        id: number
        title: string,
        description: string,
        card_price: string,
        card_has_sale: boolean,
        card_sale_price: string,
        order_id: number,
        subcategory_id: number,
        product_photos: [
        {
            id: number,
            photo: string,
            main: boolean,
            product_id: number
        },
        {
            id: number,
            photo: string,
            main: boolean,
            product_id: number
        }
        ],
        sale_percent: number
    },
    parameter: {
        id: number,
        title: string,
        price: string,
        has_sale: boolean,
        sale_price: string,
        order_id: number,
        product_id: number,
        give_type: string,
        description: string | null
        sale_percent?: string
    },
    quantity: number
}

interface ReviewI {
    id: number
    user: string
    product: string
    images: string[]
    text: string
    created_datetime: string
    rate: number
    user_photo: string
    additionalClass?: string
}

interface PostProductI {
    id: number,
    title: string,
    description: string,
    card_price: string,
    options: Array<{
        id?: number,
        title: string,
        value: string,
        is_pk?: boolean,
        product_id?: number
    }>,
    parameters: Array<
        {
            id: number,
            title: string,
            price: string,
            has_sale: boolean,
            sale_price: string,
            order_id?: number,
            product_id?: number,
            data?: string[],
            files?: FileList | string[],
            give_type: string
            description: string,
        }
    >,
    subcategory_id: number,
    product_photos: FileList[],
    initialPhotos: any[]
}

interface PartnerI {
    id: number
    photo: string
}

interface ParamDataItemI {
    name: string
    size: string
}

interface PostPromocodeI {
    id: number,
    name: string
    activations_count: string
    sale_percent: string
}

export type { 
    LinkI, 
    SnackI, 
    LoginResponseI, 
    UserI, 
    ShortUserI, 
    ProductI, 
    SubcategoryI, 
    CategoryI, 
    CartItemI, 
    ReviewI, 
    PostProductI, 
    PartnerI,
    ParamDataItemI,
    PostPromocodeI
};