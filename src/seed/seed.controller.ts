import { Controller, Get} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interface/valid-roles';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(
    private readonly seedService: SeedService
    
    ) {}

  @Get()
  //@Auth( ValidRoles.admin ) // Se valida el usuario contra la bd y solo si tiene el role de admin podrá usar la seed
  executedSeed(){
    return this.seedService.runSeed();
  }
}
