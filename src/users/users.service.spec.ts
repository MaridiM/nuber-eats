import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { JwtService } from 'src/jwt/jwt.service'
import { MailService } from 'src/mail/mail.service'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { Verification } from './entities/verification.entity'
import { UsersService } from './users.service'

// Mock  data fo dependencies of UserService
const mockRepository = () => ({
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
})
const mockJwtService = () => ({
    sign: jest.fn(),
    verify: jest.fn(),
})
const mockMailService = () => ({
    sendVerificationEmail: jest.fn(),
})

//  get all fn from  repository, using Partial, Record  type, where T is  a repository
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>

describe('UserService', () => {
    let service: UsersService
    // for using user repository
    // and get all fn from  user repository, using Partial, Record  type
    let usersRepository: MockRepository<User>
    let verificationsRepository: MockRepository<Verification>
    let mailService: MailService

    // Before testing
    // Connecting and create all dependencies of userService for  testing
    beforeAll(async () => {
        // Create testing  module with  providers UsersService
        const module = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    // For User Repository
                    provide: getRepositoryToken(User),
                    useValue: mockRepository(),
                },
                {
                    // For Verification Repository
                    provide: getRepositoryToken(Verification),
                    useValue: mockRepository(),
                },
                {
                    // For JwtService
                    provide: JwtService,
                    useValue: mockJwtService(),
                },
                {
                    // For MailService
                    provide: MailService,
                    useValue: mockMailService(),
                },
            ],
        }).compile()
        service = module.get<UsersService>(UsersService) // get testing service
        mailService = module.get<MailService>(MailService) // get MailService
        usersRepository = module.get(getRepositoryToken(User)) // get repository of user
        verificationsRepository = module.get(getRepositoryToken(Verification)) // get repository of Verification
    })

    // Result if success result
    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    // Set todo for testing users.service
    it.todo('createAccount')
    it.todo('login')
    it.todo('findById')
    it.todo('editProfile')
    it.todo('verifyEmail ')

    // Test of createAccount
    describe('createAccount', () => {
        const createAccountArgs = {
            email: 'bs@email.com',
            password: 'bs.password',
            role: 0,
        }
        // Test if user exist
        it('should fail if user exist', async () => {
            // Mock for
            usersRepository.findOne.mockResolvedValue({
                id: 1,
                email: '',
            })

            // Request to create account
            const result = await service.createAccount(createAccountArgs)
            // Check result and return answer
            expect(result).toMatchObject({
                ok: false,
                error: 'There is user with that email already',
            })
        })

        // Create a new user
        it('should create a new user', async () => {
            // Mock response of existing user
            usersRepository.findOne.mockResolvedValue(undefined)
            usersRepository.create.mockReturnValue(createAccountArgs)
            usersRepository.save.mockResolvedValue(createAccountArgs)

            verificationsRepository.create.mockReturnValue({ user: createAccountArgs })
            verificationsRepository.save.mockResolvedValue({ code: 'code' })

            // Request to create account
            await service.createAccount(createAccountArgs)

            expect(usersRepository.create).toHaveBeenCalledTimes(1)
            expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs)

            expect(usersRepository.save).toHaveBeenCalledTimes(1)
            expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs)

            expect(verificationsRepository.create).toHaveBeenCalledTimes(1)
            expect(verificationsRepository.create).toHaveBeenCalledWith({ user: createAccountArgs })

            expect(verificationsRepository.save).toHaveBeenCalledTimes(1)
            expect(verificationsRepository.save).toHaveBeenCalledWith({ user: createAccountArgs })

            expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1)
            expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(expect.any(String), expect.any(String))
        })
    })
})
