import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Restaurant } from './entities/restaurant.entity'
import { RestaurantService } from './restaurants.resolver'
import { RestaurantResolver } from './restaurants.service'

@Module({
    imports: [TypeOrmModule.forFeature([Restaurant])],
    providers: [RestaurantResolver, RestaurantService],
})
export class RestaurantsModule {}
