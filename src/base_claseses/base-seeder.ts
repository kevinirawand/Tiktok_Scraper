import ISeeder from '../interfaces/seeder-interface';

abstract class BaseSeeder implements ISeeder {
   public data: any[];
   protected model: any;

   constructor(data: any[], model: any) {
      this.data = data;
      this.model = model;
   }

   public createSeeder = (): void => {
      this.data.map((seed) => {
         this.model.create(seed);
      });
   };
}

export default BaseSeeder;
