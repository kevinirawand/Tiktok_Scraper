import BaseRoutes from '../../base_claseses/base-routes';
import tryCatch from '../../utils/tryCatcher';
import TestController from './test-controller';

class TestRoutes extends BaseRoutes {
   public routes(): void {
      this.router.get('/', tryCatch(TestController.index));
   }
}

export default new TestRoutes().router;
