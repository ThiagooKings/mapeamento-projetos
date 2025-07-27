import { Module } from '@nestjs/common';
import { ProjectModule } from './modules/project/project.module';

@Module({
  imports: [ProjectModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
