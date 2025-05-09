export type UserDetailsDTO = {
    name: string,
    email: string,
    password: string,
    username: string
    id: string,
    role:string,
}

export type CreateUserDTO = UserDetailsDTO

export type UserResponseDTO = Omit<UserDetailsDTO, 'password'>;