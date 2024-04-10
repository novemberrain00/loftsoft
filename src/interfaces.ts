export interface LinkI {
    text: string
    path: string
}

export interface SnackI {
    text: string
}

export interface LoginResponseI {
    access_token?: string
    refresh_token?: string
    detail?: string
}

export interface ShortUserI {
    username?: string
    password?: string
    photo?: string
}

export interface ProductI {
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

export interface UserI {
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

export interface SubcategoryI {
    id: number,
    created_datetime: string,
    title: string,
    order_id: number,
    products: ProductI[],
    category_id: number,
    product_count: number
}

export interface CategoryI {
    id: number,
    created_datetime: string,
    title: string,
    photo: string,
    order_id: number,
    subcategories: SubcategoryI[],
    subcategories_count: number
  }

export interface CartItemI {
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

export interface ReviewI {
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

export interface PostProductI {
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
            data: string[],
            give_type: string
            description: string,
        }
    >,
    subcategory_id: number,
    product_photos: FileList[],
    initialPhotos: any[]
}

export interface PartnerI {
    id: number
    photo: string
}

export interface ParamDataItemI {
    name: string
    size: string
}

export interface PostPromocodeI {
    id: number,
    name: string
    activations_count: string
    sale_percent: string
}

export interface Attachment {
    id: number
    file: string
}

export interface Message {
    id: number
    role: string
    text: string
    created_at: string
    attachments: Attachment[]
}

export interface SupportTicketI {
    id: number
    user: UserI
    status: string
    created_at: string
    closed_at: string
    messages: Message[]
    last_message: string
}

export interface OrderI {
    id: number
    number: string
    promocode: {
        id: number
        name: string
        activations_count: number
        sale_percent: number
    }
    straight: boolean
    result_price: string
    created_datetime: string
    status: string
    email: string
    payment_type: string
    order_parameters: {
        id: number
        parameter: {
            id: number
            title: string
            description: string
            price: string
            has_sale: boolean
            sale_price: string
            give_type: string
            order_id: number
            product_id: number
            sale_percent: number
        }
        count: number
    }[]
    user_id: number
}

export interface PurchaseI {
    id: number
    number: string
    result_price: number
    order_data:  {
        count: number
        give_type: string
        id: number
        items: string[]
        title: string
    }[]
    uri?: string

}

export interface ReplenishI {
    id: number
    number: string
    result_price: string
    payment_type: string
    status: string
    created_datetime: string
    payed_datetime: string
    user_id: number
}

export interface PaymentI {
    number: string
    result_price: string
    payment_type: string
    status: string
    created_datetime: string
}

export interface TelegramDataI {
    token: string
    telegram_ids: number[]
}

export interface AdminOrderI {
    number: string
    order_id: number
    date: string
    email: string
    product: string
    give_type: string
    count: number
}

export interface RequestI {
    contact_type: string
    contact: string
    files: string[]
    count: number
    full_name: string
    description: string
}

