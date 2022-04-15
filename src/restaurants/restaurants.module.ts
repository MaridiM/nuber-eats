import { Module } from '@nestjs/common'
import { RestaurantResolver } from './restaurants.service'

@Module({
    providers: [RestaurantResolver],
})
export class RestaurantsModule {}
