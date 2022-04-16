import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CreateRestaurantDto } from './dto/create-restaurant.dto'
import { Restaurant } from './entities/restaurant.entity'
import { RestaurantService } from './restaurants.resolver'

@Resolver(() => Restaurant)
export class RestaurantResolver {
    constructor(private readonly restaurantService: RestaurantService) {}

    @Query(() => [Restaurant])
    restaurants(): Promise<Restaurant[]> {
        return this.restaurantService.getAll()
    }

    @Mutation(() => Boolean)
    createRestaurant(
        @Args() createRestaurantDto: CreateRestaurantDto,
    ): boolean {
        console.log(createRestaurantDto)
        return true
    }
}
