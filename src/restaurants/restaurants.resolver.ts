import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CreateRestaurantDto } from './dto/create-restaurant.dto'
import { UpdateRestaurantDto } from './dto/update-restaurant.dto'
import { Restaurant } from './entities/restaurant.entity'
import { RestaurantService } from './restaurants.service'

@Resolver(() => Restaurant)
export class RestaurantResolver {
    constructor(private readonly restaurantService: RestaurantService) {}

    @Query(() => [Restaurant])
    restaurants(): Promise<Restaurant[]> {
        return this.restaurantService.getAll()
    }

    @Mutation(() => Boolean)
    async createRestaurant(
        @Args('input') createRestaurantDto: CreateRestaurantDto,
    ): Promise<boolean> {
        try {
            await this.restaurantService.createRestaurant(createRestaurantDto)
        } catch (error) {
            console.log(error)
            return false
        }
        return true
    }

    @Mutation(() => Boolean)
    async updateRestaurant(
        @Args() updateRestaurantDto: UpdateRestaurantDto,
    ): Promise<boolean> {
        try {
            await this.restaurantService.updateRestaurant(updateRestaurantDto)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
}
