export interface User {
    id: string
    username: string
    email: string
    full_name: string
    role: "ADMIN"
    created_at: string
}

export interface Classification {
    id: number
    code: string
    description: string
    shelf_location?: string
    created_at: string
    updated_at: string
}

export interface IncomingLetter {
    id: string
    letter_number: string
    sender: string
    incoming_date: string
    subject: string
    file_url?: string
    classification_id?: number
    number_of_copies: number
    archive_file_number?: string
    is_archived: boolean
    recorded_by_user_id: string
    created_at: string
    updated_at: string
}

export interface OutgoingLetter {
    id: string
    letter_number: string
    destination: string
    outgoing_date: string
    subject: string
    file_url?: string
    classification_id?: number
    number_of_copies: number
    archive_file_number?: string
    is_archived: boolean
    recorded_by_user_id: string
    created_at: string
    updated_at: string
}

export interface FAQ {
    id: number
    question: string
    answer: string
    sort_order: number
    created_at: string
    updated_at: string
}
